import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "100");
        const action = searchParams.get("action");

        const logs = await prisma.auditLog.findMany({
            where: action ? { action } : undefined,
            orderBy: { createdAt: "desc" },
            take: Math.min(limit, 500),
        });

        return NextResponse.json({ logs });
    } catch (error) {
        console.error("Audit log fetch error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
