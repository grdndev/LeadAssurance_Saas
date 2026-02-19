import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const disputes = await prisma.dispute.findMany({
            include: {
                lead: true,
                broker: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ disputes });
    } catch (error) {
        console.error("Admin disputes error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { disputeId, resolution } = await request.json(); // resolution: 'REFUND' or 'REJECT'

        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { lead: true }
        });

        if (!dispute) {
            return NextResponse.json({ error: "Litige non trouvé" }, { status: 404 });
        }

        if (resolution === "REFUND") {
            // Start transaction: refund credits to broker, mark as resolved
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: dispute.brokerId },
                    data: { credits: { increment: dispute.lead.price } }
                }),
                prisma.transaction.create({
                    data: {
                        userId: dispute.brokerId,
                        type: "REFUND",
                        amount: 0,
                        credits: dispute.lead.price,
                        description: `Remboursement litige lead #${dispute.leadId}`
                    }
                }),
                prisma.dispute.update({
                    where: { id: disputeId },
                    data: { status: "RESOLVED_REFUNDED" }
                }),
                prisma.lead.update({
                    where: { id: dispute.leadId },
                    data: { status: "DISPUTED" }
                })
            ]);
        } else {
            await prisma.dispute.update({
                where: { id: disputeId },
                data: { status: "RESOLVED_REJECTED" }
            });
        }

        writeAuditLog({
            userId: (session.user as any).id,
            action: "DISPUTE_RESOLVED",
            entityType: "Dispute",
            entityId: disputeId,
            details: { resolution, leadId: dispute.leadId, refunded: resolution === "REFUND" },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin dispute resolution error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
