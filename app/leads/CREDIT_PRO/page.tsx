import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Crédit Professionnel - Demande de Lead | LeadsAssurance",
    description: "Financez votre projet professionnel avec un courtier spécialisé",
};

export default function CreditProPage() {
    return (
        <LeadFormTemplate
            config={{
                productType: "CREDIT_PRO",
                title: "Crédit Professionnel",
                description: "Obtenez le financement adapté à votre activité professionnelle",
                fields: [
                    { name: "status", label: "Statut de l'entreprise", type: "select", required: true, options: ["Création", "Entreprise existante"] },
                    { name: "activity", label: "Type d'activité", type: "text", required: true, placeholder: "Ex: Commerce de détail, BTP..." },
                    { name: "amount", label: "Montant recherché (€)", type: "number", required: true, placeholder: "Ex: 80000" },
                    { name: "usage", label: "Usage du financement", type: "select", required: true, options: ["Matériel", "Trésorerie", "Local"] },
                    { name: "seniority", label: "Ancienneté de l'entreprise", type: "text", required: false, placeholder: "Ex: 3 ans (si existante)" },
                ],
            }}
        />
    );
}
