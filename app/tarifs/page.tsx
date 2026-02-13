import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: "Tarifs | LeadsAssurance - Marketplace de Leads Assurance & Crédit",
    description: "Découvrez nos tarifs transparents pour l'achat de leads qualifiés en assurance et crédit. Pas d'abonnement, payez uniquement les leads que vous achetez.",
};

const PRICING_CATEGORIES = [
    {
        title: "Leads Assurance Particuliers",
        description: "Assurance auto, habitation, santé, animaux, obsèques",
        priceRange: "15€ - 35€",
        basePrice: 15,
        features: [
            "Lead qualifié avec coordonnées complètes",
            "Consentement RGPD vérifié",
            "Données fraîches (< 48h)",
            "Exclusivité garantie",
            "PDF de consentement téléchargeable",
        ],
        products: ["Auto", "MRH", "Mutuelle Santé", "Chiens & Chats", "Obsèques"],
        popular: false,
    },
    {
        title: "Leads Assurance Professionnels",
        description: "RC Pro, Décennale, Multirisque, Prévoyance TNS",
        priceRange: "25€ - 55€",
        basePrice: 25,
        features: [
            "Lead qualifié avec coordonnées complètes",
            "Informations entreprise détaillées",
            "Consentement RGPD vérifié",
            "Exclusivité garantie",
            "Possibilité de RDV qualifié (+15€)",
            "PDF de consentement téléchargeable",
        ],
        products: ["RC Pro", "RC Décennale", "Multirisque Pro", "Dommage Ouvrage", "MRI", "Prévoyance TNS"],
        popular: true,
    },
    {
        title: "Leads Crédit & Patrimoine",
        description: "Crédit immobilier, rachat, défiscalisation, assurance vie",
        priceRange: "30€ - 65€",
        basePrice: 30,
        features: [
            "Lead ultra-qualifié avec scoring",
            "Informations financières détaillées",
            "Consentement RGPD vérifié",
            "Exclusivité garantie",
            "RDV qualifié disponible",
            "PDF de consentement téléchargeable",
            "Support prioritaire",
        ],
        products: ["Crédit Immobilier", "Rachat de Crédits", "Crédit Pro", "Assurance Vie / PER", "Défiscalisation"],
        popular: false,
    },
];

const APPOINTMENT_PRICING = {
    title: "Option RDV Qualifié",
    description: "Obtenez un rendez-vous confirmé avec le prospect",
    supplement: "+15€",
    features: [
        "Prospect pré-qualifié par téléphone",
        "Créneau confirmé (téléphone ou visio)",
        "Rappel automatique envoyé au prospect",
        "Taux de conversion x3 vs lead standard",
    ],
};

export default function TarifsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="bg-gradient-to-b from-primary/5 to-transparent border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center">
                        <Badge variant="secondary" className="mb-4">Tarifs transparents</Badge>
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
                            Des leads qualifiés,<br />un prix <span className="text-primary">juste</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Pas d&apos;abonnement, pas d&apos;engagement. Achetez uniquement les leads qui correspondent à vos critères.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PRICING_CATEGORIES.map((cat) => (
                        <Card
                            key={cat.title}
                            className={`relative border-border/50 ${cat.popular ? "border-primary shadow-xl scale-105" : ""}`}
                        >
                            {cat.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground">Le plus populaire</Badge>
                                </div>
                            )}
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-xl">{cat.title}</CardTitle>
                                <CardDescription>{cat.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-primary">{cat.priceRange}</span>
                                    <span className="text-muted-foreground ml-1">/ lead</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <ul className="space-y-3">
                                    {cat.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-4 border-t border-border/50">
                                    <p className="text-xs font-semibold text-muted-foreground mb-2">Produits inclus :</p>
                                    <div className="flex flex-wrap gap-1">
                                        {cat.products.map((product) => (
                                            <Badge key={product} variant="outline" className="text-xs">
                                                {product}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Link href="/register" className="block">
                                    <Button
                                        className={`w-full rounded-full ${cat.popular ? "" : "variant-outline"}`}
                                        variant={cat.popular ? "default" : "outline"}
                                    >
                                        Commencer maintenant
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* RDV Option */}
            <div className="bg-secondary/30 border-y border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-8">
                        <Badge variant="secondary" className="mb-4">Option Premium</Badge>
                        <h2 className="text-3xl font-bold">{APPOINTMENT_PRICING.title}</h2>
                        <p className="text-muted-foreground mt-2">{APPOINTMENT_PRICING.description}</p>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-primary">{APPOINTMENT_PRICING.supplement}</span>
                            <span className="text-muted-foreground ml-1">par lead</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                        {APPOINTMENT_PRICING.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>
                <div className="space-y-6">
                    {[
                        {
                            q: "Y a-t-il un abonnement ou des frais mensuels ?",
                            a: "Non, aucun abonnement. Vous rechargez votre solde de crédits et payez uniquement les leads que vous achetez."
                        },
                        {
                            q: "Comment est garantie la qualité des leads ?",
                            a: "Chaque lead est vérifié par notre équipe avant mise en vente. Les coordonnées sont validées et le consentement RGPD est archivé avec preuve téléchargeable."
                        },
                        {
                            q: "Que se passe-t-il si un lead est invalide ?",
                            a: "Vous pouvez ouvrir un litige sous 48h. Après vérification, le lead est remboursé en crédits si la contestation est justifiée."
                        },
                        {
                            q: "Les leads sont-ils exclusifs ?",
                            a: "Oui, chaque lead est vendu à un seul courtier. Pas de revente multiple."
                        },
                        {
                            q: "Comment recharger mes crédits ?",
                            a: "Depuis votre tableau de bord, vous pouvez recharger par carte bancaire (Visa, Mastercard) via notre prestataire Stripe sécurisé."
                        }
                    ].map((faq) => (
                        <div key={faq.q} className="p-6 rounded-xl bg-secondary/30 border border-border/50">
                            <h3 className="font-semibold mb-2">{faq.q}</h3>
                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 border-t border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Prêt à développer votre portefeuille ?</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Créez votre compte gratuitement et accédez à la salle de marché en quelques minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register">
                            <Button size="lg" className="rounded-full px-8">
                                Créer un compte gratuit <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/blog">
                            <Button variant="outline" size="lg" className="rounded-full px-8">
                                Lire nos guides
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
