import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";
import { sendEmail, emailTemplates } from "@/lib/mail";
import { getProductById } from "@/lib/constants/products";

// PATCH /api/user/leads/[id]/appointment — broker updates appointment status
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
        const { appointmentStatus } = await req.json();

        const validStatuses = ["CONFIRMED", "CANCELLED"];
        if (!validStatuses.includes(appointmentStatus)) {
            return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
        }

        // Ensure this broker actually owns this lead and it is an appointment
        const lead = await prisma.lead.findUnique({
            where: { id },
            include: { consent: true },
        });

        if (!lead || lead.brokerId !== (session.user as any).id) {
            return NextResponse.json({ error: "Lead non trouvé ou accès refusé" }, { status: 404 });
        }

        if (lead.leadType !== "APPOINTMENT") {
            return NextResponse.json({ error: "Ce lead n'est pas un RDV" }, { status: 400 });
        }

        const updated = await prisma.lead.update({
            where: { id },
            data: {
                appointmentStatus,
                confirmationSentAt: appointmentStatus === "CONFIRMED" ? new Date() : undefined,
            },
        });

        await writeAuditLog({
            userId: (session.user as any).id,
            action: "BROKER_STATUS_CHANGED",
            entityType: "Lead",
            entityId: id,
            details: { appointmentStatus, leadType: "APPOINTMENT" },
        });

        // Send confirmation email to broker
        const broker = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
        const product = getProductById(lead.productType);

        if (broker) {
            const template = emailTemplates.appointmentStatusChanged(
                broker.name || broker.email,
                appointmentStatus,
                product?.name || lead.productType
            );
            await sendEmail({ to: broker.email, ...template });
        }

        return NextResponse.json({ success: true, lead: updated });
    } catch (error) {
        console.error("Appointment status update error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
