import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Assurance Habitation (MRH) - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance multirisque habitation",
};

export default function AssuranceHabitationPage() {
    const productConfig = {
        productType: "ASSURANCE_HABITATION",
        title: "Assurance Habitation (MRH)",
        description: "Générez un lead pour une assurance multirisque habitation",
        fields: [
            {
                name: "ownershipStatus",
                label: "Statut",
                type: "select" as const,
                required: true,
                options: ["Locataire", "Propriétaire occupant", "Propriétaire non-occupant"],
            },
            {
                name: "propertyType",
                label: "Type de logement",
                type: "select" as const,
                required: true,
                options: ["Appartement", "Maison", "Studio"],
            },
            {
                name: "surface",
                label: "Surface (m²)",
                type: "number" as const,
                required: true,
                placeholder: "Ex: 75",
            },
            {
                name: "rooms"        label: "Nombre de pièces",
                type: "select" as const,
                required: true,
                options: ["1", "2", "3", "4", "5 ou plus"],
            },
            {
                name: "dueDate",
                label: "Date d'échéance",
                type: "date" as const,
                required: false,
            },
            {
                name: "currentInsurer",
                label: "Assureur actuel",
                type: "text" as const,
                required: false,
                placeholder: "Nom de votre assureur",
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
