"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/constants/products";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface DashboardStats {
  totalLeads: { value: number; change: string; trend: string };
  recentPurchases: { value: number; change: string; trend: string };
  credits: { value: string; change: string; trend: string };
  conversionRate: { value: string; change: string; trend: string };
}

interface RecentLead {
  type: string;
  city: string;
  price: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingMock, setGeneratingMock] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch("/api/dashboard/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent leads from marketplace
        const leadsRes = await fetch("/api/marketplace/leads?limit=5");
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          const leadsArray = leadsData.leads || leadsData || [];
          const formattedLeads = leadsArray.slice(0, 5).map((lead: any) => ({
            type: lead.productType,
            city: `${lead.city} (${lead.zipCode})`,
            price: lead.price,
          }));
          setRecentLeads(formattedLeads);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const generateMockData = async () => {
    setGeneratingMock(true);
    try {
      const res = await fetch("/api/mock-data", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Mock data created! ${data.stats.leads} leads, ${data.stats.notifications} notifications`);
        
        // Refresh dashboard data
        window.location.reload();
      } else {
        toast.error("Failed to generate mock data");
      }
    } catch (error) {
      console.error("Error generating mock data:", error);
      toast.error("Error generating mock data");
    } finally {
      setGeneratingMock(false);
    }
  };

  const displayStats = stats
    ? [
        { name: "Total Leads", value: stats.totalLeads.value.toString(), icon: Users, change: stats.totalLeads.change, trend: stats.totalLeads.trend },
        { name: "Achats récents", value: stats.recentPurchases.value.toString(), icon: ShoppingCart, change: stats.recentPurchases.change, trend: stats.recentPurchases.trend },
        { name: "Crédits Restants", value: stats.credits.value, icon: Wallet, change: stats.credits.change, trend: stats.credits.trend },
        { name: "Taux de Transfo", value: stats.conversionRate.value, icon: TrendingUp, change: stats.conversionRate.change, trend: stats.conversionRate.trend },
      ]
    : [
        { name: "Total Leads", value: "0", icon: Users, change: "+0%", trend: "up" },
        { name: "Achats récents", value: "0", icon: ShoppingCart, change: "+0", trend: "up" },
        { name: "Crédits Restants", value: "0.00 €", icon: Wallet, change: "0 €", trend: "down" },
        { name: "Taux de Transfo", value: "0.0%", icon: TrendingUp, change: "+0.0%", trend: "up" },
      ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace courtier LeadsAssurance.</p>
        </div>
        <Button 
          onClick={generateMockData} 
          disabled={generatingMock}
          variant="outline"
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {generatingMock ? "Génération..." : "Générer données test"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, idx) => (
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
                <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
                <p className={`mt-1 flex items-center text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {loading ? "..." : stat.change} <span className="text-muted-foreground ml-1">vs mois dernier</span>
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Chargement...</div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Aucune opportunité disponible</div>
            ) : (
              <div className="space-y-6">
                {recentLeads.map((item, idx) => {
                  const product = getProductById(item.type);
                  return (
                    <div key={idx} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {product && <product.icon className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-semibold">{product?.name || item.type}</div>
                          <div className="text-xs text-muted-foreground">{item.city} • Récent</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.price.toFixed(2)} €</div>
                        <Link href="/dashboard/marketplace" className="text-xs text-primary font-semibold hover:underline">Voir plus</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/50">
          <CardHeader>
            <CardTitle>Crédit disponible</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-primary text-center py-4">
              {loading ? "..." : stats?.credits.value || "0.00 €"}
            </div>
            <Link href="/dashboard/billing">
              <Button className="w-full rounded-full py-6 text-sm font-bold">
                <Plus className="h-4 w-4 mr-2" /> Recharger mon compte
              </Button>
            </Link>
            <Link href="/dashboard/appointments">
              <Button variant="outline" className="w-full rounded-full text-sm border-purple-500/30 text-purple-600 hover:bg-purple-500/5">
                <Calendar className="h-4 w-4 mr-2" /> Mes RDV Qualifiés
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
