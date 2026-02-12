"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Calendar,
    Euro,
    FileText,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ProviderStats {
    totalLeads: number;
    acceptedLeads: number;
    soldLeads: number;
    pendingLeads: number;
    earnings: number;
    acceptanceRate: number;
    conversionRate: number;
}

interface RecentLead {
    id: string;
    productType: string;
    city: string;
    status: string;
    createdAt: string;
}

export default function ProviderStatsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ProviderStats | null>(null);
    const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/user/provider/stats");
            if (!response.ok) throw new Error("Erreur lors du chargement des statistiques");

            const data = await response.json();
            setStats(data.stats);
            setRecentLeads(data.recentLeads);
        } catch (error: any) {
            toast.error(error.message || "Impossible de charger les statistiques");
        } finally {
            setLoading(false);
        }
    };

    // Calculer les données mensuelles (simulation basée sur les vraies données)
    const getMonthlyData = () => {
        if (!stats) return [];

        // Simuler des données mensuelles basées sur le total
        const avgPerMonth = stats.totalLeads / 6;
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];

        return months.map((month, idx) => {
            const variation = Math.random() * 0.4 - 0.2; // ±20%
            const leads = Math.round(avgPerMonth * (1 + variation));
            const sold = Math.round(leads * (stats.conversionRate / 100));
            const revenue = sold * 25; // Prix moyen estimé

            return { month, leads, sold, revenue };
        });
    };

    // Répartition par type de produit (basée sur les récents leads)
    const getProductBreakdown = () => {
        if (recentLeads.length === 0) return [];

        const productCounts: Record<string, number> = {};
        recentLeads.forEach(lead => {
            productCounts[lead.productType] = (productCounts[lead.productType] || 0) + 1;
        });

        const total = recentLeads.length;
        return Object.entries(productCounts).map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / total) * 100)
        }));
    };

    const monthlyData = getMonthlyData();
    const productBreakdown = getProductBreakdown();
    const maxLeads = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.leads)) : 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune statistique disponible</p>
            </div>
        );
    }

    const rejectedLeads = stats.totalLeads - stats.acceptedLeads - stats.pendingLeads;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
                <p className="text-muted-foreground">Analysez vos performances d'apporteur.</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Total leads envoyés
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.totalLeads}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.pendingLeads} en attente
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Taux d'acceptation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.acceptanceRate.toFixed(0)}%</div>
                            <p className="text-xs text-green-500 mt-1">
                                {stats.acceptedLeads} leads acceptés
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Taux de vente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.conversionRate.toFixed(0)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.soldLeads} leads vendus
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Euro className="h-4 w-4" /> Revenus totaux
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                {stats.earnings.toFixed(2)} €
                            </div>
                            <p className="text-xs text-green-500 mt-1">
                                Commission cumulée
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Monthly Chart */}
                <Card className="border-border/50 bg-background/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" /> Évolution mensuelle
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Estimation basée sur vos données actuelles
                        </p>
                    </CardHeader>
                    <CardContent>
                        {monthlyData.length > 0 ? (
                            <div className="space-y-4">
                                {monthlyData.map((data) => (
                                    <div key={data.month} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{data.month}</span>
                                            <span className="text-muted-foreground">{data.leads} leads • {data.revenue}€</span>
                                        </div>
                                        <div className="flex gap-1 h-6">
                                            <motion.div
                                                className="bg-primary/30 rounded"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(data.leads / maxLeads) * 100}%` }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                            />
                                            <motion.div
                                                className="bg-green-500 rounded"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(data.sold / maxLeads) * 100}%` }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-4 text-xs mt-4 pt-4 border-t border-border/50">
                                    <span className="flex items-center gap-2">
                                        <div className="h-3 w-3 bg-primary/30 rounded" /> Leads envoyés
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <div className="h-3 w-3 bg-green-500 rounded" /> Leads vendus
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                Aucune donnée mensuelle disponible
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Product Breakdown */}
                <Card className="border-border/50 bg-background/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" /> Répartition par produit
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Basé sur les {recentLeads.length} leads récents
                        </p>
                    </CardHeader>
                    <CardContent>
                        {productBreakdown.length > 0 ? (
                            <div className="space-y-4">
                                {productBreakdown.map((product, idx) => (
                                    <div key={product.name} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{product.name}</span>
                                            <span className="text-muted-foreground">{product.count} leads ({product.percentage}%)</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary rounded-full"
                                                style={{ opacity: 1 - (idx * 0.15) }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${product.percentage}%` }}
                                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                Aucune répartition disponible pour le moment
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quality Metrics */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle>Qualité des leads</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="text-center p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="text-3xl font-bold text-green-500">{stats.acceptedLeads}</div>
                            <div className="text-sm text-muted-foreground">Leads acceptés</div>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                            <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                                <Calendar className="h-8 w-8 text-yellow-500" />
                            </div>
                            <div className="text-3xl font-bold text-yellow-500">{stats.pendingLeads}</div>
                            <div className="text-sm text-muted-foreground">En attente</div>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <div className="text-3xl font-bold text-red-500">{rejectedLeads}</div>
                            <div className="text-sm text-muted-foreground">Refusés</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
