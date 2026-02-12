import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const leads = await prisma.lead.findMany({
            where: {
                brokerId: (session.user as any).id,
            },
            include: {
                consent: true,
            },
            orderBy: {
                updatedAt: "desc", // Date d'achat approximative
            },
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error("Fetch user leads error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
