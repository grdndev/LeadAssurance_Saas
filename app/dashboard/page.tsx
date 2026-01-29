"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/constants/products";

export default function DashboardPage() {
  const stats = [
    { name: "Total Leads", value: "124", icon: Users, change: "+12%", trend: "up" },
    { name: "Achats récents", value: "8", icon: ShoppingCart, change: "+2", trend: "up" },
    { name: "Crédits Restants", value: "450 €", icon: Wallet, change: "-45 €", trend: "down" },
    { name: "Taux de Transfo", value: "18.5%", icon: TrendingUp, change: "+0.5%", trend: "up" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
        <p className="text-muted-foreground">Bienvenue sur votre espace courtier LeadsAssurance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-border/50 bg-background/50 hover:bg-background transition-colors cursor-default">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`mt-1 flex items-center text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change} <span className="text-muted-foreground ml-1">vs mois dernier</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 bg-background/50">
          <CardHeader>
            <CardTitle>Dernières Opportunités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { type: "CREDIT_IMMO", city: "Paris (75008)", price: 45 },
                { type: "ASSURANCE_EMPRUNTEUR", city: "Lyon (69002)", price: 55 },
                { type: "MUTUELLE_SANTE_IND", city: "Marseille (13008)", price: 28 },
              ].map((item, idx) => {
                const product = getProductById(item.type);
                return (
                  <div key={idx} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {product && <product.icon className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-semibold">{product?.name || item.type}</div>
                        <div className="text-xs text-muted-foreground">{item.city} • Envoyé il y a 2h</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.price}.00 €</div>
                      <Link href="/dashboard/marketplace" className="text-xs text-primary font-semibold hover:underline">Voir plus</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/50">
          <CardHeader>
            <CardTitle>Crédit disponible</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-primary text-center py-4">450.00 €</div>
            <Link href="/dashboard/billing">
              <Button className="w-full rounded-full py-6 text-sm font-bold">
                <Plus className="h-4 w-4 mr-2" /> Recharger mon compte
              </Button>
            </Link>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Paiement sécurisé via Stripe</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
