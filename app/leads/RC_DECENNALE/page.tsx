import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "RC Décennale - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance responsabilité civile décennale",
};

export default function RCDecennalePage() {
    const productConfig = {
        productType: "RC_DECENNALE",
        title: "RC Décennale",
        description: "Générez un lead pour une assurance responsabilité civile décennale",
        fields: [
            {
                name: "trade",
                label: "Corps de métier",
                type: "select" as const,
                required: true,
                options: [
                    "Maçon / Gros œuvre",
                    "Charpentier",
                    "Couvreur",
                    "Électricien",
                    "Plombier / Chauffagiste",
                    "Plâtrier / Plaquiste",
                    "Menuisier",
                    "Architecte",
                    "Autre",
                ],
            },
            {
                name: "companyCreationDate",
                label: "Date de création de l'entreprise",
                type: "date" as const,
                required: true,
            },
            {
                name: "annualRevenue",
                label: "Chiffre d'affaires annuel",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 100 000 €",
                    "100 000 - 300 000 €",
                    "300 000 - 800 000 €",
                    "Plus de 800 000 €",
                ],
            },
            {
                name: "workArea",
                label: "Zone d'intervention (départements)",
                type: "text" as const,
                required: true,
                placeholder: "Ex: 75, 92, 93, 94...",
            },
            {
                name: "employees",
                label: "Nombre de salariés",
                type: "select" as const,
                required: false,
                options: ["0 (seul)", "1-3", "4-9", "10 ou plus"],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
