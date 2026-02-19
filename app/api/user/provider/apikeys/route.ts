import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomBytes, createHash } from "crypto";

// Generate a secure API key: la_<random32hex>
function generateApiKey(): { raw: string; hashed: string; prefix: string } {
    const raw = "la_" + randomBytes(24).toString("hex");
    const hashed = createHash("sha256").update(raw).digest("hex");
    const prefix = raw.slice(0, 11); // "la_" + 8 chars
    return { raw, hashed, prefix };
}

// GET /api/user/provider/apikeys — list all api keys for provider (no raw key)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "PROVIDER") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const keys = await prisma.apiKey.findMany({
            where: { userId: (session.user as any).id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                prefix: true,
                active: true,
                lastUsedAt: true,
                expiresAt: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ keys });
    } catch (error) {
        console.error("API keys fetch error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/user/provider/apikeys — create a new key
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "PROVIDER") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { name } = await req.json();
        if (!name?.trim()) {
            return NextResponse.json({ error: "Un nom est requis" }, { status: 400 });
        }

        // Limit to 10 active keys per provider
        const existing = await prisma.apiKey.count({
            where: { userId: (session.user as any).id, active: true },
        });
        if (existing >= 10) {
            return NextResponse.json({ error: "Limite de 10 clés actives atteinte" }, { status: 400 });
        }

        const { raw, hashed, prefix } = generateApiKey();

        await prisma.apiKey.create({
            data: {
                userId: (session.user as any).id,
                name: name.trim(),
                key: hashed,
                prefix,
                active: true,
            },
        });

        // Return the raw key ONCE — it won't be retrievable again
        return NextResponse.json({ key: raw, prefix, name: name.trim() }, { status: 201 });
    } catch (error) {
        console.error("API key create error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/user/provider/apikeys — revoke a key by id
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "PROVIDER") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

        const key = await prisma.apiKey.findFirst({
            where: { id, userId: (session.user as any).id },
        });
        if (!key) return NextResponse.json({ error: "Clé introuvable" }, { status: 404 });

        await prisma.apiKey.update({
            where: { id },
            data: { active: false },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API key revoke error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
