"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface RelatedArticlesProps {
    articles: any[];
    currentArticleSlug: string;
}

export function RelatedArticles({ articles, currentArticleSlug }: RelatedArticlesProps) {
    const otherArticles = articles.filter(a => a.slug !== currentArticleSlug);
    const related = otherArticles.slice(0, 3);

    return (
        <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Articles recommandés</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((article) => (
                    <Link key={article.id} href={`/blog/${article.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                            <CardContent className="p-6 space-y-3">
                                <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">{Math.ceil(article.duration / 60) + 1} min de lecture</p>
                                <span className="inline-flex items-center text-xs font-medium text-primary">
                                    Lire l&apos;article <ArrowRight className="h-3 w-3 ml-1" />
                                </span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            <div className="text-center mt-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                    Voir tous les articles <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
            </div>
        </section>
    );
}
