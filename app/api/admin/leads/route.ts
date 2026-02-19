import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyLeadApproved, notifyLeadRejected } from "@/lib/notifications";
import { writeAuditLog } from "@/lib/audit";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "PENDING_APPROVAL";

        const leads = await prisma.lead.findMany({
            where: { status },
            include: {
                provider: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                consent: true
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ leads });
    } catch (error) {
        console.error("Admin leads error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { leadId, status, rejectionReason } = await request.json();

        if (!leadId || !["STOCK", "REJECTED"].includes(status)) {
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                status,
                rejectionReason: status === "REJECTED" ? (rejectionReason || "Non conforme") : null,
            }
        });

        // Notify the provider of the decision
        if (status === "STOCK") {
            await notifyLeadApproved(updatedLead.providerId, updatedLead.id, updatedLead.productType);
        } else if (status === "REJECTED") {
            await notifyLeadRejected(updatedLead.providerId, updatedLead.id, updatedLead.productType, rejectionReason);
        }

        // Audit log
        await writeAuditLog({
            userId: (session.user as any).id,
            action: status === "STOCK" ? "LEAD_APPROVED" : "LEAD_REJECTED",
            entityType: "Lead",
            entityId: updatedLead.id,
            details: { status, rejectionReason: rejectionReason || null },
        });

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error) {
        console.error("Admin lead update error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
