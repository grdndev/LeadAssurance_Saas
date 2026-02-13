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

        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                credits: true,
                phone: true,
                companyName: true,
                siret: true,
                orias: true,
                address: true,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();

        // Whitelist of updatable fields
        const allowedFields = ["name", "phone", "companyName", "siret", "orias", "address"];
        const data: Record<string, string> = {};

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        }

        const user = await prisma.user.update({
            where: { id: (session.user as any).id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                credits: true,
                phone: true,
                companyName: true,
                siret: true,
                orias: true,
                address: true,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}
