import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Assurance Emprunteur - Demande de Lead | LeadsAssurance",
    description: "Comparez les offres d'assurance emprunteur et économisez",
};

export default function AssuranceEmprunteurPage() {
    return (
        <LeadFormTemplate
            config={{
                productType: "ASSURANCE_EMPRUNTEUR",
                title: "Assurance Emprunteur",
                description: "Réduisez le coût de votre assurance de prêt immobilier",
                fields: [
                    { name: "requestType", label: "Type de demande", type: "select", required: true, options: ["Changement d'assurance", "Nouveau prêt"] },
                    { name: "loanDate", label: "Date de signature du prêt", type: "date", required: false },
                    { name: "loanAmount", label: "Montant du prêt (€)", type: "number", required: true, placeholder: "Ex: 180000" },
                    { name: "age", label: "Votre âge", type: "number", required: true, placeholder: "Ex: 35" },
                    { name: "smoker", label: "Êtes-vous fumeur ?", type: "boolean", required: true },
                ],
            }}
        />
    );
}
