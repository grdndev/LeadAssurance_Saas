import { z } from "zod";

// Schéma de base pour un lead
export const leadBaseSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone français invalide"),
    email: z.string().email("Email invalide"),
    zipCode: z.string().regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
    city: z.string().min(2, "Ville invalide"),
});

// Schéma pour la soumission d'un lead (Provider)
export const submitLeadSchema = leadBaseSchema.extend({
    productType: z.enum([
        "ASSURANCE_AUTO",
        "ASSURANCE_HABITATION",
        "ASSURANCE_SANTE",
        "ASSURANCE_VIE",
        "ASSURANCE_ANIMAUX"
    ]),
    attributes: z.record(z.any()).optional(),
    isAppointment: z.boolean().default(false),
    isExclusive: z.boolean().default(true),
    price: z.number().positive("Le prix doit être positif").min(5, "Prix minimum: 5€"),

    // Consentement obligatoire
    consent: z.object({
        consentText: z.string().min(50, "Le texte de consentement est trop court"),
        ipAddress: z.string(),
        userAgent: z.string().min(1, "User agent requis"),
        urlSource: z.string().url("URL source invalide"),
    }),
});

// Schéma pour l'achat d'un lead (Broker)
export const purchaseLeadSchema = z.object({
    leadId: z.string().cuid("ID de lead invalide"),
});

// Schéma pour l'import de leads en masse
export const importLeadsSchema = z.object({
    leads: z.array(submitLeadSchema).min(1, "Au moins un lead requis").max(100, "Maximum 100 leads par import"),
});

// Schéma pour les filtres de marketplace
export const marketplaceFiltersSchema = z.object({
    productType: z.string().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    zipCode: z.string().regex(/^\d{5}$/).optional(),
    isExclusive: z.boolean().optional(),
    isAppointment: z.boolean().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});

export type SubmitLeadInput = z.infer<typeof submitLeadSchema>;
export type PurchaseLeadInput = z.infer<typeof purchaseLeadSchema>;
export type ImportLeadsInput = z.infer<typeof importLeadsSchema>;
export type MarketplaceFilters = z.infer<typeof marketplaceFiltersSchema>;
