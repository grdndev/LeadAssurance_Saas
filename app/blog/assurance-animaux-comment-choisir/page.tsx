import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Heart, Euro, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
    title: "Assurance Chien & Chat : Comment Bien Choisir ? | Blog LeadsAssurance",
    description: "Couvertures, tarifs, exclusions : tout savoir pour choisir la meilleure assurance santé pour votre animal de compagnie. Guide complet 2024.",
    keywords: "assurance chien, assurance chat, mutuelle animaux, assurance santé animal, comparatif assurance animaux",
    openGraph: {
        title: "Assurance Chien & Chat : Comment Bien Choisir ?",
        description: "Couvertures, tarifs et exclusions pour la meilleure assurance santé animale.",
        type: "article",
    },
};

export default function AssuranceAnimauxPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 sm:mb-8">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour aux articles
                    </Link>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Assurance Animaux</Badge>
                            <Badge variant="outline">Guide</Badge>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                            Assurance Chien & Chat : Comment Bien Choisir ?
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl">
                            Couvertures, tarifs, exclusions : tout savoir pour choisir la meilleure assurance santé pour votre animal de compagnie.
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>10 Février 2024</span>
                            <span>•</span>
                            <span>8 min de lecture</span>
                            <span>•</span>
                            <span>Par Conseiller Assurances</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="prose prose-lg max-w-none">
                    <h2 className="text-2xl font-bold mt-8 mb-4">Pourquoi assurer son animal de compagnie ?</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        Les frais vétérinaires peuvent rapidement devenir très élevés. Une simple consultation coûte entre
                        30€ et 60€, mais une intervention chirurgicale peut dépasser les 2 000€. L&apos;assurance santé animale
                        permet de couvrir tout ou partie de ces frais et d&apos;offrir les meilleurs soins à votre compagnon
                        sans vous ruiner.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
                            <div className="text-2xl font-bold text-primary">67%</div>
                            <p className="text-sm text-muted-foreground mt-1">des foyers français ont un animal</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                            <Euro className="h-8 w-8 text-primary mx-auto mb-3" />
                            <div className="text-2xl font-bold text-primary">600€</div>
                            <p className="text-sm text-muted-foreground mt-1">budget vétérinaire moyen par an</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                            <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
                            <div className="text-2xl font-bold text-primary">80%</div>
                            <p className="text-sm text-muted-foreground mt-1">de remboursement en formule premium</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mt-10 mb-4">Les différentes formules</h2>

                    <h3 className="text-xl font-semibold mt-6 mb-3">Formule Essentielle (10-20€/mois)</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        La formule de base couvre généralement les accidents et les maladies les plus courantes.
                        Le taux de remboursement est souvent autour de 50-60% avec un plafond annuel de 1 000 à 1 500€.
                        Idéale pour les propriétaires souhaitant une protection minimale.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">Formule Confort (20-40€/mois)</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Elle ajoute la couverture des consultations spécialisées, des examens complémentaires
                        (radios, analyses sanguines) et souvent la stérilisation. Remboursement à 70-80% avec un
                        plafond de 2 000 à 3 000€ par an.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">Formule Premium (40-70€/mois)</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        La couverture la plus complète : accidents, maladies, prévention (vaccins, antiparasitaires,
                        détartrage), médecines douces (ostéopathie, acupuncture). Remboursement jusqu&apos;à 100%
                        avec des plafonds de 2 500 à 5 000€.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">Les critères essentiels à vérifier</h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
                            <FileCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Le délai de carence</h4>
                                <p className="text-sm text-muted-foreground">Période après souscription pendant laquelle les garanties ne s&apos;appliquent pas (généralement 2 à 6 mois pour les maladies).</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
                            <FileCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Les exclusions</h4>
                                <p className="text-sm text-muted-foreground">Maladies héréditaires, races à risque, âge limite de souscription (souvent 7-10 ans).</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
                            <FileCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Le plafond annuel</h4>
                                <p className="text-sm text-muted-foreground">Montant maximum remboursé par an. Plus il est élevé, mieux vous êtes couvert en cas de gros pépin.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
                            <FileCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">La franchise</h4>
                                <p className="text-sm text-muted-foreground">Montant restant à votre charge par sinistre. Certaines formules sont sans franchise.</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mt-10 mb-4">Chien vs Chat : des différences de tarif</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        L&apos;assurance pour un chien est généralement plus chère que pour un chat (15-50% de plus),
                        car les chiens sont plus souvent sujets aux accidents et certaines races nécessitent des soins
                        spécifiques. Les grands chiens (Berger Allemand, Labrador) coûtent plus cher à assurer que
                        les petites races.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">Quand souscrire ?</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        Le plus tôt possible ! L&apos;idéal est de souscrire dès l&apos;adoption ou les premiers mois de vie.
                        Plus votre animal est jeune, plus les cotisations seront basses et moins il y aura d&apos;exclusions
                        liées à des pathologies préexistantes.
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Trouvez la meilleure assurance pour votre animal</h3>
                    <p className="text-muted-foreground mb-6">
                        Comparez les offres des meilleurs assureurs via notre réseau de courtiers spécialisés.
                        Recevez jusqu&apos;à 3 devis gratuits et sans engagement.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/leads/ASSURANCE_CHIEN_CHAT" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full rounded-full">
                                Obtenir mes devis gratuits
                            </Button>
                        </Link>
                        <Link href="/blog" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full rounded-full">
                                Lire d&apos;autres guides
                            </Button>
                        </Link>
                    </div>
                </div>

                <RelatedArticles currentArticleId="assurance-animaux-comment-choisir" />
            </article>
        </div>
    );
}
