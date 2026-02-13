import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { purchaseLeadSchema } from "@/lib/validations/leads";
import { sendEmail, emailTemplates } from "@/lib/mail";
import { notifyLeadPurchased, notifyLeadSold, notifyCreditLow } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "BROKER") {
            return NextResponse.json({ error: "Seuls les courtiers peuvent acheter des leads" }, { status: 401 });
        }

        const body = await req.json();
        const validation = purchaseLeadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Données invalides", details: validation.error.format() }, { status: 400 });
        }

        const { leadId } = validation.data;

        // Utiliser une transaction Prisma pour garantir l'atomicité
        const result = await prisma.$transaction(async (tx) => {
            // 1. Vérifier la disponibilité du lead et inclure le provider
            const lead = await tx.lead.findUnique({
                where: { id: leadId },
                include: { provider: true }
            });

            if (!lead || lead.status !== "STOCK") {
                throw new Error("Lead non disponible ou déjà vendu");
            }

            // 2. Vérifier les crédits du courtier
            const broker = await tx.user.findUnique({
                where: { id: (session.user as any).id },
            });

            if (!broker || broker.credits < lead.price) {
                throw new Error("Crédits insuffisants");
            }

            // 3. Déduire les crédits du courtier et enregistrer la transaction
            await tx.user.update({
                where: { id: broker.id },
                data: { credits: { decrement: lead.price } },
            });

            await tx.transaction.create({
                data: {
                    userId: broker.id,
                    type: "LEAD_PURCHASE",
                    amount: 0,
                    credits: lead.price,
                    description: `Achat lead ${lead.productType} #${lead.id}`,
                }
            });

            // 4. Créditer l'apporteur (commission 50% du prix du lead en "Cash/Earnings")
            // Note: Pour simplifier, on traite les crédits comme du cash pour l'apporteur ici
            const commission = lead.price * 0.5;
            await tx.user.update({
                where: { id: lead.providerId },
                data: { credits: { increment: commission } },
            });

            await tx.transaction.create({
                data: {
                    userId: lead.providerId,
                    type: "LEAD_SALE",
                    amount: commission,
                    credits: 0,
                    description: `${lead.productType} vendu - Commission`,
                }
            });

            // 5. Marquer le lead comme vendu et l'assigner au courtier
            const updatedLead = await tx.lead.update({
                where: { id: leadId },
                data: {
                    status: "SOLD",
                    brokerId: broker.id,
                },
            });

            return { lead: updatedLead, broker, provider: lead.provider };
        });

        // 6. Créer des notifications
        // Notify provider their lead was purchased
        await notifyLeadPurchased(
            result.lead.providerId,
            result.lead.id,
            result.lead.productType,
            result.lead.price
        );

        // Notify broker they purchased a lead
        await notifyLeadSold(
            result.broker.id,
            result.lead.id,
            result.lead.productType,
            result.lead.price
        );

        // Check if broker's credits are low (< 100€) and notify
        const remainingCredits = result.broker.credits - result.lead.price;
        if (remainingCredits < 100) {
            await notifyCreditLow(result.broker.id, remainingCredits);
        }

        // 7. Envoi des emails (en asynchrone hors de la transaction)
        const templates = emailTemplates;

        // Email au courtier
        sendEmail({
            to: (session.user as any).email,
            ...templates.leadPurchase(session.user?.name || "Courtier", result.lead.productType)
        });

        // Email à l'apporteur
        sendEmail({
            to: result.provider.email,
            ...templates.leadSale(result.provider.name || "Apporteur", result.lead.productType, result.lead.price)
        });

        return NextResponse.json({ message: "Achat réussi", lead: result.lead });
    } catch (error: any) {
        console.error("Purchase error:", error);
        return NextResponse.json({ error: error.message || "Erreur lors de l'achat" }, { status: 400 });
    }
}
