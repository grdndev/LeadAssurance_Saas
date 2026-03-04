import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import z, { ZodError } from "zod";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
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

const schema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    phone: z.string().regex(/(\+\d{11,12})|(^0\d{9})|(^$)/, { error: "Veuillez entrer un numéro de téléphone valide" }).optional(),
    companyName: z.string().optional(),
    siret: z.string().regex(/(^$)|([\d\s]{14,})/, { error: "Veuillez entrer un numéro SIRET valide" }).optional(),
    orias: z.string().regex(/(^$)|(\d+)/, { error: "Veuillez entrer un numéro ORIAS valide" }).optional(),
    address: z.string().optional(),
    password: z.string().optional(),
    confirm: z.string().optional()
}).refine((data) => data.password === undefined ||
    data.password === data.confirm, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirm"]
});

export async function PATCH(request: Request) {
    try {
        const json = await request.json();
        const body = schema.parse(json)

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
            body.confirm = undefined;
        }

        const user = await prisma.user.update({
            where: { id: (session.user as any).id },
            data: {...body},
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                credits: true,
                phone: true,
                companyName: true,
                siret: true,
                orias: true,
                address: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.issues.map(e => e.message).join(", ") }, { status: 500 });
        }

        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}
