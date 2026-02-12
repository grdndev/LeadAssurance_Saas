import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Défiscalisation - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour les solutions de défiscalisation et investissements patrimoniaux",
};

export default function DefiscalisationPage() {
    const productConfig = {
        productType: "DEFISCALISATION",
        title: "Défiscalisation",
        description: "Générez un lead pour une solution de défiscalisation patrimoniale",
        fields: [
            {
                name: "objective",
                label: "Objectif principal",
                type: "select" as const,
                required: true,
                options: [
                    "Réduire mes impôts",
                    "Préparer ma retraite",
                    "Investissement immobilier",
                    "Transmission patrimoine",
                ],
            },
            {
                name: "annualTaxAmount",
                label: "Montant d'impôt annuel (approx.)",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 5 000 €",
                    "5 000 - 15 000 €",
                    "15 000 - 50 000 €",
                    "Plus de 50 000 €",
                    "Je ne sais pas",
                ],
            },
            {
                name: "investmentCapacity",
                label: "Capacité d'investissement",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 50 000 €",
                    "50 000 - 150 000 €",
                    "150 000 - 500 000 €",
                    "Plus de 500 000 €",
                ],
            },
            {
                name: "timeHorizon",
                label: "Horizon d'investissement",
                type: "select" as const,
                required: true,
                options: ["Court terme (1-3 ans)", "Moyen terme (3-8 ans)", "Long terme (8+ ans)"],
            },
            {
                name: "preferredSolution",
                label: "Solution privilégiée (si idée)",
                type: "select" as const,
                required: false,
                options: [
                    "Loi Pinel / immobilier",
                    "FCPI / FIP",
                    "PER / épargne retraite",
                    "PERP / Madelin",
                    "Je ne sais pas",
                    "Autre",
                ],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
