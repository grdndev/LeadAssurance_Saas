"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, User, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BlogPage() {
    const [articles, setArticles] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/blog");

            if (res.ok) {
                const json = await res.json();
                const articles = json.articles;
                for(let art of articles) {
                    if (art.image) {
                        art.image = art.image.startsWith("data:") ? art.image : `data:image/*;base64,${art.image}`;
                    }
                }

                setArticles(articles);
            } else {
                throw new Error("Erreur serveur");
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

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
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {articles.map((article, idx) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                        >
                            <Link href={`/blog/${article.slug}`}>
                                <Card className="h-full border-border/50 bg-background overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                                    {/* Image */}
                                    <div className="aspect-video relative overflow-hidden bg-secondary">
                                        {article.image &&
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                        />}
                                    </div>

                                    {/* Content */}
                                    <CardHeader className="pb-4">
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {Math.ceil(article.duration / 60)} minutes
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" /> {article.author.firstname ?? ""} {article.author.lastname ?? ""}
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
                                            Publié le {article.publishedAt}
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
