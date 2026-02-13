/**
 * French translations for dynamic lead attributes.
 * Used to display human-readable labels in the marketplace and lead detail views.
 */

const ATTRIBUTE_LABELS: Record<string, string> = {
    // Common
    projectType: "Type de projet",
    amount: "Montant",
    apport: "Apport",
    situationPro: "Situation professionnelle",
    income: "Revenus mensuels",
    delay: "Délai du projet",
    owner: "Propriétaire",
    age: "Âge",
    status: "Statut",
    activity: "Activité",
    usage: "Usage",
    objective: "Objectif",
    horizon: "Horizon",
    startDate: "Date souhaitée",

    // Crédit
    creditCount: "Nombre de crédits en cours",
    monthlyPayments: "Mensualités actuelles",
    totalDebt: "Montant restant à rembourser",
    familySituation: "Situation familiale",
    seniority: "Ancienneté entreprise",

    // Assurance Emprunteur
    requestType: "Type de demande",
    loanDate: "Date de signature du prêt",
    loanAmount: "Montant du prêt",
    smoker: "Fumeur",

    // Mutuelle Santé
    peopleCount: "Nombre de personnes à couvrir",
    regime: "Régime",
    priority: "Priorité",

    // Mutuelle Entreprise
    employeeCount: "Nombre de salariés",
    sector: "Secteur d'activité",
    convention: "Convention collective",

    // Prévoyance TNS
    annualIncome: "Revenus annuels",

    // Auto
    vehicleType: "Type de véhicule",
    bonusMalus: "Bonus/Malus",
    expiryDate: "Date d'échéance",

    // Habitation
    housingType: "Type de logement",
    surface: "Surface (m²)",

    // Animaux
    animalType: "Type d'animal",
    breed: "Race",
    identified: "Identifié (puce/tatouage)",

    // RC Pro
    legalStatus: "Statut juridique",
    revenue: "Chiffre d'affaires",
    creationDate: "Date de création",

    // Multirisque Pro
    equipmentValue: "Valeur matériel",

    // RC Décennale
    trade: "Corps de métier",
    zone: "Zone d'intervention",

    // Dommage Ouvrage
    // (uses projectType, amount, owner, startDate - already above)

    // Multirisque Immeuble
    buildingType: "Type d'immeuble",
    lotCount: "Nombre de lots",
    value: "Valeur estimée",

    // Obsèques
    contractType: "Type de contrat",
    budget: "Budget mensuel",
    urgentCallback: "Rappel rapide souhaité",

    // Patrimoine
    payment: "Versement",
    taxAmount: "Montant d'impôt annuel",
    investmentCapacity: "Capacité d'investissement",
};

/**
 * Returns a French label for the given attribute key.
 * Falls back to formatting the camelCase key if no translation exists.
 */
export function getAttributeLabel(key: string): string {
    if (ATTRIBUTE_LABELS[key]) return ATTRIBUTE_LABELS[key];

    // Fallback: convert camelCase to readable French
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
}

/**
 * Formats an attribute value for display.
 * Handles booleans, null/undefined, etc.
 */
export function formatAttributeValue(value: unknown): string {
    if (value === true) return "Oui";
    if (value === false) return "Non";
    if (value === null || value === undefined) return "—";
    return String(value);
}
