"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    AlertCircle,
    ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function UserPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const router = useRouter();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
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
                const res = await fetch(`/api/admin/users?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data.user);
                    setFormData({
                        firstname: data.user.firstname || "",
                        lastname: data.user.lastname || "",
                        email: data.user.email || "",
                        phone: data.user.phone || "",
                        companyName: data.user.companyName || "",
                        siret: data.user.siret || "",
                        orias: data.user.orias || "",
                        address: data.user.address || "",
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
        setFormData(prev => ({ ...prev, [field]: profile[field] == value && value == "" ? undefined : value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    phone: formData.phone,
                    companyName: formData.companyName,
                    siret: formData.siret,
                    orias: formData.orias,
                    address: formData.address,
                }),
            });

            if (!res.ok) throw new Error(await res.json().then(j => j.error) || "Erreur lors de la sauvegarde");

            const updated = await res.json();
            setProfile(updated.user);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    const userName = profile ? `${profile.firstname} ${profile.lastname}` : "";
    const userEmail = profile?.email || "";
    const userRole = profile?.role || "";
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
            <Button variant="ghost" className="p-0" onClick={() => router.push('/admin/backoffice')}>
                <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Profile Section */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" /> Profil
                    </CardTitle>
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
                            <Input value={formData.firstname} onChange={(e) => handleChange("firstname", e.target.value)} className="rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Label>Nom</Label>
                            <Input value={formData.lastname} onChange={(e) => handleChange("lastname", e.target.value)} className="rounded-full" />
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

            {/* Save Button */}
            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}
            <div className="flex justify-end gap-4">
                <Button variant="outline" className="rounded-full" onClick={() => router.push('/admin/backoffice')}>Annuler</Button>
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
