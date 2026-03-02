import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { userId } = await req.json();

        if (userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            return NextResponse.json({
                user
            });
        } else {
            const users = await prisma.user.findMany();

            return NextResponse.json({
                users
            });
        }
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { userId, ...updates } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updates
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("User update error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/user/provider/apikeys — revoke a key by id
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: "ID requis" }, { status: 400 });

        const key = await prisma.user.findFirst({
            where: { id: userId },
        });
        if (!key) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("User Delete error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
