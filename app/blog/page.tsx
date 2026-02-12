"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, User, ArrowRight } from "lucide-react";

const ARTICLES = [
    {
        id: "importance-dressage-chien",
        title: "L'importance du dressage pour la sécurité de votre chien",
        excerpt: "Découvrez pourquoi une formation canine adéquate est essentielle non seulement pour l'obéissance, mais aussi pour la prévention des accidents.",
        date: "05 Février 2024",
        author: "Expert Canin",
        category: "Formation Canine",
        readTime: "5 min",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "methodes-dressage-chien",
        title: "Méthodes de Dressage Canin : Éducation Positive ou Traditionnelle ?",
        excerpt: "Comparatif détaillé des principales approches d'éducation canine. Trouvez la méthode adaptée à votre chien et ses besoins spécifiques.",
        date: "09 Février 2024",
        author: "Comportementaliste",
        category: "Formation Canine",
        readTime: "7 min",
        image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "education-chiot-premiers-mois",
        title: "Éduquer un Chiot : Le Guide Complet des Premiers Mois",
        excerpt: "Socialisation, propreté, ordres de base : tout ce qu'il faut savoir pour éduquer votre chiot de 2 à 6 mois avec bienveillance et efficacité.",
        date: "09 Février 2024",
        author: "Éducateur Canin Certifié",
        category: "Formation Canine",
        readTime: "10 min",
        image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "devenir-educateur-canin-professionnel",
        title: "Comment Devenir Éducateur Canin Professionnel en France",
        excerpt: "Diplômes, formations, démarches administratives et business model pour transformer votre passion en métier reconnu. Guide complet 2024.",
        date: "09 Février 2024",
        author: "Consultant Formation Pro",
        category: "Carrière & Formation",
        readTime: "12 min",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "assurance-animaux-comment-choisir",
        title: "Assurance Chien & Chat : Comment Bien Choisir ?",
        excerpt: "Couvertures, tarifs, exclusions : tout savoir pour choisir la meilleure assurance santé pour votre animal de compagnie.",
        date: "10 Février 2024",
        author: "Conseiller Assurances",
        category: "Assurance Animaux",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2069&auto=format&fit=crop"
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-secondary/10">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/5 to-transparent border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge variant="secondary" className="mb-4">Blog & Ressources</Badge>
                            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
                                Conseils & Expertise
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                Découvrez nos guides sur l'éducation canine, l'assurance animaux et les meilleures pratiques
                                pour le bien-être de vos compagnons.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {ARTICLES.map((article, idx) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                        >
                            <Link href={`/blog/${article.id}`}>
                                <Card className="h-full border-border/50 bg-background overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                                    {/* Image */}
                                    <div className="aspect-video relative overflow-hidden bg-secondary">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-none shadow-lg">
                                            {article.category}
                                        </Badge>
                                    </div>

                                    {/* Content */}
                                    <CardHeader className="pb-4">
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {article.readTime}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" /> {article.author}
                                            </span>
                                        </div>
                                        <CardTitle className="leading-tight text-xl group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                            Lire l'article <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
                                            Publié le {article.date}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 sm:mt-24 p-8 sm:p-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl border border-primary/20"
                >
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                            Prêt à Protéger Votre Compagnon ?
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Découvrez nos solutions d'assurance pour chiens et chats adaptées à tous les budgets.
                            Comparez gratuitement les offres du marché.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/dashboard/marketplace">
                                <Button size="lg" className="w-full sm:w-auto rounded-full px-8">
                                    Comparer les Assurances
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8">
                                    Retour à l'Accueil
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
