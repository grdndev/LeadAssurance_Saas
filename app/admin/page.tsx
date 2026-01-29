"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    TrendingUp,
    DollarSign,
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock admin data
const ADMIN_STATS = {
    totalUsers: 247,
    activeBrokers: 156,
    activeProviders: 91,
    totalLeads: 1543,
    leadsThisMonth: 234,
    revenue: 45678,
    revenueThisMonth: 8945,
};

const PENDING_LEADS = [
    {
        id: "lead-pending-1",
        productType: "CREDIT_IMMO",
        provider: "Provider Corp",
        submittedAt: new Date(),
        reason: "Awaiting validation",
    },
    {
        id: "lead-pending-2",
        productType: "ASSURANCE_EMPRUNTEUR",
        provider: "LeadFlow SAS",
        submittedAt: new Date(),
        reason: "Consent verification",
    },
];

const RECENT_USERS = [
    {
        id: "user-1",
        name: "Jean Dupont",
        email: "jean@example.com",
        role: "BROKER",
        createdAt: new Date(),
        status: "pending",
    },
    {
        id: "user-2",
        name: "Marie Martin",
        email: "marie@example.com",
        role: "PROVIDER",
        createdAt: new Date(),
        status: "active",
    },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Utilisateurs
                                </CardTitle>
                                <Users className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{ADMIN_STATS.totalUsers}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {ADMIN_STATS.activeBrokers} courtiers • {ADMIN_STATS.activeProviders} apporteurs
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Leads Total
                                </CardTitle>
                                <Activity className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{ADMIN_STATS.totalLeads}</div>
                                <p className="text-xs text-green-500 mt-1">
                                    +{ADMIN_STATS.leadsThisMonth} ce mois
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Revenu Total
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{ADMIN_STATS.revenue.toLocaleString()}€</div>
                                <p className="text-xs text-green-500 mt-1">
                                    +{ADMIN_STATS.revenueThisMonth}€ ce mois
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Taux de Conversion
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">78.5%</div>
                                <p className="text-xs text-muted-foreground mt-1">Leads vendus / Total</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full max-w-2xl grid-cols-3">
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="pending">En attente</TabsTrigger>
                        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader>
                                <CardTitle>Activité Récente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        {
                                            action: "Nouveau lead validé",
                                            details: "Crédit Immobilier - Paris",
                                            time: "Il y a 5 min",
                                        },
                                        {
                                            action: "Nouvel utilisateur inscrit",
                                            details: "Courtier - Lyon",
                                            time: "Il y a 12 min",
                                        },
                                        {
                                            action: "Lead vendu",
                                            details: "Assurance Emprunteur - Marseille",
                                            time: "Il y a 23 min",
                                        },
                                    ].map((activity, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                                        >
                                            <div>
                                                <div className="font-medium">{activity.action}</div>
                                                <div className="text-sm text-muted-foreground">{activity.details}</div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">{activity.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-6">
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader>
                                <CardTitle>Leads en Attente de Validation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {PENDING_LEADS.map((lead) => (
                                        <div
                                            key={lead.id}
                                            className="flex items-center justify-between p-4 rounded-xl border border-border/50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                                    <Clock className="h-5 w-5 text-yellow-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{lead.productType}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Par {lead.provider} • {lead.submittedAt.toLocaleString("fr-FR")}
                                                    </div>
                                                    <div className="text-xs text-yellow-600 mt-1">{lead.reason}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="rounded-full">
                                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                                    Approuver
                                                </Button>
                                                <Button size="sm" variant="outline" className="rounded-full">
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Rejeter
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-6">
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader>
                                <CardTitle>Utilisateurs Récents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {RECENT_USERS.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-4 rounded-xl border border-border/50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                    <Badge variant="outline" className="mt-1 text-xs">
                                                        {user.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-sm text-muted-foreground">
                                                    {user.createdAt.toLocaleDateString("fr-FR")}
                                                </div>
                                                {user.status === "pending" ? (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" className="rounded-full">
                                                            Activer
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Badge className="bg-green-500">Actif</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
