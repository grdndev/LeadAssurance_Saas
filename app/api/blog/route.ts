import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const slug = await req.nextUrl.searchParams.get('slug') ?? null;

        if (slug) {
            const article = await prisma.article.findUnique({
                where: { slug, published: true },
                include: { author: true }
            });

            // convert image buffer to base64 string for JSON without mutating
            let result = article;
            if (article && article.image) {
                result = {
                    ...article,
                    image: Buffer.from(article.image as any).toString("base64")
                } as any;
            }

            return NextResponse.json({
                article: result
            });
        } else {
            const articles = await prisma.article.findMany({ where: { published: true },  include: { author: true } });
            // map to new objects and convert image
            const sanitized = articles.map((a) => {
                if (a.image) {
                    return {
                        ...a,
                        image: Buffer.from(a.image as any).toString("base64")
                    };
                }
                return a;
            });

            return NextResponse.json({
                articles: sanitized
            });
        }
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}