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
                providerId: (session.user as any).id,
            },
            include: {
                consent: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error("Fetch provider leads error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
