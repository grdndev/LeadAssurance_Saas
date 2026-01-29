import { Lead, Consent, User } from "@prisma/client";

// Types for the application
export type LeadWithRelations = Lead & {
    consent: Consent | null;
    provider: Pick<User, "id" | "name" | "email">;
    broker?: Pick<User, "id" | "name" | "email"> | null;
};

export type LeadStatus = "STOCK" | "RESERVED" | "SOLD" | "REJECTED";

export type BrokerLeadStatus = "new" | "contacted" | "sold" | "lost";

export interface LeadFilters {
    productType?: string;
    status?: LeadStatus;
    zipCode?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface CreateLeadInput {
    productType: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    zipCode: string;
    city: string;
    attributes: Record<string, any>;
    isAppointment: boolean;
    price: number;
    consent: {
        consentText: string;
        ipAddress: string;
        userAgent: string;
        urlSource: string;
    };
}

export interface ReservationResult {
    success: boolean;
    message: string;
    reservationId?: string;
    expiresAt?: Date;
}

export interface PurchaseResult {
    success: boolean;
    message: string;
    lead?: LeadWithRelations;
}

// Mock data for demonstration
export const MOCK_LEADS: Omit<LeadWithRelations, "provider" | "broker">[] = [
    {
        id: "lead-1",
        productType: "CREDIT_IMMO",
        status: "STOCK",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
        phone: "0601020304",
        zipCode: "75001",
        city: "Paris",
        attributes: { projectType: "Résidence principale", amount: 350000, income: 4500 },
        isAppointment: false,
        isExclusive: true,
        price: 45,
        providerId: "provider-1",
        brokerId: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(),
        consent: {
            id: "consent-1",
            leadId: "lead-1",
            consentText: "J'accepte d'être contacté par un courtier partenaire pour mon projet de crédit immobilier.",
            ipAddress: "92.184.105.42",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            urlSource: "https://comparateur-credit.fr/credit-immobilier",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            proofHash: "sha256:abc123def456..."
        }
    },
    {
        id: "lead-2",
        productType: "ASSURANCE_EMPRUNTEUR",
        status: "STOCK",
        firstName: "Marie",
        lastName: "Martin",
        email: "m.martin@email.com",
        phone: "0612345678",
        zipCode: "69002",
        city: "Lyon",
        attributes: { requestType: "Changement", loanAmount: 200000, age: 34, smoker: false },
        isAppointment: true,
        isExclusive: true,
        price: 55,
        providerId: "provider-1",
        brokerId: null,
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        updatedAt: new Date(),
        consent: {
            id: "consent-2",
            leadId: "lead-2",
            consentText: "J'accepte d'être recontacté pour un rendez-vous concernant mon assurance emprunteur.",
            ipAddress: "176.132.45.12",
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
            urlSource: "https://assurance-pret.fr/changement",
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            proofHash: "sha256:def789ghi012..."
        }
    },
    {
        id: "lead-3",
        productType: "MUTUELLE_SANTE_IND",
        status: "STOCK",
        firstName: "Pierre",
        lastName: "Durand",
        email: "p.durand@email.com",
        phone: "0698765432",
        zipCode: "13008",
        city: "Marseille",
        attributes: { peopleCount: 2, age: 45, regime: "Salarié", priority: "Dentaire" },
        isAppointment: false,
        isExclusive: true,
        price: 28,
        providerId: "provider-2",
        brokerId: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        updatedAt: new Date(),
        consent: {
            id: "consent-3",
            leadId: "lead-3",
            consentText: "J'accepte d'être contacté pour recevoir des devis de mutuelle santé.",
            ipAddress: "82.67.123.89",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            urlSource: "https://mutuelle-comparateur.fr/sante",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            proofHash: "sha256:ghi345jkl678..."
        }
    },
    {
        id: "lead-4",
        productType: "RACHAT_CREDIT",
        status: "STOCK",
        firstName: "Sophie",
        lastName: "Bernard",
        email: "s.bernard@email.com",
        phone: "0687654321",
        zipCode: "33000",
        city: "Bordeaux",
        attributes: { owner: true, creditCount: 3, monthlyPayments: 1200, totalDebt: 75000, familySituation: "Marié(e)", income: 3200 },
        isAppointment: false,
        isExclusive: true,
        price: 52,
        providerId: "provider-1",
        brokerId: null,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        updatedAt: new Date(),
        consent: {
            id: "consent-4",
            leadId: "lead-4",
            consentText: "J'accepte d'être contacté concernant ma demande de rachat de crédits.",
            ipAddress: "109.23.67.145",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0",
            urlSource: "https://rachat-credit-online.fr",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            proofHash: "sha256:jkl901mno234..."
        }
    },
    {
        id: "lead-5",
        productType: "DEFISCALISATION",
        status: "STOCK",
        firstName: "François",
        lastName: "Petit",
        email: "f.petit@email.com",
        phone: "0654321098",
        zipCode: "31000",
        city: "Toulouse",
        attributes: { objective: "Réduire impôts", taxAmount: "10 000 - 20 000€", investmentCapacity: "500 - 1000€/mois", horizon: "Long terme" },
        isAppointment: true,
        isExclusive: true,
        price: 85,
        providerId: "provider-2",
        brokerId: null,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        updatedAt: new Date(),
        consent: {
            id: "consent-5",
            leadId: "lead-5",
            consentText: "J'accepte d'être recontacté par un conseiller en gestion de patrimoine pour un rendez-vous.",
            ipAddress: "88.167.234.56",
            userAgent: "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)",
            urlSource: "https://defiscalisation-patrimoine.fr/contact",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            proofHash: "sha256:mno567pqr890..."
        }
    },
    {
        id: "lead-6",
        productType: "ASSURANCE_VIE_RETRAITE",
        status: "STOCK",
        firstName: "Catherine",
        lastName: "Moreau",
        email: "c.moreau@email.com",
        phone: "0623456789",
        zipCode: "44000",
        city: "Nantes",
        attributes: { objective: "Préparer retraite", amount: "50 000 - 150 000€", payment: "Mensuel", horizon: "8+ ans" },
        isAppointment: true,
        isExclusive: true,
        price: 72,
        providerId: "provider-1",
        brokerId: null,
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
        updatedAt: new Date(),
        consent: {
            id: "consent-6",
            leadId: "lead-6",
            consentText: "J'accepte d'être contacté pour un rendez-vous concernant mon projet d'épargne retraite.",
            ipAddress: "77.136.89.23",
            userAgent: "Mozilla/5.0 (Linux; Android 11; Pixel 5)",
            urlSource: "https://epargne-retraite.fr/per",
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            proofHash: "sha256:pqr123stu456..."
        }
    }
];

// Helper function to calculate freshness
export function getLeadFreshness(createdAt: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) {
        return `${diffMins} min`;
    } else if (diffHours < 24) {
        return `${diffHours}h`;
    } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}j`;
    }
}

export function isUltraFresh(createdAt: Date): boolean {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 2;
}
