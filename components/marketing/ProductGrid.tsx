"use client";

import { motion } from "framer-motion";
import { 
  Home, 
  Car, 
  HeartPulse, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  Dog, 
  Construction, 
  TrendingUp, 
  PiggyBank,
  Users,
  HardHat,
  Stethoscope,
  Plane,
  Gavel,
  Landmark,
  Scale,
  HandCoins
} from "lucide-react";

const products = [
  { name: "Crédit Immobilier", icon: Home, category: "Crédit" },
  { name: "Rachat de Crédits", icon: HandCoins, category: "Crédit" },
  { name: "Crédit Professionnel", icon: Briefcase, category: "Crédit" },
  { name: "Assurance Emprunteur", icon: ShieldCheck, category: "Assurance" },
  { name: "Mutuelle Santé", icon: Stethoscope, category: "Assurance" },
  { name: "Mutuelle Entreprise", icon: Building2, category: "Assurance" },
  { name: "Prévoyance TNS", icon: HeartPulse, category: "Assurance" },
  { name: "Assurance Auto", icon: Car, category: "Assurance" },
  { name: "Assurance Habitation", icon: Home, category: "Assurance" },
  { name: "Assurance Chiens & Chats", icon: Dog, category: "Assurance" },
  { name: "RC Professionnelle", icon: Scale, category: "Assurance" },
  { name: "Multirisque Pro", icon: Briefcase, category: "Assurance" },
  { name: "RC Décennale", icon: HardHat, category: "Assurance" },
  { name: "Dommage Ouvrage", icon: Construction, category: "Assurance" },
  { name: "Multirisque Immeuble", icon: Building2, category: "Assurance" },
  { name: "Assurance Obsèques", icon: Gavel, category: "Assurance" },
  { name: "Assurance Vie & PER", icon: PiggyBank, category: "Patrimoine" },
  { name: "Défiscalisation", icon: TrendingUp, category: "Patrimoine" },
];

export function ProductGrid() {
  return (
    <div className="py-24 sm:py-32 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Un catalogue complet</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            18 types de Leads & RDV Qualifiés
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Des formulaires courts pour maximiser l'intention de conversion sans friction. 
            Disponible à l'achat immédiat ou en flux récurrent.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            {products.map((product, idx) => (
              <motion.div 
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col bg-background p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <product.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {product.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto text-sm">Leads et rendez-vous qualifiés disponibles dans votre zone d'intervention.</p>
                  <p className="mt-6">
                    <span className="text-xs font-semibold px-2 py-1 bg-secondary rounded-full">{product.category}</span>
                  </p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
