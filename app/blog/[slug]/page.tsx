"use client";

import "@/components/editor/style.css";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ArticlePage({ params }: { params: Promise<{ slug: string } >}) {
    const { slug } = use(params);
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
    }, [])

    const filtered = articles.filter((a: any) => a.slug === slug);
    const article = filtered.length > 0 ? filtered[0] : false;

    if (!article) {
        <div>

        </div>
    }

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
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                            {article.title}
                        </h1>
                        {article.image && (
                            <div className="mt-6">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{article.publishedAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{Math.floor(article.duration / 60)} min de lecture</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl sm:prose-h2:text-3xl prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} className="text-preview" />
                </div>

                {/* CTA Section */}
                <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/blog" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full rounded-full">
                                Lire d'Autres Articles
                            </Button>
                        </Link>
                    </div>
                </div>

                <RelatedArticles articles={articles} currentArticleSlug={article.slug} />
            </article>
        </div>
    );
}
