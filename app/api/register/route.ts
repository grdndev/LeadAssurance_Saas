import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
    try {
        const { email, password, name, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json(
                { error: "Données manquantes" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Cet email est déjà utilisé" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role.toUpperCase(), // "BROKER" or "PROVIDER"
                credits: role.toUpperCase() === "BROKER" ? 0 : 0,
            },
        });

        writeAuditLog({
            userId: user.id,
            action: "USER_REGISTERED",
            entityType: "User",
            entityId: user.id,
            details: { email: user.email, role: user.role },
            ipAddress: req.headers.get("x-forwarded-for") || undefined,
        });

        return NextResponse.json(
            { message: "Utilisateur créé avec succès", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de l'inscription" },
            { status: 500 }
        );
    }
}
