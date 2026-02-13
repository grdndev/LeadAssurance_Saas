"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    TrendingUp,
    DollarSign,
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    Shield,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState<any>(null);
    const [pendingLeads, setPendingLeads] = useState<any[]>([]);
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, leadsRes, disputesRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/leads?status=PENDING_APPROVAL"),
                fetch("/api/admin/disputes")
            ]);

            const statsData = await statsRes.json();
            const leadsData = await leadsRes.json();
            const disputesData = await disputesRes.json();

            setStats(statsData.stats);
            setPendingLeads(leadsData.leads || []);
            setDisputes(disputesData.disputes || []);
        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApproveLead = async (leadId: string) => {
        try {
            const res = await fetch("/api/admin/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, status: "STOCK" })
            });
            if (res.ok) {
                toast.success("Lead approuvé");
                setPendingLeads(prev => prev.filter(l => l.id !== leadId));
            }
        } catch (error) {
            toast.error("Erreur lors de l'approbation");
        }
    };

    const handleRejectLead = async (leadId: string) => {
        try {
            const res = await fetch("/api/admin/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, status: "REJECTED" })
            });
            if (res.ok) {
                toast.success("Lead rejeté");
                setPendingLeads(prev => prev.filter(l => l.id !== leadId));
            }
        } catch (error) {
            toast.error("Erreur lors du rejet");
        }
    };

    const handleResolveDispute = async (disputeId: string, resolution: string) => {
        try {
            const res = await fetch("/api/admin/disputes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ disputeId, resolution })
            });
            if (res.ok) {
                toast.success(resolution === "REFUND" ? "Remboursement effectué" : "Litige rejeté");
                setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status: resolution === "REFUND" ? "RESOLVED_REFUNDED" : "RESOLVED_REJECTED" } : d));
            }
        } catch (error) {
            toast.error("Erreur lors de la résolution du litige");
        }
    };

    if (loading && !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Gestion de la plateforme LeadsAssurance</p>
                </div>
                <Badge className="px-4 py-2 bg-primary text-primary-foreground">
                    <Shield className="h-4 w-4 mr-2" />
                    Administrateur
                </Badge>
            </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats?.activeBrokers} courtiers • {stats?.activeProviders} apporteurs
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Total</CardTitle>
                            <Activity className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.totalLeads || 0}</div>
                            <p className="text-xs text-green-500 mt-1">
                                {stats?.leadsSold} vendus / +{stats?.leadsThisMonth} ce mois
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'Affaire</CardTitle>
                            <DollarSign className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.revenue.toLocaleString()}€</div>
                            <p className="text-xs text-muted-foreground mt-1">Total des recharges crédits</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Litiges Ouverts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.pendingDisputes || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">En attente de résolution</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="overflow-x-auto pb-2 scrollbar-hide">
                        <TabsList className="inline-flex w-auto min-w-full sm:w-full sm:max-w-2xl sm:grid sm:grid-cols-3">
                            <TabsTrigger value="overview" className="whitespace-nowrap px-8 sm:px-0">Vue d'ensemble</TabsTrigger>
                            <TabsTrigger value="pending" className="whitespace-nowrap px-8 sm:px-0">Leads en attente ({pendingLeads.length})</TabsTrigger>
                            <TabsTrigger value="disputes" className="whitespace-nowrap px-8 sm:px-0">Litiges ({disputes.filter(d => d.status === 'OPEN').length})</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-6">
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader>
                                <CardTitle>Activité Récente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">Flux d'activité en temps réel à venir...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-6">
                        <div className="grid gap-4">
                            {pendingLeads.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground">Aucun lead en attente d'approbation</p>
                            ) : (
                                pendingLeads.map((lead) => (
                                    <Card key={lead.id} className="border-border/50 bg-background/50 overflow-hidden">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                                    <Clock className="h-5 w-5 text-yellow-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{lead.productType.replace('_', ' ')}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Par {lead.provider.name} • {new Date(lead.createdAt).toLocaleString()}
                                                    </div>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px]">{lead.zipCode} - {lead.city}</Badge>
                                                        <Badge variant="outline" className="text-[10px]">{lead.price}€</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleApproveLead(lead.id)} className="bg-primary hover:bg-primary/90">
                                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                                    Approuver
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleRejectLead(lead.id)} className="text-destructive border-destructive/20 hover:bg-destructive/10">
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Rejeter
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="disputes" className="space-y-6">
                        <div className="grid gap-4">
                            {disputes.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground">Aucun litige enregistré</p>
                            ) : (
                                disputes.map((dispute) => (
                                    <Card key={dispute.id} className="border-border/50 bg-background/50">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg">Litige sur Lead {dispute.lead.productType}</CardTitle>
                                                <Badge className={dispute.status === 'OPEN' ? 'bg-yellow-500' : 'bg-green-500'}>
                                                    {dispute.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Signalé par {dispute.broker.name} ({dispute.broker.email})</p>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-3 rounded-lg bg-secondary/30 text-sm">
                                                <p className="font-semibold">{dispute.reason}</p>
                                                <p className="mt-1">{dispute.description}</p>
                                            </div>

                                            {dispute.status === 'OPEN' && (
                                                <div className="flex gap-2 justify-end">
                                                    <Button size="sm" onClick={() => handleResolveDispute(dispute.id, 'REFUND')} variant="default" className="bg-primary">
                                                        Rembourser ({dispute.lead.price}€)
                                                    </Button>
                                                    <Button size="sm" onClick={() => handleResolveDispute(dispute.id, 'REJECT')} variant="outline">
                                                        Rejeter Litige
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
    );
}
