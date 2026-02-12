import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Multirisque Immeuble - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance multirisque immeuble",
};

export default function MultirisqueImmeublePage() {
    const productConfig = {
        productType: "MULTIRISQUE_IMMEUBLE",
        title: "Multirisque Immeuble",
        description: "Générez un lead pour une assurance multirisque immeuble",
        fields: [
            {
                name: "buildingType",
                label: "Type d'immeuble",
                type: "select" as const,
                required: true,
                options: ["Copropriété", "Mono-propriété", "Mixte (hab. + commerce)"],
            },
            {
                name: "numberOfLots",
                label: "Nombre de lots",
                type: "select" as const,
                required: true,
                options: ["Moins de 10", "10-25", "26-50", "Plus de 50"],
            },
            {
                name: "usage",
                label: "Usage principal",
                type: "select" as const,
                required: true,
                options: ["Habitation", "Mixte habitation / commerce", "Bureaux"],
            },
            {
                name: "estimatedValue",
                label: "Valeur estimée de l'immeuble",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 500 000 €",
                    "500 000 - 1 M€",
                    "1 M€ - 3 M€",
                    "Plus de 3 M€",
                ],
            },
            {
                name: "constructionYear",
                label: "Année de construction",
                type: "number" as const,
                required: false,
                placeholder: "Ex: 1985",
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
