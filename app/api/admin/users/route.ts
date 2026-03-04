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

        const userId = await req.nextUrl.searchParams.get('userId') ?? null;

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

const schema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    phone: z.string().regex(/(\+\d{11,12})|(^0\d{9})|(^$)/, { error: "Veuillez entrer un numéro de téléphone valide" }).optional(),
    companyName: z.string().optional(),
    siret: z.string().regex(/(^$)|([\d\s]{14,})/, { error: "Veuillez entrer un numéro SIRET valide" }).optional(),
    orias: z.string().regex(/(^$)|(\d+)/, { error: "Veuillez entrer un numéro ORIAS valide" }).optional(),
    address: z.string().optional()
})

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { userId, ...data } = await req.json();
        const updates = schema.parse(data);

        const user = await prisma.user.findUnique({
            where: {id: userId}
        })

        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable"}, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...updates
            }
        });

        return NextResponse.json({ user: updatedUser });
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
