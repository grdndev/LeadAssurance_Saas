import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Rachat de Crédits - Demande de Lead | LeadsAssurance",
    description: "Regroupez vos crédits pour réduire vos mensualités",
};

export default function RachatCreditPage() {
    return (
        <LeadFormTemplate
            config={{
                productType: "RACHAT_CREDIT",
                title: "Rachat / Regroupement de Crédits",
                description: "Simplifiez votre gestion financière avec un seul crédit à mensualité réduite",
                fields: [
                    { name: "owner", label: "Êtes-vous propriétaire ?", type: "boolean", required: true },
                    { name: "creditCount", label: "Nombre de crédits en cours", type: "number", required: true, placeholder: "Ex: 3" },
                    { name: "monthlyPayments", label: "Total mensualités actuelles (€)", type: "number", required: true, placeholder: "Ex: 1200" },
                    { name: "totalDebt", label: "Montant total restant à rembourser (€)", type: "number", required: true, placeholder: "Ex: 45000" },
                    { name: "familySituation", label: "Situation familiale", type: "select", required: true, options: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf(ve)", "Union libre"] },
                    { name: "situationPro", label: "Situation professionnelle", type: "select", required: true, options: ["Fonctionnaire", "Profession libérale", "Chef d'entreprise", "Salarié du privé", "Artisan/Commerçant", "Retraité(e)", "Sans emploi", "Autre"] },
                    { name: "income", label: "Revenus mensuels (€)", type: "number", required: true, placeholder: "Ex: 2800" },
                ],
            }}
        />
    );
}
