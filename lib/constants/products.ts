import {
  Home,
  HandCoins,
  Briefcase,
  ShieldCheck,
  Stethoscope,
  Building2,
  HeartPulse,
  Car,
  Dog,
  Scale,
  HardHat,
  Construction,
  Gavel,
  PiggyBank,
  TrendingUp,
  Landmark
} from "lucide-react";

export type ProductDefinition = {
  id: string;
  name: string;
  icon: any;
  category: "Crédit" | "Assurance" | "Patrimoine";
  hasAppointment: boolean;
  basePrice: number;
  appointmentPrice: number;
  fields: {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "boolean" | "date";
    options?: string[];
    placeholder?: string;
  }[];
};

export const PRODUCTS: ProductDefinition[] = [
  // CRÉDIT
  {
    id: "CREDIT_IMMO",
    name: "Crédit Immobilier",
    icon: Home,
    category: "Crédit",
    hasAppointment: true,
    basePrice: 35,
    appointmentPrice: 50,
    fields: [
      { name: "projectType", label: "Type de projet", type: "select", options: ["Résidence principale", "Locatif"] },
      { name: "amount", label: "Montant du projet", type: "number", placeholder: "Ex: 250000" },
      { name: "apport", label: "Apport", type: "boolean" },
      { name: "situationPro", label: "Situation professionnelle", type: "text" },
      { name: "income", label: "Revenus mensuels nets", type: "number" },
      { name: "delay", label: "Délai du projet", type: "select", options: ["Immédiat", "< 6 mois", "> 6 mois"] },
    ]
  },
  {
    id: "RACHAT_CREDIT",
    name: "Rachat de Crédits",
    icon: HandCoins,
    category: "Crédit",
    hasAppointment: true,
    basePrice: 30,
    appointmentPrice: 45,
    fields: [
      { name: "owner", label: "Propriétaire", type: "boolean" },
      { name: "creditCount", label: "Nombre de crédits en cours", type: "number" },
      { name: "monthlyPayments", label: "Mensualités actuelles", type: "number" },
      { name: "totalDebt", label: "Montant restant à rembourser", type: "number" },
      { name: "familySituation", label: "Situation familiale", type: "select", options: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf(ve)", "Union libre"] },
      { name: "situationPro", label: "Situation professionnelle", type: "select", options: ["Fonctionnaire", "Libérale", "Chef d'entreprise", "Salarié privé", "Artisan/Commerçant", "Retraité", "Sans emploi"] },
      { name: "income", label: "Revenus mensuels", type: "number" },
    ]
  },
  {
    id: "CREDIT_PRO",
    name: "Crédit Professionnel",
    icon: Briefcase,
    category: "Crédit",
    hasAppointment: true,
    basePrice: 35,
    appointmentPrice: 50,
    fields: [
      { name: "status", label: "Statut", type: "select", options: ["Création", "Entreprise existante"] },
      { name: "activity", label: "Type d'activité", type: "text" },
      { name: "amount", label: "Montant recherché", type: "number" },
      { name: "usage", label: "Usage", type: "select", options: ["Matériel", "Trésorerie", "Local"] },
      { name: "seniority", label: "Ancienneté entreprise", type: "text", placeholder: "Si existante" },
    ]
  },
  // ASSURANCE
  {
    id: "ASSURANCE_EMPRUNTEUR",
    name: "Assurance Emprunteur",
    icon: ShieldCheck,
    category: "Assurance",
    hasAppointment: true,
    basePrice: 25,
    appointmentPrice: 40,
    fields: [
      { name: "requestType", label: "Type de demande", type: "select", options: ["Changement", "Nouveau prêt"] },
      { name: "loanDate", label: "Date de signature du prêt", type: "date" },
      { name: "loanAmount", label: "Montant du prêt", type: "number" },
      { name: "age", label: "Âge", type: "number" },
      { name: "smoker", label: "Fumeur", type: "boolean" },
    ]
  },
  {
    id: "MUTUELLE_SANTE_IND",
    name: "Mutuelle Santé Individuelle",
    icon: Stethoscope,
    category: "Assurance",
    hasAppointment: false,
    basePrice: 20,
    appointmentPrice: 35,
    fields: [
      { name: "peopleCount", label: "Nombre de personnes à couvrir", type: "number" },
      { name: "age", label: "Âge de l'assuré principal", type: "number" },
      { name: "regime", label: "Régime", type: "select", options: ["Salarié", "TNS", "Retraité"] },
      { name: "priority", label: "Priorité", type: "select", options: ["Optique", "Dentaire", "Hospitalisation"] },
    ]
  },
  {
    id: "MUTUELLE_ENTREPRISE",
    name: "Mutuelle d'Entreprise",
    icon: Building2,
    category: "Assurance",
    hasAppointment: true,
    basePrice: 35,
    appointmentPrice: 50,
    fields: [
      { name: "employeeCount", label: "Nombre de salariés", type: "number" },
      { name: "sector", label: "Secteur d'activité", type: "text" },
      { name: "convention", label: "Convention collective", type: "text", placeholder: "Si connue" },
      { name: "startDate", label: "Date souhaitée", type: "date" },
    ]
  },
  {
    id: "PREVOYANCE_TNS",
    name: "Prévoyance TNS / Dirigeants",
    icon: HeartPulse,
    category: "Assurance",
    hasAppointment: true,
    basePrice: 30,
    appointmentPrice: 45,
    fields: [
      { name: "status", label: "Statut", type: "select", options: ["TNS", "Dirigeant"] },
      { name: "activity", label: "Activité", type: "text" },
      { name: "annualIncome", label: "Revenus annuels", type: "number" },
      { name: "objective", label: "Objectif", type: "select", options: ["Maintien de revenus", "Protection famille"] },
    ]
  },
  {
    id: "ASSURANCE_AUTO",
    name: "Assurance Auto",
    icon: Car,
    category: "Assurance",
    hasAppointment: false,
    basePrice: 15,
    appointmentPrice: 30,
    fields: [
      { name: "vehicleType", label: "Type de véhicule", type: "text" },
      { name: "usage", label: "Usage", type: "select", options: ["Privé", "Professionnel"] },
      { name: "bonusMalus", label: "Bonus/Malus", type: "text" },
      { name: "expiryDate", label: "Date d'échéance", type: "date" },
    ]
  },
  {
    id: "ASSURANCE_MRH",
    name: "Assurance Habitation (MRH)",
    icon: Home,
    category: "Assurance",
    hasAppointment: false,
    basePrice: 15,
    appointmentPrice: 30,
    fields: [
      { name: "status", label: "Statut", type: "select", options: ["Locataire", "Propriétaire"] },
      { name: "housingType", label: "Type de logement", type: "select", options: ["Appartement", "Maison"] },
      { name: "surface", label: "Surface (m²)", type: "number" },
      { name: "expiryDate", label: "Date d'échéance", type: "date" },
    ]
  },
  {
    id: "ASSURANCE_CHIEN_CHAT",
    name: "Assurance Chiens & Chats",
    icon: Dog,
    category: "Assurance",
    hasAppointment: false,
    basePrice: 15,
    appointmentPrice: 30,
    fields: [
      { name: "animalType", label: "Type d'animal", type: "select", options: ["Chien", "Chat"] },
      { name: "breed", label: "Race", type: "text", placeholder: "ou Croisé" },
      { name: "age", label: "Âge", type: "number" },
      { name: "identified", label: "Identifié (puce/tatouage)", type: "boolean" },
    ]
  },
  {
    id: "RC_PRO",
    name: "RC Professionnelle",
    icon: Scale,
    category: "Assurance",
    hasAppointment: true,
    basePrice: 30,
    appointmentPrice: 45,
    fields: [
      { name: "activity", label: "Activité", type: "text" },
      { name: "legalStatus", label: "Statut juridique", type: "text" },
      { name: "revenue", label: "Chiffre d'affaires annuel", type: "number" },
      { name: "creationDate", label: "Date de création", type: "date" },
    ]
  },
  {
    id: "MULTIRISQUE_PRO",
    name: "Multirisque Professionnelle",
    icon: Briefcase,
    category: "Assurance",
    hasAppointment: true,
    basePrice: 30,
    appointmentPrice: 45,
    fields: [
      { name: "activity", label: "Activité", type: "text" },
      { name: "surface", label: "Surface des locaux (m²)", type: "number" },
      { name: "equipmentValue", label: "Valeur matériel (approx.)", type: "number" },
      { name: "status", label: "Statut local", type: "select", options: ["Locataire", "Propriétaire"] },
    ]
  },
  {
    id: "RC_DECENNALE",
    name: "RC Décennale",
    icon: HardHat,
    category: "Assurance",
    hasAppointment: true,
    basePrice: 35,
    appointmentPrice: 50,
    fields: [
      { name: "trade", label: "Corps de métier", type: "text" },
      { name: "creationDate", label: "Date création entreprise", type: "date" },
      { name: "revenue", label: "Chiffre d'affaires", type: "number" },
      { name: "zone", label: "Zone d'intervention (départements)", type: "text" },
    ]
  },
  {
    id: "DOMMAGE_OUVRAGE",
    name: "Dommage Ouvrage",
    icon: Construction,
    category: "Assurance",
    hasAppointment: true,
    basePrice: 40,
    appointmentPrice: 55,
    fields: [
      { name: "projectType", label: "Type de projet", type: "select", options: ["Construction", "Rénovation"] },
      { name: "amount", label: "Montant travaux", type: "number" },
      { name: "owner", label: "Maître d'ouvrage", type: "select", options: ["Particulier", "Professionnel"] },
      { name: "startDate", label: "Date démarrage travaux", type: "date" },
    ]
  },
  {
    id: "MULTIRISQUE_IMMEUBLE",
    name: "Multirisque Immeuble",
    icon: Building2,
    category: "Assurance",
    hasAppointment: false,
    basePrice: 25,
    appointmentPrice: 40,
    fields: [
      { name: "buildingType", label: "Type d'immeuble", type: "select", options: ["Copropriété", "Mono-propriété"] },
      { name: "lotCount", label: "Nombre de lots", type: "number" },
      { name: "usage", label: "Usage", type: "select", options: ["Habitation", "Mixte"] },
      { name: "value", label: "Valeur estimée (tranche)", type: "text" },
    ]
  },
  {
    id: "ASSURANCE_OBSEQUES",
    name: "Assurance Obsèques",
    icon: Gavel,
    category: "Assurance",
    hasAppointment: true,
    basePrice: 20,
    appointmentPrice: 35,
    fields: [
      { name: "age", label: "Âge de l'assuré", type: "number" },
      { name: "contractType", label: "Type de contrat souhaité", type: "select", options: ["Capital", "Prestations", "Je ne sais pas"] },
      { name: "budget", label: "Budget mensuel", type: "select", options: ["< 30€", "30-50€", "50-100€", "> 100€"] },
      { name: "urgentCallback", label: "Rappel rapide souhaité", type: "boolean" },
    ]
  },
  // PATRIMOINE
  {
    id: "ASSURANCE_VIE_RETRAITE",
    name: "Assurance Vie & Retraite (PER)",
    icon: PiggyBank,
    category: "Patrimoine",
    hasAppointment: true,
    basePrice: 40,
    appointmentPrice: 55,
    fields: [
      { name: "objective", label: "Objectif principal", type: "select", options: ["Épargne", "Préparer retraite", "Transmission"] },
      { name: "amount", label: "Montant à investir", type: "select", options: ["< 10 000€", "10 000 - 50 000€", "50 000 - 150 000€", "> 150 000€"] },
      { name: "payment", label: "Versement", type: "select", options: ["Ponctuel", "Mensuel"] },
      { name: "horizon", label: "Horizon", type: "select", options: ["1-3 ans", "3-8 ans", "8+ ans"] },
    ]
  },
  {
    id: "DEFISCALISATION",
    name: "Défiscalisation (Patrimoine)",
    icon: TrendingUp,
    category: "Patrimoine",
    hasAppointment: true,
    basePrice: 45,
    appointmentPrice: 65,
    fields: [
      { name: "objective", label: "Objectif", type: "select", options: ["Réduire impôts", "Préparer retraite", "Investissement immobilier"] },
      { name: "taxAmount", label: "Montant d'impôt annuel", type: "select", options: ["3 000 - 5 000€", "5 000 - 10 000€", "10 000 - 20 000€", "> 20 000€", "Je ne sais pas"] },
      { name: "investmentCapacity", label: "Capacité d'investissement", type: "select", options: ["< 500€/mois", "500 - 1000€/mois", "> 1000€/mois"] },
      { name: "horizon", label: "Horizon", type: "select", options: ["Court terme", "Moyen terme", "Long terme"] },
    ]
  },
];

export const getProductById = (id: string) => PRODUCTS.find(p => p.id === id);
