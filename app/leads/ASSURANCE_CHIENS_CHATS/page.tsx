import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Assurance Chiens & Chats - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour l'assurance animaux de compagnie",
};

export default function AssuranceAnimauxPage() {
    const productConfig = {
        productType: "ASSURANCE_CHIENS_CHATS",
        title: "Assurance Chiens & Chats",
        description: "Générez un lead pour une assurance santé animale",
        fields: [
            {
                name: "animalType",
                label: "Type d'animal",
                type: "select" as const,
                required: true,
                options: ["Chien", "Chat"],
            },
            {
                name: "breed",
                label: "Race",
                type: "text" as const,
                required: true,
                placeholder: "Ex: Labrador, Européen, Croisé...",
            },
            {
                name: "age",
                label: "Âge de l'animal",
                type: "select" as const,
                required: true,
                options: ["Moins de 1 an", "1-3 ans", "4-7 ans", "8 ans et plus"],
            },
            {
                name: "isIdentified",
                label: "Animal identifié (puce/tatouage)",
                type: "select" as const,
                required: true,
                options: ["Oui", "Non", "En cours"],
            },
            {
                name: "coverage",
                label: "Type de couverture souhaité",
                type: "select" as const,
                required: false,
                options: ["Basique", "Intermédiaire", "Premium", "Je ne sais pas"],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
