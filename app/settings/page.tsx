"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    User,
    Building2,
    CreditCard,
    Bell,
    Shield,
    Key,
    Save,
    CheckCircle2,
    Loader2,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
        siret: "",
        orias: "",
        address: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile");
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    const nameParts = (data.name || "").split(" ");
                    setFormData({
                        firstName: nameParts[0] || "",
                        lastName: nameParts.slice(1).join(" ") || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        companyName: data.companyName || "",
                        siret: data.siret || "",
                        orias: data.orias || "",
                        address: data.address || "",
                    });
                }
            } catch (err) {
                console.error("Fetch profile error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    phone: formData.phone,
                    companyName: formData.companyName,
                    siret: formData.siret,
                    orias: formData.orias,
                    address: formData.address,
                }),
            });

            if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

            const updated = await res.json();
            setProfile(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    const userName = profile?.name || session?.user?.name || "";
    const userEmail = profile?.email || session?.user?.email || "";
    const userRole = profile?.role || (session?.user as any)?.role || "";
    const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "??";
    const roleLabel = userRole === "BROKER" ? "Courtier" : userRole === "PROVIDER" ? "Apporteur" : userRole === "ADMIN" ? "Administrateur" : userRole;

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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
                            {initials}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{userName}</h3>
                            <p className="text-sm text-muted-foreground">{userEmail}</p>
                            <Badge variant="outline" className="mt-2">{roleLabel}</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                        <div className="space-y-2">
                            <Label>Prénom</Label>
                            <Input value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Nom</Label>
                            <Input value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={formData.email} type="email" className="rounded-full" disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="06 12 34 56 78" className="rounded-full" />
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
                            <Input value={formData.companyName} onChange={(e) => handleChange("companyName", e.target.value)} placeholder="Ma Société SARL" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>SIRET</Label>
                            <Input value={formData.siret} onChange={(e) => handleChange("siret", e.target.value)} placeholder="123 456 789 00012" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Numéro ORIAS</Label>
                            <Input value={formData.orias} onChange={(e) => handleChange("orias", e.target.value)} placeholder="12345678" className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Adresse</Label>
                            <Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="15 rue de la Paix, 75002 Paris" className="rounded-full" />
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
            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}
            <div className="flex justify-end gap-4">
                <Button variant="outline" className="rounded-full">Annuler</Button>
                <Button className="rounded-full px-8" onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sauvegarde...
                        </>
                    ) : saved ? (
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
