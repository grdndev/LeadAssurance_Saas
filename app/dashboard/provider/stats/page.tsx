"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Calendar,
    Euro,
    FileText,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProviderStatsPage() {
    // Mock statistics data
    const monthlyData = [
        { month: "Jan", leads: 8, sold: 7, revenue: 180 },
        { month: "Fév", leads: 12, sold: 10, revenue: 285 },
        { month: "Mar", leads: 15, sold: 14, revenue: 392 },
        { month: "Avr", leads: 10, sold: 9, revenue: 245 },
        { month: "Mai", leads: 18, sold: 16, revenue: 456 },
        { month: "Juin", leads: 22, sold: 20, revenue: 578 },
    ];

    const productBreakdown = [
        { name: "Crédit Immobilier", count: 18, percentage: 38 },
        { name: "Assurance Emprunteur", count: 12, percentage: 26 },
        { name: "Rachat Crédits", count: 8, percentage: 17 },
        { name: "Mutuelle Santé", count: 5, percentage: 11 },
        { name: "Autres", count: 4, percentage: 8 },
    ];

    const maxLeads = Math.max(...monthlyData.map(d => d.leads));

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
                            <div className="text-3xl font-bold">85</div>
                            <p className="text-xs text-green-500 mt-1">+22 ce mois</p>
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
                            <div className="text-3xl font-bold">92%</div>
                            <p className="text-xs text-green-500 mt-1">+3% vs mois dernier</p>
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
                            <div className="text-3xl font-bold">89%</div>
                            <p className="text-xs text-muted-foreground mt-1">Stable</p>
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
                            <div className="text-3xl font-bold text-primary">2,136 €</div>
                            <p className="text-xs text-green-500 mt-1">+578€ ce mois</p>
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
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                {/* Product Breakdown */}
                <Card className="border-border/50 bg-background/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" /> Répartition par produit
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                            <div className="text-3xl font-bold text-green-500">78</div>
                            <div className="text-sm text-muted-foreground">Leads acceptés</div>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                            <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                                <Calendar className="h-8 w-8 text-yellow-500" />
                            </div>
                            <div className="text-3xl font-bold text-yellow-500">3</div>
                            <div className="text-sm text-muted-foreground">En attente</div>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <div className="text-3xl font-bold text-red-500">4</div>
                            <div className="text-sm text-muted-foreground">Refusés</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
