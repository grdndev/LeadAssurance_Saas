import type { Metadata } from "next";
import LeadFormTemplate from "@/components/leads/LeadFormTemplate";

export const metadata: Metadata = {
    title: "Mutuelle Santé Individuelle - Demande de Lead | LeadsAssurance",
    description: "Trouvez la mutuelle santé adaptée à votre profil et votre budget",
};

export default function MutuelleSanteIndPage() {
    return (
        <LeadFormTemplate
            config={{
                productType: "MUTUELLE_SANTE_IND",
                title: "Mutuelle Santé Individuelle",
                description: "Comparez les meilleures mutuelles santé pour vous et vos proches",
                fields: [
                    { name: "peopleCount", label: "Nombre de personnes à couvrir", type: "number", required: true, placeholder: "Ex: 2" },
                    { name: "ages", label: "Âge(s) des assuré(s)", type: "text", required: true, placeholder: "Ex: 35, 32, 8 (séparer par virgule)" },
                    { name: "regime", label: "Régime", type: "select", required: true, options: ["Salarié", "TNS", "Retraité"] },
                    { name: "priority", label: "Priorité de couverture", type: "select", required: true, options: ["Optique", "Dentaire", "Hospitalisation", "Équilibrée"] },
                ],
            }}
        />
    );
}
