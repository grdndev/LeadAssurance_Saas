import { z } from "zod";

// Schéma d'inscription
export const registerSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
        .regex(/[a-z]/, "Doit contenir au moins une minuscule")
        .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    role: z.enum(["BROKER", "PROVIDER"]),
});

// Schéma de connexion
export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
