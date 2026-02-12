import { z } from "zod";

// Schéma pour le checkout
export const checkoutSchema = z.object({
    amount: z.number().positive("Le montant doit être positif").multipleOf(0.01, "Montant invalide"),
    credits: z.number().int().positive("Le nombre de crédits doit être positif"),
});

// Schéma pour la transaction
export const transactionSchema = z.object({
    userId: z.string().cuid("ID utilisateur invalide"),
    type: z.enum(["CREDIT_PURCHASE", "LEAD_PURCHASE", "LEAD_SALE", "REFUND"]),
    amount: z.number(),
    credits: z.number(),
    description: z.string().min(1, "Description requise"),
    metadata: z.record(z.any()).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
