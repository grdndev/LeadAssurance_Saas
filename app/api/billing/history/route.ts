import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                type: "CREDIT_PURCHASE"
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error("Billing history error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
