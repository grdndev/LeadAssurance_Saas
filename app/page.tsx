"use client";

import { Hero } from "@/components/marketing/Hero";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { Zap, CheckCircle2, BarChart3, Lock } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <Hero />

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Ultra-Fraîcheur</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Leads livrés en temps réel ou sous 24h-72h maximum pour garantir un taux d'ouverture optimal.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Double Vérification</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Chaque lead passe par un filtre de validation syntaxique et comportementale avant d'être mis en vente.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Preuve de Consentement</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Une empreinte numérique (IP, Horodatage, URL source) est jointe à chaque lead pour votre conformité ACPR.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Salle de Marché</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Achetez à l'unité sans abonnement obligatoire. Prix transparents et dégressifs selon le volume.</p>
              </div>
            </div>
          </div>
        </section>

        <ProductGrid />

        {/* CTA Section */}
        <section className="py-24 overflow-hidden relative isolate">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-3xl bg-primary px-8 py-16 text-center shadow-2xl sm:px-16">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Prêt à booster votre production ?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
                Inscrivez-vous gratuitement et accédez immédiatement à notre salle de marché de leads assurance et crédit.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href={isLoggedIn ? "/dashboard/marketplace" : "/register"}>
                  <button className="rounded-full bg-white px-8 py-3 text-sm font-bold text-primary shadow-sm hover:bg-gray-100 transition-colors">
                    {isLoggedIn ? "Accéder à la Salle de Marché" : "Créer mon compte courtier"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
