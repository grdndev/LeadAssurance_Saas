"use client";

import { motion } from "framer-motion";
import {
    Upload,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    ArrowUpRight,
    FileText,
    Euro
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProviderDashboardPage() {
    const stats = [
        { name: "Leads envoyés", value: "47", icon: Upload, change: "+5 ce mois", trend: "up" },
        { name: "Leads acceptés", value: "42", icon: CheckCircle2, change: "89% taux", trend: "up" },
        { name: "Leads vendus", value: "38", icon: Euro, change: "90% conversion", trend: "up" },
        { name: "En attente", value: "3", icon: Clock, change: "", trend: "neutral" },
    ];

    const recentLeads = [
        { id: 1, type: "Crédit Immobilier", city: "Paris", status: "accepted", date: "Il y a 2h" },
        { id: 2, type: "Assurance Emprunteur", city: "Lyon", status: "sold", date: "Il y a 5h" },
        { id: 3, type: "Rachat Crédits", city: "Bordeaux", status: "pending", date: "Il y a 1j" },
        { id: 4, type: "Mutuelle Santé", city: "Marseille", status: "rejected", date: "Il y a 2j" },
    ];

    const statusConfig = {
        accepted: { label: "Accepté", color: "text-blue-500 bg-blue-500/10" },
        sold: { label: "Vendu", color: "text-green-500 bg-green-500/10" },
        pending: { label: "En attente", color: "text-yellow-500 bg-yellow-500/10" },
        rejected: { label: "Refusé", color: "text-red-500 bg-red-500/10" },
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Espace Apporteur</h1>
                    <p className="text-muted-foreground">Gérez vos leads et suivez vos performances.</p>
                </div>
                <Link href="/dashboard/provider/submit">
                    <Button className="rounded-full px-6">
                        <Upload className="h-4 w-4 mr-2" /> Envoyer un Lead
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="border-border/50 bg-background/50 hover:bg-background transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                                <stat.icon className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                {stat.change && (
                                    <p className={`mt-1 flex items-center text-xs ${stat.trend === "up" ? "text-green-500" : "text-muted-foreground"}`}>
                                        {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                        {stat.change}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Recent Leads */}
                <Card className="lg:col-span-2 border-border/50 bg-background/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Leads récents</CardTitle>
                        <Link href="/dashboard/provider/leads">
                            <Button variant="ghost" size="sm">Voir tout</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeads.map((lead) => {
                                const status = statusConfig[lead.status as keyof typeof statusConfig];
                                return (
                                    <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{lead.type}</div>
                                                <div className="text-xs text-muted-foreground">{lead.city} • {lead.date}</div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions & Stats */}
                <Card className="border-border/50 bg-background/50">
                    <CardHeader>
                        <CardTitle>Qualité des leads</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Taux d'acceptation</span>
                                <span className="font-bold text-green-500">89%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: "89%" }} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Taux de vente</span>
                                <span className="font-bold text-primary">90%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">1,254 €</div>
                                <div className="text-xs text-muted-foreground mt-1">Revenus ce mois</div>
                            </div>
                        </div>

                        <Link href="/dashboard/provider/submit" className="block">
                            <Button className="w-full rounded-full">
                                <Upload className="h-4 w-4 mr-2" /> Nouveau Lead
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Rejection Reasons */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle>Motifs de rejet récents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="font-medium text-red-500">Consentement invalide</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Le texte de consentement ne correspond pas aux exigences RGPD.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium text-yellow-500">Doublon détecté</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ce prospect existe déjà dans notre base (même email ou téléphone).
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="font-medium">Bonnes pratiques</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Vérifiez le consentement et les coordonnées avant envoi.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
