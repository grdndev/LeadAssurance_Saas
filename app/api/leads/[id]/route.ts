import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id } = await params;

        const lead = await prisma.lead.findUnique({
            where: { id },
            include: {
                consent: true,
            },
        });

        if (!lead) {
            return NextResponse.json({ error: "Lead non trouvé" }, { status: 404 });
        }

        // Vérifier que le courtier a bien acheté ce lead (sauf admin)
        if (
            (session.user as any).role !== "ADMIN" &&
            lead.brokerId !== (session.user as any).id &&
            lead.providerId !== (session.user as any).id
        ) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error("Fetch lead for PDF error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
