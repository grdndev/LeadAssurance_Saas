import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Prévoyance TNS / Dirigeants - Nouveau Lead | LeadsAssurance",
    description: "Générez un lead qualifié pour la prévoyance des travailleurs non-salariés",
};

export default function PrevoyanceTNSPage() {
    const productConfig = {
        productType: "PREVOYANCE_TNS",
        title: "Prévoyance TNS / Dirigeants",
        description: "Générez un lead pour une prévoyance professionnelle",
        fields: [
            {
                name: "status",
                label: "Statut professionnel",
                type: "select" as const,
                required: true,
                options: [
                    "TNS (Travailleur Non Salarié)",
                    "Dirigeant assimilé salarié",
                    "Profession libérale",
                    "Artisan / Commerçant",
                ],
            },
            {
                name: "activity",
                label: "Activité",
                type: "text" as const,
                required: true,
                placeholder: "Décrivez votre activité",
            },
            {
                name: "annualIncome",
                label: "Revenus annuels",
                type: "select" as const,
                required: true,
                options: [
                    "Moins de 30 000 €",
                    "30 000 - 60 000 €",
                    "60 000 - 100 000 €",
                    "Plus de 100 000 €",
                ],
            },
            {
                name: "objective",
                label: "Objectif principal",
                type: "select" as const,
                required: true,
                options: [
                    "Maintien de revenus en cas d'arrêt",
                    "Protection de la famille",
                    "Couverture invalidité / décès",
                    "Ensemble",
                ],
            },
            {
                name: "currentCoverage",
                label: "Couverture actuelle",
                type: "select" as const,
                required: false,
                options: ["Aucune", "Basique (Madelin)", "Je ne sais pas"],
            },
        ],
    };

    return <LeadFormTemplate config={productConfig} />;
}
