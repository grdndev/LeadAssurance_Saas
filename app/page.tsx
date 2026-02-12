import { Hero } from "@/components/marketing/Hero";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { Shield, Zap, CheckCircle2, FileText, BarChart3, Lock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar Minimaliste Premium */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            <span className="text-primary">LEADS</span>ASSURANCE
          </Link>

          <div className="hidden gap-8 text-sm font-medium md:flex">
            <Link href="/dashboard/marketplace" className="hover:text-primary transition-colors">Salle de Marché</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog & Conseils</Link>
            <Link href="#" className="hover:text-primary transition-colors">Tarifs</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">Connexion</Link>
            <Link href="/register">
              <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                Démarrer
              </button>
            </Link>
            {/* Mobile Menu Trigger could be added here if needed, but for now we optimize existing links */}
          </div>
        </div>
      </nav>

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
                <button className="rounded-full bg-white px-8 py-3 text-sm font-bold text-primary shadow-sm hover:bg-gray-100 transition-colors">
                  Créer mon compte courtier
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-lg font-bold tracking-tighter">
              <span className="text-primary">LEADS</span>ASSURANCE
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">Conditions Générales</a>
              <a href="#" className="hover:text-primary">Politique de Confidentialité</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 LeadsAssurance.com. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
