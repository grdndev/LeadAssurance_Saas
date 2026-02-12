import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Dommage Ouvrage - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance dommage ouvrage",
};

export default function DommageOuvragePage() {
    const productConfig = {
        productType: "DOMMAGE_OUVRAGE",
        title: "Dommage Ouvrage",
        description: "Générez un lead pour une assurance dommage ouvrage",
        fields: [
            {
                name: "projectType",
                label: "Type de projet",
                type: "select" as const,
                required: true,
                options: [
                    "Construction neuve",
                    "Extension",
                    "Rénovation lourde",
                    "Surélévation",
                ],
            },
            {
                name: "workAmount",
                label: "Montant des travaux",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 100 000 €",
                    "100 000 - 250 000 €",
                    "250 000 - 500 000 €",
                    "Plus de 500 000 €",
                ],
            },
            {
                name: "clientType",
                label: "Maître d'ouvrage",
                type: "select" as const,
                required: true,
                options: ["Particulier", "Professionnel / Promoteur"],
            },
            {
                name: "workStartDate",
                label: "Date de démarrage des travaux",
                type: "date" as const,
                required: true,
            },
            {
                name: "location",
                label: "Localisation du chantier",
                type: "text" as const,
                required: false,
                placeholder: "Ville ou département",
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
