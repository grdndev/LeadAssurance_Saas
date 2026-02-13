import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Dog, AlertTriangle, CheckCircle2, Shield, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
    title: "Éduquer un Chiot : Guide Complet des Premiers Mois | Blog LeadsAssurance",
    description: "Tout savoir sur l'éducation d'un chiot de 2 à 6 mois : socialisation, propreté, ordres de base, erreurs à éviter. Conseils vétérinaires et méthodes positives pour un compagnon équilibré.",
    keywords: "éduquer chiot, éducation chiot 2 mois, socialisation chiot, propreté chiot, premiers ordres chien, comportement chiot",
    openGraph: {
        title: "Éduquer un Chiot : Le Guide Ultime des Premiers Mois",
        description: "Méthodes d'éducation positive pour chiots. Socialisation, propreté, apprentissages essentiels.",
        type: "article",
    },
};

export default function EducationChiotPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 sm:mb-8">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour aux articles
                    </Link>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Chiots</Badge>
                            <Badge variant="outline">Éducation</Badge>
                            <Badge variant="outline">Premiers Mois</Badge>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                            Éduquer un Chiot : Le Guide Complet des Premiers Mois
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl">
                            De 2 à 6 mois, les bases d'une vie harmonieuse se construisent. Découvrez les étapes essentielles
                            pour éduquer votre chiot avec bienveillance et efficacité.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>9 Février 2024</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>10 min de lecture</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl sm:prose-h2:text-3xl prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed">

                    <section className="mb-12">
                        <h2 className="flex items-center gap-3 mb-6">
                            <PawPrint className="h-8 w-8 text-primary" />
                            Pourquoi les Premiers Mois Sont Cruciaux ?
                        </h2>
                        <p>
                            Les chiots possèdent une <strong>fenêtre de socialisation critique</strong> qui s'étend de 3 à 14 semaines.
                            Durant cette période, leur cerveau est particulièrement réceptif aux nouveaux stimuli. C'est le moment idéal
                            pour façonner un chien équilibré, confiant et sociable. Une négligence durant cette phase peut entraîner
                            des troubles comportementaux difficiles à corriger à l'âge adulte.
                        </p>
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg my-6">
                            <p className="!mb-0 flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                                <span className="text-sm">
                                    <strong>Attention :</strong> Avant les vaccinations complètes (vers 12 semaines), limitez les contacts
                                    au sol dans les lieux publics. Privilégiez les socialisations chez vous ou dans des environnements contrôlés.
                                </span>
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="mb-6">Phase 1 : La Socialisation (2-4 mois)</h2>

                        <h3 className="text-xl font-semibold mt-8 mb-4">Les Fondamentaux de la Socialisation</h3>
                        <p>
                            La socialisation ne se limite pas au contact avec d'autres chiens. Elle englobe l'exposition progressive
                            à l'ensemble des stimuli que votre chiot rencontrera dans sa vie d'adulte.
                        </p>

                        <div className="bg-secondary/30 p-6 rounded-xl border border-border/50 my-6">
                            <h4 className="text-lg font-semibold mb-4">Checklist de Socialisation Complète</h4>

                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold mb-2">👥 Personnes Diverses</p>
                                    <ul className="space-y-1 text-sm">
                                        <li>Enfants de tous âges (sous supervision)</li>
                                        <li>Personnes âgées, personnes en fauteuil roulant</li>
                                        <li>Hommes barbus, personnes portant chapeaux/lunettes</li>
                                        <li>Livreurs, facteurs en uniforme</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold mb-2">🐕 Autres Animaux</p>
                                    <ul className="space-y-1 text-sm">
                                        <li>Chiens adultes bien sociabilisés (vaccins à jour)</li>
                                        <li>Autres chiots de même âge</li>
                                        <li>Chats, oiseaux, NAC si possible</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold mb-2">🌍 Environnements Variés</p>
                                    <ul className="space-y-1 text-sm">
                                        <li>Ville : foules, trafic, bruits urbains</li>
                                        <li>Nature : forêt, plage, campagne</li>
                                        <li>Transports : voiture, train, bus</li>
                                        <li>Surfaces différentes : métal, grilles, escaliers</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold mb-2">🔊 Stimuli Sonores</p>
                                    <ul className="space-y-1 text-sm">
                                        <li>Aspirateur, sèche-cheveux, tondeuse</li>
                                        <li>Orages (enregistrements audio progressifs)</li>
                                        <li>Sirènes, klaxons, feux d'artifice</li>
                                        <li>Musique à volume modéré</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-8 mb-4">La Règle d'Or : Toujours en Positif</h3>
                        <p>
                            Chaque nouvelle expérience doit être associée à quelque chose d'agréable (friandise, jeu, caresse).
                            Si votre chiot montre des signes de peur, ne forcez jamais. Reculez d'un pas, augmentez la distance
                            et récompensez le calme. La désensibilisation fonctionne par exposition graduelle, jamais par immersion brutale.
                        </p>
                    </section>

                    <section className="mb-12 bg-secondary/30 p-6 sm:p-8 rounded-2xl border border-border/50">
                        <h2 className="!mt-0 mb-6">Phase 2 : L'Apprentissage de la Propreté (2-5 mois)</h2>

                        <h3 className="text-xl font-semibold mb-4">Le Protocole en 6 Étapes</h3>

                        <div className="space-y-6">
                            <div className="bg-background p-4 rounded-lg">
                                <h4 className="font-bold text-primary mb-2">1. Établir un Rythme Régulier</h4>
                                <p className="text-sm mb-2">Sortez votre chiot <strong>toutes les 2 heures</strong> durant la journée, ainsi que :</p>
                                <ul className="text-sm space-y-1">
                                    <li>• Immédiatement après le réveil</li>
                                    <li>• 15-30 minutes après chaque repas</li>
                                    <li>• Après chaque sieste</li>
                                    <li>• Après les sessions de jeu intense</li>
                                </ul>
                            </div>

                            <div className="bg-background p-4 rounded-lg">
                                <h4 className="font-bold text-primary mb-2">2. Choisir un Lieu Dédié</h4>
                                <p className="text-sm">
                                    Emmenez toujours votre chiot au même endroit. L'odeur de ses précédentes éliminations
                                    déclenchera le réflexe. Utilisez un mot-clé ("Fait tes besoins", "Pipi") de manière systématique.
                                </p>
                            </div>

                            <div className="bg-background p-4 rounded-lg">
                                <h4 className="font-bold text-primary mb-2">3. Récompenser Activement</h4>
                                <p className="text-sm">
                                    Dès que votre chiot fait à l'extérieur, félicitez-le verbalement pendant l'acte,
                                    puis donnez une friandise jackpot immédiatement après. Le timing est crucial :
                                    la récompense doit intervenir dans les 2 secondes.
                                </p>
                            </div>

                            <div className="bg-background p-4 rounded-lg">
                                <h4 className="font-bold text-primary mb-2">4. Gérer les Accidents sans Punition</h4>
                                <p className="text-sm">
                                    Si vous surprenez votre chiot en train d'uriner à l'intérieur, interrompez-le calmement
                                    ("Ah-ah") et emmenez-le dehors finir. <strong className="text-destructive">Ne criez jamais</strong>,
                                    ne frottez pas son nez dedans : cela crée de l'anxiété et retarde l'apprentissage.
                                </p>
                            </div>

                            <div className="bg-background p-4 rounded-lg">
                                <h4 className="font-bold text-primary mb-2">5. Nettoyer avec un Produit Enzymatique</h4>
                                <p className="text-sm">
                                    Les nettoyants classiques ne suppriment pas les phéromones. Utilisez un produit enzymatique
                                    spécial animaux pour éliminer totalement l'odeur et éviter les récidives au même endroit.
                                </p>
                            </div>

                            <div className="bg-background p-4 rounded-lg">
                                <h4 className="font-bold text-primary mb-2">6. Patience : Chaque Chiot est Différent</h4>
                                <p className="text-sm">
                                    Certaines races (Beagle, Teckel) sont réputées plus longues à devenir propres.
                                    En moyenne, attendez-vous à une propreté fiable vers 5-6 mois. Les accidents occasionnels
                                    peuvent persister jusqu'à 8-12 mois.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="mb-6">Phase 3 : Les Premiers Ordres de Base (3-6 mois)</h2>

                        <h3 className="text-xl font-semibold mt-6 mb-4">1. Le "Assis" (Ordre Fondamental)</h3>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                            <p className="font-semibold mb-2">Protocole :</p>
                            <ol className="space-y-2 text-sm list-decimal list-inside">
                                <li>Prenez une friandise dans votre main fermée</li>
                                <li>Placez-la devant le nez du chiot, puis remontez lentement au-dessus de sa tête</li>
                                <li>Son arrière-train va naturellement toucher le sol</li>
                                <li>Au moment précis où il s'assoit, dites "Assis" et donnez la friandise</li>
                                <li>Répétez 5-10 fois par session, 3 sessions par jour</li>
                            </ol>
                        </div>

                        <h3 className="text-xl font-semibold mt-6 mb-4">2. Le Rappel "Au Pied" / "Viens"</h3>
                        <p>
                            Le rappel est l'ordre de survie. Un chiot qui ne revient pas est en danger permanent.
                            Ne le travaillez jamais dans un environnement non sécurisé avant la maîtrise complète.
                        </p>
                        <div className="bg-secondary/20 p-4 rounded-lg mt-4">
                            <p className="font-semibold mb-2">Astuce Pro :</p>
                            <ul className="space-y-2 text-sm">
                                <li>✅ Associez le rappel à quelque chose d'extrêmement positif (jouet favori, friandise premium)</li>
                                <li>✅ Ne rappelez jamais pour quelque chose de désagréable (fin de balade, bain)</li>
                                <li>✅ Pratiquez le "jeu de cache-cache" à la maison pour renforcer</li>
                                <li>✅ Utilisez une longe de 10m lors des premières sorties en espace ouvert</li>
                            </ul>
                        </div>

                        <h3 className="text-xl font-semibold mt-6 mb-4">3. Le "Pas Bouger" (Vers 5-6 mois)</h3>
                        <p>
                            Plus complexe car il nécessite de l'auto-contrôle. Commencez par 2 secondes, augmentez progressivement.
                            N'oubliez pas de toujours libérer votre chiot avec un mot de fin ("C'est bon", "OK").
                        </p>
                    </section>

                    <section className="mb-12 bg-destructive/5 border border-destructive/20 p-6 sm:p-8 rounded-2xl">
                        <h2 className="!mt-0 mb-6 flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                            Les 7 Erreurs à Éviter Absolument
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <span className="text-2xl shrink-0">❌</span>
                                <div>
                                    <p className="font-semibold">1. Punir les comportements de peur</p>
                                    <p className="text-sm text-muted-foreground">Cela renforce l'anxiété au lieu de la réduire.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="text-2xl shrink-0">❌</span>
                                <div>
                                    <p className="font-semibold">2. Sur-stimuler le chiot</p>
                                    <p className="text-sm text-muted-foreground">Les chiots ont besoin de 18-20h de sommeil par jour. Un chiot fatigué est un chiot mordeur et capricieux.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="text-2xl shrink-0">❌</span>
                                <div>
                                    <p className="font-semibold">3. Laisser le chiot mordiller les mains</p>
                                    <p className="text-sm text-muted-foreground">Ce qui est mignon à 2 mois devient problématique à 10 mois. Redirigez systématiquement vers un jouet.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="text-2xl shrink-0">❌</span>
                                <div>
                                    <p className="font-semibold">4. Utiliser des méthodes coercitives</p>
                                    <p className="text-sm text-muted-foreground">Colliers étrangleurs, tapes sur le museau : interdits chez un chiot. Favorisez toujours le renforcement positif.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="text-2xl shrink-0">❌</span>
                                <div>
                                    <p className="font-semibold">5. Manquer de cohérence</p>
                                    <p className="text-sm text-muted-foreground">Toute la famille doit appliquer les mêmes règles. Un chiot qui monte sur le canapé avec papa mais pas avec maman sera confus.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="text-2xl shrink-0">❌</span>
                                <div>
                                    <p className="font-semibold">6. Négliger la santé dentaire</p>
                                    <p className="text-sm text-muted-foreground">Habituez votre chiot au brossage des dents dès 3 mois pour éviter les maladies parodontales.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="text-2xl shrink-0">❌</span>
                                <div>
                                    <p className="font-semibold">7. Reporter l'assurance santé</p>
                                    <p className="text-sm text-muted-foreground">Les chiots sont vulnérables : accidents, ingestion de corps étrangers. Une assurance avant 6 mois couvre généralement mieux et coûte moins cher.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12 bg-primary/5 p-6 sm:p-8 rounded-2xl border border-primary/20">
                        <h2 className="!mt-0 mb-4 flex items-center gap-3">
                            <Shield className="h-8 w-8 text-primary" />
                            Assurance Chiot : Pourquoi Souscrire dès 2 Mois ?
                        </h2>
                        <p className="mb-4">
                            Les statistiques vétérinaires montrent que <strong>40% des chiots consultent en urgence</strong>
                            durant leur première année pour :
                        </p>
                        <ul className="space-y-2 mb-4">
                            <li>🩺 Gastro-entérites (ingestion de corps étrangers)</li>
                            <li>🩺 Fractures (chutes, jeux violents)</li>
                            <li>🩺 Intoxications alimentaires</li>
                            <li>🩺 Maladies infectieuses malgré les vaccins</li>
                        </ul>
                        <p className="font-semibold">
                            Une assurance santé pour chiot démarre dès 35€/mois et couvre jusqu'à 100% des frais vétérinaires.
                            Plus vous souscrivez tôt, plus les tarifs sont avantageux et moins les exclusions s'appliquent.
                        </p>
                        <div className="mt-6">
                            <Link href="/dashboard/marketplace">
                                <Button size="lg" className="w-full sm:w-auto rounded-full">
                                    Comparer les Assurances Chiots
                                </Button>
                            </Link>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-6 flex items-center gap-3">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                            Calendrier Récapitulatif par Âge
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-secondary/20 p-4 rounded-lg">
                                <p className="font-bold text-primary mb-2">📅 2-3 Mois</p>
                                <ul className="text-sm space-y-1">
                                    <li>• Socialisation intensive (environnements contrôlés)</li>
                                    <li>• Début de la propreté (sorties fréquentes)</li>
                                    <li>• Habituation au matériel (collier, laisse)</li>
                                    <li>• Premiers vaccins</li>
                                </ul>
                            </div>

                            <div className="bg-secondary/20 p-4 rounded-lg">
                                <p className="font-bold text-primary mb-2">📅 3-4 Mois</p>
                                <ul className="text-sm space-y-1">
                                    <li>• Poursuite de la socialisation (début des lieux publics si vaccins OK)</li>
                                    <li>• Apprentissage "Assis" et "Son nom"</li>
                                    <li>• Propreté en progression (encore des accidents)</li>
                                    <li>• École des chiots recommandée</li>
                                </ul>
                            </div>

                            <div className="bg-secondary/20 p-4 rounded-lg">
                                <p className="font-bold text-primary mb-2">📅 4-5 Mois</p>
                                <ul className="text-sm space-y-1">
                                    <li>• Consolidation de la propreté</li>
                                    <li>• "Couché", "Pas bouger", Rappel</li>
                                    <li>• Début de la marche en laisse sans tirer</li>
                                    <li>• Perte des dents de lait (besoin de mâcher ++)</li>
                                </ul>
                            </div>

                            <div className="bg-secondary/20 p-4 rounded-lg">
                                <p className="font-bold text-primary mb-2">📅 5-6 Mois</p>
                                <ul className="text-sm space-y-1">
                                    <li>• Puberté naissante (début d'indépendance)</li>
                                    <li>• Renforcement de tous les acquis</li>
                                    <li>• Propreté normalement acquise</li>
                                    <li>• Possibilité de commencer un sport canin (agility puppy)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>

                {/* CTA Section */}
                <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Besoin d'un Professionnel de l'Éducation Canine ?</h3>
                    <p className="text-muted-foreground mb-6">
                        Un éducateur canin certifié peut vous accompagner personnellement dans l'éducation de votre chiot.
                        Découvrez également nos solutions d'assurance santé pour protéger votre compagnon dès ses premiers mois.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/dashboard/marketplace" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full rounded-full">
                                Trouver une Assurance Chiot
                            </Button>
                        </Link>
                        <Link href="/blog" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full rounded-full">
                                Autres Conseils Canins
                            </Button>
                        </Link>
                    </div>
                </div>

                <RelatedArticles currentArticleId="education-chiot-premiers-mois" />
            </article>
        </div>
    );
}
