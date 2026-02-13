"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Hero() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userRole = session?.user?.role;

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:pb-32 lg:flex lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mt-12 sm:mt-32 lg:mt-16">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
                Marketplace Leads Assurance & Crédit
              </span>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-6xl">
              Qualité, Transparence et <span className="text-primary">Conformité RGPD</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
              Achetez des leads et rendez-vous qualifiés en exclusivité ou via notre salle de marché.
              Accédez instantanément à la preuve de consentement pour chaque opportunité.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
              <Link href={isLoggedIn ? (userRole === "BROKER" ? "/dashboard" : "/dashboard/provider") : "/register"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full px-8">
                  {isLoggedIn ? "Mon Espace" : "Espace Courtier"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={isLoggedIn ? "/dashboard/marketplace" : "/register"} className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full rounded-full">
                  {isLoggedIn ? "Salle de Marché" : "Devenir Apporteur"}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Conforme ACPR / RGPD
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Fraîcheur &lt; 72h
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Taux de transformation optimisé
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="glass dark:glass-dark rounded-2xl p-4 shadow-2xl overflow-hidden animate-float"
            >
              <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="text-xs text-muted-foreground ml-2">Salle de marché en direct</span>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-sm font-medium">Lead Crédit Immobilier</div>
                        <div className="text-xs text-muted-foreground">Lyon (69) • Nouveau Prêt</div>
                      </div>
                      <div className="sm:hidden">
                        <div className="text-sm font-medium leading-none">Immo</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Lyon</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">45.00 €</div>
                      <div className="text-[10px] text-green-500 font-semibold px-2 py-0.5 bg-green-500/10 rounded-full">Fraîcheur 2h</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
