import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";
import z, { ZodError } from "zod";

const schema = z.object({
  firstname: z.string().regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Le prénom ne doit contenir que des lettres, espaces, apostrophes ou tirets"),
  lastname: z.string().regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Le nom de famille ne doit contenir que des lettres, espaces, apostrophes ou tirets"),
  email: z.email("Email invalide"),
  password: z.string()
  .min(8, "Le mot de passe doit faire au moins 8 caractères")
  .regex(/[A-Z]/, "1 majuscule requise")
  .regex(/[a-z]/, "1 minuscule requise")
  .regex(/[0-9]/, "1 chiffre requis")
  .regex(/[^A-Za-z0-9]/, "1 caractère spécial requis")
})

export async function POST(req: Request) {
    try {
        const { email, password, firstname, lastname, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json(
                { error: "Données manquantes" },
                { status: 400 }
            );
        }

        schema.parse({ firstname, lastname, email, password });

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Cet email est déjà utilisé" },
                { status: 400 }
            );
        }

        if (role.toUpperCase() === "ADMIN") {
            return NextResponse.json(
                { error: "Rôle non autorisé" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname,
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
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.issues.map(e => e.message).join(", ") }, { status: 500 });
        }

        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de l'inscription" },
            { status: 500 }
        );
    }
}
