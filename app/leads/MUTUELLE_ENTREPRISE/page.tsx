import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Mutuelle d'Entreprise - Demande de Lead | LeadsAssurance",
    description: "Mettez en place une mutuelle d'entreprise conforme et avantageuse",
};

export default function MutuelleEntreprisePage() {
    return (
        <LeadFormTemplate
            config={{
                productType: "MUTUELLE_ENTREPRISE",
                title: "Mutuelle d'Entreprise",
                description: "Solution santé collective adaptée à votre entreprise et vos salariés",
                fields: [
                    { name: "employeeCount", label: "Nombre de salariés", type: "number", required: true, placeholder: "Ex: 12" },
                    { name: "sector", label: "Secteur d'activité", type: "text", required: true, placeholder: "Ex: BTP, Commerce, Services..." },
                    { name: "convention", label: "Convention collective", type: "text", required: false, placeholder: "Ex: Métallurgie, Bâtiment... (si connue)" },
                    { name: "startDate", label: "Date souhaitée de mise en place", type: "date", required: true },
                ],
            }}
        />
    );
}
