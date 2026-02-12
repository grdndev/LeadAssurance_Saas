import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Assurance Auto - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance automobile",
};

export default function AssuranceAutoPage() {
    const productConfig = {
        productType: "ASSURANCE_AUTO",
        title: "Assurance Auto",
        description: "Générez un lead pour une demande d'assurance automobile",
        fields: [
            {
                name: "vehicleType",
                label: "Type de véhicule",
                type: "select" as const,
                required: true,
                options: ["Voiture", "Moto", "Utilitaire", "Camping-car"],
            },
            {
                name: "usage",
                label: "Usage du véhicule",
                type: "select" as const,
                required: true,
                options: ["Privé", "Professionnel", "Mixte"],
            },
            {
                name: "bonusMalus",
                label: "Bonus / Malus",
                type: "text" as const,
                required: true,
                placeholder: "Ex: 0.50, 1.00, 1.25...",
            },
            {
                name: "currentInsurer",
                label: "Assureur actuel (si applicable)",
                type: "text" as const,
                required: false,
                placeholder: "Nom de votre assureur",
            },
            {
                name: "dueDate",
                label: "Date d'échéance",
                type: "date" as const,
                required: true,
            },
            {
                name: "drivers",
                label: "Nombre de conducteurs",
                type: "select" as const,
                required: true,
                options: ["1", "2", "3 ou plus"],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
