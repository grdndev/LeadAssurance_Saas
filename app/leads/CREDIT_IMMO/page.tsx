import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Crédit Immobilier - Demande de Lead | LeadsAssurance",
    description: "Obtenez votre financement immobilier avec un courtier certifié",
};

export default function CreditImmoPage() {
    return (
        <LeadFormTemplate
            config={{
                productType: "CREDIT_IMMO",
                title: "Crédit Immobilier",
                description: "Trouvez le meilleur financement pour votre projet immobilier",
                fields: [
                    { name: "projectType", label: "Type de projet", type: "select", required: true, options: ["Résidence principale", "Locatif"] },
                    { name: "amount", label: "Montant du projet (€)", type: "number", required: true, placeholder: "Ex: 250000" },
                    { name: "apport", label: "Avez-vous un apport ?", type: "boolean", required: true },
                    { name: "situationPro", label: "Situation professionnelle", type: "select", required: true, options: ["Salarié CDI", "Salarié CDD", "Fonctionnaire", "Chef d'entreprise", "Profession libérale", "Retraité"] },
                    { name: "income", label: "Revenus mensuels nets (€)", type: "number", required: true, placeholder: "Ex: 3500" },
                    { name: "delay", label: "Délai du projet", type: "select", required: true, options: ["Immédiat", "< 6 mois", "> 6 mois"] },
                ],
            }}
        />
    );
}
