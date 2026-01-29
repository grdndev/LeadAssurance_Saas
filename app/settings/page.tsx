"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Building2,
    CreditCard,
    Bell,
    Shield,
    Key,
    Save,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-muted-foreground">Gérez votre compte et vos préférences.</p>
            </div>

            {/* Profile Section */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" /> Profil
                    </CardTitle>
                    <CardDescription>Informations personnelles de votre compte.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                            JS
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Jean Simon</h3>
                            <p className="text-sm text-muted-foreground">jean.simon@courtage.fr</p>
                            <Badge variant="outline" className="mt-2">Courtier</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                        <div className="space-y-2">
                            <Label>Prénom</Label>
                            <Input defaultValue="Jean" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Nom</Label>
                            <Input defaultValue="Simon" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input defaultValue="jean.simon@courtage.fr" type="email" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input defaultValue="06 12 34 56 78" className="rounded-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Company Section */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" /> Entreprise
                    </CardTitle>
                    <CardDescription>Informations de votre structure professionnelle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Raison sociale</Label>
                            <Input defaultValue="Simon Courtage SARL" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>SIRET</Label>
                            <Input defaultValue="123 456 789 00012" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Numéro ORIAS</Label>
                            <Input defaultValue="12345678" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Adresse</Label>
                            <Input defaultValue="15 rue de la Paix, 75002 Paris" className="rounded-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" /> Notifications
                    </CardTitle>
                    <CardDescription>Gérez vos préférences de communication.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                        <div>
                            <div className="font-medium">Nouveaux leads disponibles</div>
                            <div className="text-xs text-muted-foreground">Recevez un email quand un lead correspond à vos critères.</div>
                        </div>
                        <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                        <div>
                            <div className="font-medium">Récapitulatif hebdomadaire</div>
                            <div className="text-xs text-muted-foreground">Un résumé de votre activité chaque lundi.</div>
                        </div>
                        <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                        <div>
                            <div className="font-medium">Alertes de solde faible</div>
                            <div className="text-xs text-muted-foreground">Notification quand vos crédits passent sous 50€.</div>
                        </div>
                        <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" /> Sécurité
                    </CardTitle>
                    <CardDescription>Mot de passe et authentification.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Mot de passe actuel</Label>
                            <Input type="password" placeholder="••••••••" className="rounded-full" />
                        </div>
                        <div></div>
                        <div className="space-y-2">
                            <Label>Nouveau mot de passe</Label>
                            <Input type="password" placeholder="••••••••" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirmer le mot de passe</Label>
                            <Input type="password" placeholder="••••••••" className="rounded-full" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <div className="font-medium">Authentification à deux facteurs</div>
                                <div className="text-xs text-muted-foreground">Ajoutez une couche de sécurité supplémentaire.</div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full">Activer</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
                <Button variant="outline" className="rounded-full">Annuler</Button>
                <Button className="rounded-full px-8" onClick={handleSave}>
                    {saved ? (
                        <>
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Enregistré !
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" /> Enregistrer
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
