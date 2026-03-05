import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import z, { ZodError } from "zod";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const articleId = await req.nextUrl.searchParams.get('articleId') ?? null;

        if (articleId) {
            const article = await prisma.article.findUnique({
                where: { id: articleId },
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
            const articles = await prisma.article.findMany({ include: { author: true } });
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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        var slug = "nouvel-article";

        var i = 1;
        var base = slug;
        while (await prisma.article.count({where: {slug: slug}})) {
            slug = `${base}-${i}`;
            i++;
        }

        const article = await prisma.article.create({
            data: {
                userId: (session.user as any).id,
                title: "Nouvel Article",
                slug,
                content: "",
                duration: 0
            }
        });

        return NextResponse.json({ article }, {status: 200});
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.issues.map(e => e.message).join(", ") }, { status: 500 });
        }

        console.error("Post Article error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

const schemaPatch = z.object({
    id: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
    clean: z.string().optional(),
    published: z.boolean().optional(),
    image: z.any().optional()
})

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const json = await req.json();
        const data = schemaPatch.parse(json);

        let imageBuffer: Buffer | undefined;
        if (data.image) {
            const raw = typeof data.image === 'string' ? data.image : '';
            const base64 = raw.startsWith('data:') ? raw.split(',')[1] : raw;
            imageBuffer = Buffer.from(base64, 'base64');
        }

        const found = await prisma.article.findUnique({
            where: { id: data.id }
        })

        if (!found) {
            return NextResponse.json({ error: "Article introuvable"}, { status: 404 });
        }

        const payload: any = {
            title: data.title ?? found.title,
            content: data.content ?? found.title,
            published: data.published ?? found.title,
            slug: found.slug ?? "nouvel-article",
            excerpt:  found.excerpt ?? "",
            duration:  found.duration ?? 0,
            publishedAt: new Date()
        };

        if (data.title) {
            payload.slug = data.title.toLowerCase().replaceAll(/[^a-zA-Z0-9\s]/g, "").trim().split(" ").slice(0,5).join("-");

            var i = 1;
            var base = payload.slug;
            while (await prisma.article.count({where: {slug: payload.slug}})) {
                payload.slug = `${base}-${i}`;
                i++;
            }
        }

        if (data.content && data.clean) {
            payload.duration = data.clean.length / 1000;
            payload.excerpt = data.clean.length > 100 ? `${data.clean.substring(0, 100)}...` : data.clean;
        }

        console.log(payload.slug);

        if (imageBuffer) {
            payload.image = imageBuffer;
        }
        const updatedArticle = await prisma.article.update({
            where: { id: data.id },
            data: payload
        });

        return NextResponse.json({ user: updatedArticle });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.issues.map(e => e.message).join(", ") }, { status: 500 });
        }

        console.error("User update error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

        const article = await prisma.article.findFirst({
            where: { id },
        });
        if (!article) return NextResponse.json({ error: "Article introuvable" }, { status: 404 });

        await prisma.article.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("User Delete error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
