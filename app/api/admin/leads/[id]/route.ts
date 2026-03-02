import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyLeadApproved, notifyLeadRejected } from "@/lib/notifications";
import { writeAuditLog } from "@/lib/audit";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const { id: leadId } = await params;

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { firstName, lastName, phone, email, zipCode, city, price } = await request.json();

        if (!leadId) {
            return NextResponse.json({ error: "Une erreur s'est produite" }, { status: 400 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                firstName,
                lastName,
                phone,
                email,
                zipCode,
                city,
                price
            }
        });

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error) {
        console.error("Admin lead update error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}