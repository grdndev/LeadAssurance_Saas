import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ALL_ARTICLES = [
    {
        id: "importance-dressage-chien",
        title: "L'importance du dressage pour la sécurité de votre chien",
        category: "Formation Canine",
        readTime: "5 min",
    },
    {
        id: "methodes-dressage-chien",
        title: "Méthodes de Dressage Canin : Éducation Positive ou Traditionnelle ?",
        category: "Formation Canine",
        readTime: "7 min",
    },
    {
        id: "education-chiot-premiers-mois",
        title: "Éduquer un Chiot : Le Guide Complet des Premiers Mois",
        category: "Formation Canine",
        readTime: "10 min",
    },
    {
        id: "devenir-educateur-canin-professionnel",
        title: "Comment Devenir Éducateur Canin Professionnel en France",
        category: "Carrière & Formation",
        readTime: "12 min",
    },
    {
        id: "assurance-animaux-comment-choisir",
        title: "Assurance Chien & Chat : Comment Bien Choisir ?",
        category: "Assurance Animaux",
        readTime: "8 min",
    },
];

interface RelatedArticlesProps {
    currentArticleId: string;
}

export function RelatedArticles({ currentArticleId }: RelatedArticlesProps) {
    const otherArticles = ALL_ARTICLES.filter(a => a.id !== currentArticleId);
    // Show up to 3 related articles
    const related = otherArticles.slice(0, 3);

    return (
        <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Articles recommandés</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((article) => (
                    <Link key={article.id} href={`/blog/${article.id}`}>
                        <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                            <CardContent className="p-6 space-y-3">
                                <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                                <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">{article.readTime} de lecture</p>
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
