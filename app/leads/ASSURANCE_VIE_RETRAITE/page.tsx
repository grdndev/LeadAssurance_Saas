import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Assurance Vie & Retraite (PER) - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance vie, PER et produits d'épargne retraite",
};

export default function AssuranceVieRetraitePage() {
    const productConfig = {
        productType: "ASSURANCE_VIE_RETRAITE",
        title: "Assurance Vie & Retraite (PER)",
        description: "Générez un lead pour une assurance vie ou un plan d'épargne retraite",
        fields: [
            {
                name: "objective",
                label: "Objectif principal",
                type: "select" as const,
                required: true,
                options: [
                    "Épargne libre",
                    "Préparer ma retraite",
                    "Transmission patrimoine",
                    "Défiscalisation",
                ],
            },
            {
                name: "amountToInvest",
                label: "Montant à investir",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 10 000 €",
                    "10 000 - 50 000 €",
                    "50 000 - 150 000 €",
                    "Plus de 150 000 €",
                ],
            },
            {
                name: "paymentType",
                label: "Type de versement",
                type: "select" as const,
                required: true,
                options: ["Versement ponctuel", "Versements mensuels", "Les deux"],
            },
            {
                name: "timeHorizon",
                label: "Horizon de placement",
                type: "select" as const,
                required: true,
                options: ["1-3 ans", "3-8 ans", "8 ans et plus"],
            },
            {
                name: "riskProfile",
                label: "Profil de risque",
                type: "select" as const,
                required: false,
                options: ["Prudent", "Équilibré", "Dynamique", "Je ne sais pas"],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
