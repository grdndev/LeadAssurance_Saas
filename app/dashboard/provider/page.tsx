"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Upload,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    ArrowUpRight,
    FileText,
    Euro,
    Loader2,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProviderDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generatingMock, setGeneratingMock] = useState(false);
    const [importingCSV, setImportingCSV] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/user/provider/stats");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                } else {
                    toast.error("Erreur lors de la récupération des données");
                }
            } catch (error) {
                toast.error("Erreur serveur");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerateMockData = async () => {
        setGeneratingMock(true);
        try {
            const res = await fetch("/api/mock-data", {
                method: "POST",
            });
            if (res.ok) {
                toast.success("Données de test générées avec succès !");
                // Refresh data
                const statsRes = await fetch("/api/user/provider/stats");
                if (statsRes.ok) {
                    const result = await statsRes.json();
                    setData(result);
                }
            } else {
                toast.error("Erreur lors de la génération des données");
            }
        } catch (error) {
            toast.error("Erreur serveur");
        } finally {
            setGeneratingMock(false);
        }
    };

    const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImportingCSV(true);
        setImportResult(null);
        try {
            const session = await fetch("/api/user/profile").then(r => r.json());
            const formData = new FormData();
            formData.append("file", file);
            formData.append("providerId", session.id);
            const res = await fetch("/api/leads/import", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                setImportResult(result.results);
                toast.success(`Import terminé : ${result.results.accepted} lead(s) accepté(s)`);
                // Refresh stats
                const statsRes = await fetch("/api/user/provider/stats");
                if (statsRes.ok) {
                    const d = await statsRes.json();
                    setData(d);
                }
            } else {
                toast.error(result.error || "Erreur lors de l'import");
            }
        } catch (err) {
            toast.error("Erreur lors de l'import CSV");
        } finally {
            setImportingCSV(false);
            // Reset file input
            e.target.value = "";
        }
    };

    const statusConfig = {
        STOCK: { label: "En Stock", color: "text-blue-500 bg-blue-500/10" },
        SOLD: { label: "Vendu", color: "text-green-500 bg-green-500/10" },
        PENDING_APPROVAL: { label: "En attente", color: "text-yellow-500 bg-yellow-500/10" },
        REJECTED: { label: "Refusé", color: "text-red-500 bg-red-500/10" },
        DISPUTED: { label: "Litige", color: "text-orange-500 bg-orange-500/10" },
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const { stats, recentLeads } = data || { stats: {}, recentLeads: [] };

    const statCards = [
        { name: "Leads envoyés", value: stats.totalLeads || 0, icon: Upload, change: "Total cumulé", trend: "neutral" },
        { name: "Leads acceptés", value: stats.acceptedLeads || 0, icon: CheckCircle2, change: `${Math.round(stats.acceptanceRate || 0)}% taux d'approbation`, trend: "up" },
        { name: "Leads vendus", value: stats.soldLeads || 0, icon: Euro, change: `${Math.round(stats.conversionRate || 0)}% conversion`, trend: "up" },
        { name: "En attente", value: stats.pendingLeads || 0, icon: Clock, change: "Attente modération", trend: "neutral" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Espace Apporteur</h1>
                    <p className="text-muted-foreground">Gérez vos leads et suivez vos performances.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={handleGenerateMockData} 
                        disabled={generatingMock}
                        className="rounded-full px-6"
                    >
                        {generatingMock ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Générer données test
                    </Button>
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleCSVImport}
                            disabled={importingCSV}
                        />
                        <Button asChild variant="outline" className="rounded-full px-6" disabled={importingCSV}>
                            <span>
                                {importingCSV ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <FileText className="h-4 w-4 mr-2" />
                                )}
                                Import CSV
                            </span>
                        </Button>
                    </label>
                    <Link href="/dashboard/provider/submit">
                        <Button className="rounded-full px-6 bg-primary hover:bg-primary/90">
                            <Upload className="h-4 w-4 mr-2" /> Envoyer un Lead
                        </Button>
                    </Link>
                </div>
            </div>

            {/* CSV Import Result */}
            {importResult && (
                <div className="p-4 rounded-xl border border-border/50 bg-background/50 flex flex-wrap gap-6 items-center text-sm">
                    <span className="font-semibold">Résultat de l&apos;import CSV :</span>
                    <span className="text-muted-foreground">Total : <strong>{importResult.total}</strong></span>
                    <span className="text-green-500">Acceptés : <strong>{importResult.accepted}</strong></span>
                    <span className="text-red-500">Rejetés : <strong>{importResult.rejected}</strong></span>
                    {importResult.errors?.length > 0 && (
                        <details className="text-xs text-muted-foreground cursor-pointer">
                            <summary>{importResult.errors.length} erreur(s)</summary>
                            <ul className="mt-1 space-y-0.5">
                                {importResult.errors.slice(0, 5).map((e: any, i: number) => (
                                    <li key={i}>Ligne {e.line} : {e.error}</li>
                                ))}
                            </ul>
                        </details>
                    )}
                    <button onClick={() => setImportResult(null)} className="ml-auto text-muted-foreground hover:text-foreground text-xs">✕ Fermer</button>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, idx) => (
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
                            {recentLeads.length === 0 ? (
                                <p className="text-center py-6 text-muted-foreground italic">Aucun lead envoyé pour le moment.</p>
                            ) : (
                                recentLeads.map((lead: any) => {
                                    const status = statusConfig[lead.status as keyof typeof statusConfig] || statusConfig.PENDING_APPROVAL;
                                    return (
                                        <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{lead.productType.replace('_', ' ')}</div>
                                                    <div className="text-xs text-muted-foreground">{lead.city} • {new Date(lead.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance & Revenue */}
                <Card className="border-border/50 bg-background/50">
                    <CardHeader>
                        <CardTitle>Revenus & Qualité</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Taux d'acceptation</span>
                                <span className="font-bold text-green-500">{Math.round(stats.acceptanceRate || 0)}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${stats.acceptanceRate || 0}%` }} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Taux de vente</span>
                                <span className="font-bold text-primary">{Math.round(stats.conversionRate || 0)}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${stats.conversionRate || 0}%` }} />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">{(stats.earnings || 0).toLocaleString()} €</div>
                                <div className="text-xs text-muted-foreground mt-1">Revenus cumulés</div>
                            </div>
                        </div>

                        <Link href="/dashboard/provider/submit" className="block">
                            <Button className="w-full rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                <Upload className="h-4 w-4 mr-2" /> Nouveau Lead
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
