import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Dog, TrendingUp, Euro, FileCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { RelatedArticles } from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
    title: "Comment Devenir Éducateur Canin Professionnel en France | Blog LeadsAssurance",
    description: "Formations, diplômes, démarches administratives et business model pour devenir éducateur canin en 2024. Guide complet : BPJEPS, salaire, assurance pro, statut juridique.",
    keywords: "devenir éducateur canin, formation éducateur canin, BPJEPS éducateur canin, diplôme comportementaliste canin, créer entreprise éducation canine",
    openGraph: {
        title: "Devenir Éducateur Canin : Le Guide Complet 2024",
        description: "Formations, diplômes et démarches pour lancer votre activité d'éducateur canin professionnel.",
        type: "article",
    },
};

export default function DevenirEducateurCaninPage() {
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
                            <Badge variant="secondary">Carrière</Badge>
                            <Badge variant="outline">Formation Pro</Badge>
                            <Badge variant="outline">Entrepreneuriat</Badge>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                            Comment Devenir Éducateur Canin Professionnel en France
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl">
                            Diplômes, formations, démarches administratives et business : tout ce qu'il faut savoir
                            pour transformer votre passion en métier reconnu.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>9 Février 2024</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>12 min de lecture</span>
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
                            <Dog className="h-8 w-8 text-primary" />
                            Le Métier d'Éducateur Canin en 2024
                        </h2>
                        <p>
                            L'éducateur canin est un <strong>professionnel de la relation homme-chien</strong>. Contrairement
                            au dresseur (orienté performance) ou au comportementaliste (spécialisé dans les troubles),
                            l'éducateur enseigne les <strong>bases de l'obéissance et de la sociabilité</strong> aux chiens
                            de compagnie et à leurs maîtres.
                        </p>

                        <h3 className="text-xl font-semibold mt-6 mb-4">Missions Principales</h3>
                        <ul className="space-y-2">
                            <li>🎯 Apprentissage des ordres de base (assis, couché, rappel, marche en laisse)</li>
                            <li>🎯 Socialisation du chien (congénères, environnement, humains)</li>
                            <li>🎯 Conseils sur l'alimentation, les soins, l'équipement</li>
                            <li>🎯 Prévention des troubles du comportement</li>
                            <li>🎯 Organisation de cours collectifs ou individuels</li>
                            <li>🎯 Accompagnement lors de l'adoption (choix de la race, intégration)</li>
                        </ul>

                        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 my-6">
                            <p className="font-semibold mb-2">💡 À Savoir :</p>
                            <p className="text-sm !mb-0">
                                La demande d'éducation canine a explosé de <strong>+35% depuis 2020</strong> (source : Fédération Cynologique).
                                La crise COVID a multiplié les adoptions de chiots, créant un besoin massif d'éducateurs compétents.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="mb-6">Les Diplômes et Formations Reconnues</h2>

                        <h3 className="text-xl font-semibold mb-4">1. Le BPJEPS Éducateur Canin (Référence Nationale)</h3>
                        <div className="bg-secondary/30 p-6 rounded-xl border border-border/50">
                            <p className="font-bold mb-3">Brevet Professionnel de la Jeunesse, de l'Éducation Populaire et du Sport</p>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-semibold">📚 Contenu de la Formation</p>
                                    <ul className="space-y-1 mt-2">
                                        <li>• Éthologie et comportement canin</li>
                                        <li>• Techniques d'éducation (positive, classique, clicker)</li>
                                        <li>• Anatomie et physiologie</li>
                                        <li>• Législation et réglementation</li>
                                        <li>• Gestion d'entreprise et communication</li>
                                        <li>• Zoonoses et premiers secours</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold">⏱️ Durée et Rythme</p>
                                    <p>10 à 18 mois en alternance (centre de formation + stage en entreprise)</p>
                                </div>

                                <div>
                                    <p className="font-semibold">💰 Coût</p>
                                    <p>Entre 8 000€ et 12 000€ selon les organismes. Finançable via CPF, Pôle Emploi, Région.</p>
                                </div>

                                <div>
                                    <p className="font-semibold">🎓 Niveau Requis</p>
                                    <p>CAP/BEP minimum, ou expérience professionnelle équivalente. Certains centres exigent le PSC1.</p>
                                </div>

                                <div>
                                    <p className="font-semibold">📌 Principaux Organismes</p>
                                    <ul className="mt-2 space-y-1">
                                        <li>• <strong>CFPPA de Cibeins</strong> (Ain) - Référence historique</li>
                                        <li>• <strong>MFR de Carquefou</strong> (Loire-Atlantique)</li>
                                        <li>• <strong>Hervé Pupil</strong> (Occitanie)</li>
                                        <li>• <strong>CFAA du Lot</strong> (Gramat)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-8 mb-4">2. L'ACACED (Attestation de Connaissances Obligatoire)</h3>
                        <p>
                            Depuis 2016, <strong>toute personne exerçant une activité professionnelle avec les animaux</strong>
                            (élevage, pension, vente, éducation) doit détenir l'ACACED (ex-CCAD). Cette formation de 14h minimum
                            est un pré-requis légal.
                        </p>
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg my-4">
                            <p className="font-semibold text-sm">⚠️ Attention : L'ACACED seule ne suffit PAS</p>
                            <p className="text-sm !mb-0">
                                Elle atteste de connaissances de base en biologie animale mais ne forme pas au métier d'éducateur.
                                Elle doit être complétée par un BPJEPS ou une formation longue équivalente.
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold mt-8 mb-4">3. Formations Privées (Non Diplômantes mais Professionnalisantes)</h3>
                        <p>Plusieurs organismes privés proposent des cursus de qualité :</p>
                        <ul className="space-y-2 text-sm">
                            <li>• <strong>Vox Animae</strong> (12 mois, intensif, méthodes positives exclusives)</li>
                            <li>• <strong>Cynopsy</strong> (approche cognitivo-comportementale)</li>
                            <li>• <strong>EduKa</strong> (formation en ligne + stages pratiques)</li>
                            <li>• <strong>Michel Lacasse Formation</strong> (Québec, reconnu internationalement)</li>
                        </ul>
                        <p className="text-sm mt-3 italic">
                            Ces formations n'ont pas de valeur légale mais sont souvent très opérationnelles.
                            Privilégiez celles qui incluent beaucoup de pratique terrain.
                        </p>
                    </section>

                    <section className="mb-12 bg-secondary/30 p-6 sm:p-8 rounded-2xl border border-border/50">
                        <h2 className="!mt-0 mb-6">Les Démarches Administratives pour S'Installer</h2>

                        <h3 className="text-xl font-semibold mb-4">Étape 1 : Choisir Son Statut Juridique</h3>

                        <div className="space-y-4">
                            <div className="bg-background p-4 rounded-lg">
                                <p className="font-bold mb-2">📊 Micro-Entreprise (Auto-Entrepreneur)</p>
                                <div className="text-sm space-y-1">
                                    <p><strong>Avantages :</strong> Démarches simplifiées, comptabilité allégée, pas de TVA si CA &lt; 36 800€</p>
                                    <p><strong>Inconvénients :</strong> Plafond de CA (77 700€), cotisations même sans chiffre d'affaires</p>
                                    <p><strong>Idéal pour :</strong> Débuter seul, tester son activité</p>
                                </div>
                            </div>

                            <div className="bg-background p-4 rounded-lg">
                                <p className="font-bold mb-2">🏢 SASU / EURL</p>
                                <div className="text-sm space-y-1">
                                    <p><strong>Avantages :</strong> Pas de plafond de CA, charges sociales sur rémunération uniquement (SASU)</p>
                                    <p><strong>Inconvénients :</strong> Comptabilité obligatoire, frais de création ~500€</p>
                                    <p><strong>Idéal pour :</strong> Développement avec salariés, investissements matériels importants</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-8 mb-4">Étape 2 : Obtenir l'ACACED Chiens</h3>
                        <p className="text-sm">
                            Formation de 14h auprès d'un organisme habilité (CFPPA, chambres d'agriculture).
                            Coût : 150-300€. Validité : 10 ans renouvelables.
                        </p>

                        <h3 className="text-xl font-semibold mt-6 mb-4">Étape 3 : Déclaration d'Activité à la DDPP</h3>
                        <p className="text-sm">
                            Avant de démarrer, vous devez déclarer votre activité à la <strong>Direction Départementale
                                de la Protection des Populations</strong> (ex-DDSV) de votre département. Délai : 30 jours avant le début.
                        </p>

                        <h3 className="text-xl font-semibold mt-6 mb-4">Étape 4 : Souscrire une Assurance RC Professionnelle</h3>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                            <p className="font-semibold text-sm mb-2">🛡️ Assurance Obligatoire</p>
                            <p className="text-sm">
                                La RC Pro couvre les dommages causés par un chien durant vos cours (morsure, accident).
                                Coût : 250-600€/an selon garanties. Comparez sur <Link href="/dashboard/marketplace" className="text-primary underline">LeadsAssurance.com</Link>
                                pour trouver les meilleurs tarifs.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="mb-6 flex items-center gap-3">
                            <TrendingUp className="h-8 w-8 text-primary" />
                            Business Model et Revenus
                        </h2>

                        <h3 className="text-xl font-semibold mb-4">Grilles Tarifaires Moyennes (2024)</h3>
                        <div className="bg-secondary/20 p-6 rounded-xl">
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div className="bg-background p-4 rounded-lg">
                                    <p className="font-bold mb-2">Cours Individuels</p>
                                    <ul className="space-y-1">
                                        <li>• 1ère séance (bilan) : 60-80€</li>
                                        <li>• Séance de suivi (1h) : 40-60€</li>
                                        <li>• Forfait 10 séances : 350-500€</li>
                                    </ul>
                                </div>

                                <div className="bg-background p-4 rounded-lg">
                                    <p className="font-bold mb-2">Cours Collectifs</p>
                                    <ul className="space-y-1">
                                        <li>• Séance 1h (6-8 chiens) : 15-25€/chien</li>
                                        <li>• Forfait mensuel (4 séances) : 50-80€</li>
                                        <li>• École des chiots : 20-30€/séance</li>
                                    </ul>
                                </div>

                                <div className="bg-background p-4 rounded-lg">
                                    <p className="font-bold mb-2">Services Premium</p>
                                    <ul className="space-y-1">
                                        <li>• Rééducation comportementale : 80-120€/h</li>
                                        <li>• Bilan pré-adoption : 100-150€</li>
                                        <li>• Formation maître + chien (intensif) : 800-1200€/semaine</li>
                                    </ul>
                                </div>

                                <div className="bg-background p-4 rounded-lg">
                                    <p className="font-bold mb-2">Revenus Estimés</p>
                                    <ul className="space-y-1">
                                        <li>• <strong>Débutant</strong> : 1 200-1 800€/mois</li>
                                        <li>• <strong>Confirmé (3-5 ans)</strong> : 2 500-3 500€/mois</li>
                                        <li>• <strong>Expert multi-services</strong> : 4 000-6 000€/mois</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-8 mb-4">Diversifier Ses Revenus</h3>
                        <ul className="space-y-2">
                            <li>✅ <strong>Vente d'accessoires</strong> : Harnais, laisses longues, clickers (marge 30-50%)</li>
                            <li>✅ <strong>Formations en ligne</strong> : Cours vidéo, webinaires, eBooks</li>
                            <li>✅ <strong>Interventions en entreprise</strong> : Ateliers bien-être animal (CSE)</li>
                            <li>✅ <strong>Partenariats vétérinaires</strong> : Recommandations mutuelles, co-consultations</li>
                            <li>✅ <strong>Pension éducative</strong> : Hébergement + formation intensive (500-800€/semaine)</li>
                        </ul>
                    </section>

                    <section className="mb-12 bg-secondary/30 p-6 sm:p-8 rounded-2xl border border-border/50">
                        <h2 className="!mt-0 mb-6 flex items-center gap-3">
                            <Users className="h-8 w-8 text-primary" />
                            Trouver Ses Premiers Clients
                        </h2>

                        <h3 className="text-xl font-semibold mb-4">1. Communication Locale</h3>
                        <ul className="space-y-2 text-sm">
                            <li>• <strong>Partenariats vétérinaires</strong> : Laissez des flyers, proposez une commission sur recommandation</li>
                            <li>• <strong>Animaleries et refuges</strong> : Cours gratuits pour adoptants = visibilité</li>
                            <li>• <strong>Marchés et événements canins</strong> : Stands, démonstrations gratuites</li>
                            <li>• <strong>Affichage ciblé</strong> : Parcs à chiens, cabinets vétérinaires, toiletteurs</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-4">2. Présence Digitale</h3>
                        <ul className="space-y-2 text-sm">
                            <li>• <strong>Site web SEO</strong> : WordPress + blog (conseils éducation = trafic organique)</li>
                            <li>• <strong>Google My Business</strong> : Indispensable pour le référencement local</li>
                            <li>• <strong>Réseaux sociaux</strong> : Instagram/TikTok avec vidéos avant/après</li>
                            <li>• <strong>Avis clients</strong> : Collectez-les sur Google, Facebook, Trustpilot</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-4">3. Plateformes de Mise en Relation</h3>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                            <p className="font-semibold mb-2">💼 LeadsAssurance : Votre Allié Business</p>
                            <p className="text-sm">
                                En tant qu'éducateur canin, vous êtes <strong>apporteur d'affaires</strong> pour les assurances
                                animaux. Inscrivez-vous sur <Link href="/register" className="text-primary underline font-semibold">LeadsAssurance.com</Link> en
                                tant que <strong>Provider</strong> pour :
                            </p>
                            <ul className="text-sm space-y-1 mt-3">
                                <li>✅ Générer des leads qualifiés (propriétaires cherchant une assurance)</li>
                                <li>✅ Toucher une commission de 50% sur chaque lead vendu</li>
                                <li>✅ Monétiser votre fichier clients sans effort commercial</li>
                                <li>✅ Accéder à un revenu passif complémentaire (500-1500€/mois)</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="mb-6 flex items-center gap-3">
                            <FileCheck className="h-8 w-8 text-primary" />
                            Checklist Avant de Se Lancer
                        </h2>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 bg-secondary/20 p-4 rounded-lg">
                                <input type="checkbox" className="mt-1 shrink-0" id="check1" />
                                <label htmlFor="check1" className="text-sm">
                                    <strong>BPJEPS Éducateur Canin</strong> obtenu (ou formation privée équivalente + 3 ans d'expérience)
                                </label>
                            </div>

                            <div className="flex items-start gap-3 bg-secondary/20 p-4 rounded-lg">
                                <input type="checkbox" className="mt-1 shrink-0" id="check2" />
                                <label htmlFor="check2" className="text-sm">
                                    <strong>ACACED Chiens</strong> en cours de validité
                                </label>
                            </div>

                            <div className="flex items-start gap-3 bg-secondary/20 p-4 rounded-lg">
                                <input type="checkbox" className="mt-1 shrink-0" id="check3" />
                                <label htmlFor="check3" className="text-sm">
                                    <strong>Statut juridique</strong> créé (micro-entreprise ou société)
                                </label>
                            </div>

                            <div className="flex items-start gap-3 bg-secondary/20 p-4 rounded-lg">
                                <input type="checkbox" className="mt-1 shrink-0" id="check4" />
                                <label htmlFor="check4" className="text-sm">
                                    <strong>Déclaration DDPP</strong> effectuée (30 jours avant début d'activité)
                                </label>
                            </div>

                            <div className="flex items-start gap-3 bg-secondary/20 p-4 rounded-lg">
                                <input type="checkbox" className="mt-1 shrink-0" id="check5" />
                                <label htmlFor="check5" className="text-sm">
                                    <strong>Assurance RC Professionnelle</strong> souscrite et à jour
                                </label>
                            </div>

                            <div className="flex items-start gap-3 bg-secondary/20 p-4 rounded-lg">
                                <input type="checkbox" className="mt-1 shrink-0" id="check6" />
                                <label htmlFor="check6" className="text-sm">
                                    <strong>Terrain d'entraînement</strong> sécurisé (clôturé, adapté aux cours collectifs)
                                </label>
                            </div>

                            <div className="flex items-start gap-3 bg-secondary/20 p-4 rounded-lg">
                                <input type="checkbox" className="mt-1 shrink-0" id="check7" />
                                <label htmlFor="check7" className="text-sm">
                                    <strong>Matériel de base</strong> : clickers, laisses longues, récompenses, plots, tunnels
                                </label>
                            </div>

                            <div className="flex items-start gap-3 bg-secondary/20 p-4 rounded-lg">
                                <input type="checkbox" className="mt-1 shrink-0" id="check8" />
                                <label htmlFor="check8" className="text-sm">
                                    <strong>Stratégie marketing</strong> définie (site web, réseaux, partenariats)
                                </label>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-6">Conclusion : Un Métier Passion à Fort Potentiel</h2>
                        <p>
                            Devenir éducateur canin professionnel demande un <strong>investissement en formation et en temps</strong>,
                            mais offre une <strong>liberté d'organisation exceptionnelle</strong> et la satisfaction de transformer
                            des relations homme-chien au quotidien.
                        </p>
                        <p className="mt-4">
                            Avec une population canine française estimée à 7,6 millions de chiens (2024) et une sensibilisation
                            croissante au bien-être animal, le marché de l'éducation positive est en pleine expansion.
                            Les éducateurs formés et bienveillants n'ont jamais été aussi recherchés.
                        </p>
                        <p className="mt-4 font-semibold">
                            Vous rêvez de vivre de votre passion ? Lancez-vous, formez-vous, et n'oubliez pas de vous entourer
                            des bons partenaires pour développer votre activité sereinement !
                        </p>
                    </section>

                </div>

                {/* CTA Section */}
                <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Éducateurs Canins : Générez un Revenu Complémentaire</h3>
                    <p className="text-muted-foreground mb-6">
                        En devenant <strong>apporteur d'affaires</strong> sur LeadsAssurance, vous monétisez vos recommandations
                        d'assurance chien/chat. Aucun engagement, commission jusqu'à 50% sur chaque lead qualifié vendu.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/register" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full rounded-full">
                                Devenir Apporteur (Gratuit)
                            </Button>
                        </Link>
                        <Link href="/blog" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full rounded-full">
                                Lire d'Autres Guides Pro
                            </Button>
                        </Link>
                    </div>
                </div>

                <RelatedArticles currentArticleId="devenir-educateur-canin-professionnel" />
            </article>
        </div>
    );
}
