import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const json = await req.json();

        const found = await prisma.article.findUnique({
            where: { id: json.id }
        })

        if (!found) {
            return NextResponse.json({ error: "Article introuvable"}, { status: 404 });
        }

        const updatedArticle = await prisma.article.update({
            where: { id: json.id },
            data: { published: !found.published }
        });

        return NextResponse.json({ article: updatedArticle }, {status: 200});
    } catch (error) {
        console.error("Post Article error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}