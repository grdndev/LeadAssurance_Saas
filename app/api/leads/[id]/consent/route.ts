import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ConsentPDF } from "@/components/leads/ConsentPDF";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id: leadId } = await params;

        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { consent: true }
        });

        if (!lead || !lead.consent) {
            return NextResponse.json({ error: "Lead ou consentement non trouvé" }, { status: 404 });
        }

        // Vérifier que le courtier est bien celui qui a acheté le lead
        if (lead.brokerId !== (session.user as any).id && (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const buffer = await renderToBuffer(
            React.createElement(ConsentPDF, {
                lead: lead,
                consent: lead.consent
            })
        );

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Consentement_${lead.lastName}.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF Export error:", error);
        return NextResponse.json({ error: "Erreur lors de la génération du PDF" }, { status: 500 });
    }
}
