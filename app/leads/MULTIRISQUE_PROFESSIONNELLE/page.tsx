import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Multirisque Professionnelle - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance multirisque professionnelle",
};

export default function MultirisqueProPage() {
    const productConfig = {
        productType: "MULTIRISQUE_PROFESSIONNELLE",
        title: "Multirisque Professionnelle",
        description: "Générez un lead pour une assurance multirisque locale professionnels",
        fields: [
            {
                name: "activity",
                label: "Activité",
                type: "text" as const,
                required: true,
                placeholder: "Type d'activité exercée",
            },
            {
                name: "premisesSurface",
                label: "Surface des locaux (m²)",
                type: "number" as const,
                required: true,
                placeholder: "Ex: 120",
            },
            {
                name: "equipmentValue",
                label: "Valeur du matériel (approx.)",
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
                name: "premisesStatus",
                label: "Statut des locaux",
                type: "select" as const,
                required: true,
                options: ["Locataire", "Propriétaire"],
            },
            {
                name: "openToPublic",
                label: "Locaux ouverts au public",
                type: "select" as const,
                required: false,
                options: ["Oui", "Non"],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
