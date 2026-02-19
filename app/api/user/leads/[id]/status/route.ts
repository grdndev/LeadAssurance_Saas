import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";

// PATCH /api/user/leads/[id]/status — broker updates CRM status of a purchased lead
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "BROKER") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id } = await params;
        const { brokerStatus, lossReason } = await req.json();

        const validStatuses = ["CONTACTED", "CONVERTED", "LOST"];
        if (!validStatuses.includes(brokerStatus)) {
            return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
        }

        // Ensure this broker actually owns this lead
        const lead = await prisma.lead.findUnique({ where: { id } });
        if (!lead || lead.brokerId !== (session.user as any).id) {
            return NextResponse.json({ error: "Lead non trouvé ou accès refusé" }, { status: 404 });
        }

        const updated = await prisma.lead.update({
            where: { id },
            data: {
                brokerStatus,
                lossReason: brokerStatus === "LOST" ? lossReason || null : null,
            },
        });

        await writeAuditLog({
            userId: (session.user as any).id,
            action: "BROKER_STATUS_CHANGED",
            entityType: "Lead",
            entityId: id,
            details: { brokerStatus, lossReason: brokerStatus === "LOST" ? lossReason || null : null },
        });

        return NextResponse.json({ success: true, lead: updated });
    } catch (error) {
        console.error("Update broker status error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
