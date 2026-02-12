import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "RC Professionnelle - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance responsabilité civile professionnelle",
};

export default function RCProPage() {
    const productConfig = {
        productType: "RC_PRO",
        title: "RC Professionnelle",
        description: "Générez un lead pour une assurance responsabilité civile professionnelle",
        fields: [
            {
                name: "activity",
                label: "Activité professionnelle",
                type: "text" as const,
                required: true,
                placeholder: "Ex: Consultant, Architecte, Artisan...",
            },
            {
                name: "legalStatus",
                label: "Statut juridique",
                type: "select" as const,
                required: true,
                options: [
                    "Auto-entrepreneur",
                    "EURL / SARL",
                    "SAS / SASU",
                    "Association",
                    "Profession libérale",
                    "Autre",
                ],
            },
            {
                name: "annualRevenue",
                label: "Chiffre d'affaires annuel",
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
                name: "creationDate",
                label: "Date de création de l'entreprise",
                type: "date" as const,
                required: true,
            },
            {
                name: "employees",
                label: "Nombre de salariés",
                type: "select" as const,
                required: false,
                options: ["0", "1-5", "6-10", "Plus de 10"],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
