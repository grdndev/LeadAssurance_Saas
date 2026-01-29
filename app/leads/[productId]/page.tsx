"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PRODUCTS, getProductById } from "@/lib/constants/products";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Send, CheckCircle2 } from "lucide-react";

interface FormData {
    productType: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    zipCode: string;
    city: string;
    attributes: Record<string, any>;
    consent: boolean;
}

export default function PublicLeadFormPage({ params }: { params: { productId: string } }) {
    const router = useRouter();
    const product = getProductById(params.productId);
    const [formData, setFormData] = useState<FormData>({
        productType: params.productId,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        zipCode: "",
        city: "",
        attributes: {},
        consent: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!product) {
        return <div className="p-8 text-center">Produit non trouvé</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simuler l'envoi (à remplacer par vraie API)
        setTimeout(() => {
            setSubmitted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    const handleInputChange = (field: string, value: any) => {
        if (["firstName", "lastName", "email", "phone", "zipCode", "city"].includes(field)) {
            setFormData({ ...formData, [field]: value });
        } else {
            setFormData({
                ...formData,
                attributes: { ...formData.attributes, [field]: value },
            });
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full p-8 text-center space-y-6"
                >
                    <div className="h-20 w-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Merci !</h1>
                    <p className="text-muted-foreground">
                        Votre demande a bien été enregistrée. Un conseiller spécialisé vous contactera sous 24h.
                    </p>
                    <Button onClick={() => router.push("/")} className="rounded-full">
                        Retour à l'accueil
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
                        <product.icon className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <p className="text-muted-foreground">
                        Recevez jusqu'à 3 devis personnalisés gratuitement
                    </p>
                </div>

                <Card className="border-border/50 bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Votre demande en 2 minutes</CardTitle>
                        <CardDescription>
                            Toutes vos informations sont protégées et ne seront partagées qu'avec des courtiers certifiés.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informations de contact */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Vos coordonnées</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Prénom *</Label>
                                        <Input
                                            required
                                            className="rounded-full"
                                            placeholder="Jean"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nom *</Label>
                                        <Input
                                            required
                                            className="rounded-full"
                                            placeholder="Dupont"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email *</Label>
                                        <Input
                                            required
                                            type="email"
                                            className="rounded-full"
                                            placeholder="jean.dupont@email.com"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Téléphone *</Label>
                                        <Input
                                            required
                                            type="tel"
                                            className="rounded-full"
                                            placeholder="06 00 00 00 00"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Code postal *</Label>
                                        <Input
                                            required
                                            className="rounded-full"
                                            placeholder="75000"
                                            value={formData.zipCode}
                                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ville *</Label>
                                        <Input
                                            required
                                            className="rounded-full"
                                            placeholder="Paris"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange("city", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Champs spécifiques au produit */}
                            <div className="space-y-4 pt-6 border-t border-border/50">
                                <h3 className="font-semibold text-lg">Détails de votre projet</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.fields.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <Label>{field.label}</Label>
                                            {field.type === "select" ? (
                                                <Select
                                                    onValueChange={(value) => handleInputChange(field.name, value)}
                                                >
                                                    <SelectTrigger className="rounded-full">
                                                        <SelectValue placeholder="Sélectionner..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map((option) => (
                                                            <SelectItem
                                                                key={typeof option === "string" ? option : option.value}
                                                                value={typeof option === "string" ? option : option.value}
                                                            >
                                                                {typeof option === "string" ? option : option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : field.type === "boolean" ? (
                                                <Select
                                                    onValueChange={(value) =>
                                                        handleInputChange(field.name, value === "true")
                                                    }
                                                >
                                                    <SelectTrigger className="rounded-full">
                                                        <SelectValue placeholder="Sélectionner..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">Oui</SelectItem>
                                                        <SelectItem value="false">Non</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                                    className="rounded-full"
                                                    placeholder={field.placeholder}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            field.name,
                                                            field.type === "number" ? parseFloat(e.target.value) : e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Consentement */}
                            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm">Protection de vos données</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Vos informations sont sécurisées et utilisées uniquement pour vous mettre en
                                            relation avec des courtiers certifiés.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        id="consent"
                                        required
                                        checked={formData.consent}
                                        onChange={(e) =>
                                            setFormData({ ...formData, consent: e.target.checked })
                                        }
                                        className="mt-1"
                                    />
                                    <Label htmlFor="consent" className="text-xs cursor-pointer">
                                        J'accepte d'être contacté par des courtiers partenaires concernant ma demande de{" "}
                                        {product.name}. Je comprends que mes données seront traitées conformément au RGPD.
                                    </Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-full py-6 text-lg font-bold"
                            >
                                {isSubmitting ? (
                                    "Envoi en cours..."
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" /> Recevoir mes devis gratuits
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center text-xs text-muted-foreground">
                    <p>🔒 Vos données sont chiffrées et sécurisées</p>
                    <p className="mt-1">✓ Sans engagement • ✓ 100% gratuit • ✓ Réponse sous 24h</p>
                </div>
            </div>
        </div>
    );
}
