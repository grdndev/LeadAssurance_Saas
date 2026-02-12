import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Assurance Obsèques - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance obsèques",
};

export default function AssuranceObsequesPage() {
    const productConfig = {
        productType: "ASSURANCE_OBSEQUES",
        title: "Assurance Obsèques",
        description: "Générez un lead pour une assurance obsèques",
        fields: [
            {
                name: "age",
                label: "Âge de l'assuré",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 50 ans",
                    "50-60 ans",
                    "61-70 ans",
                    "71-80 ans",
                    "Plus de 80 ans",
                ],
            },
            {
                name: "contractType",
                label: "Type de contrat souhaité",
                type: "select" as const,
                required: true,
                options: [
                    "Capital (versement d'une somme)",
                    "Prestations (organisation incluse)",
                    "Je ne sais pas",
                ],
            },
            {
                name: "monthlyBudget",
                label: "Budget mensuel",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 20 €/mois",
                    "20-40 €/mois",
                    "40-60 €/mois",
                    "Plus de 60 €/mois",
                ],
            },
            {
                name: "urgency",
                label: "Souhait de contact rapide",
                type: "select" as const,
                required: true,
                options: ["Oui, sous 48h", "Dans la semaine", "Pas urgent"],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
