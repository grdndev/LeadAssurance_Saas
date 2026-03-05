"use client";

import { useState, useEffect } from "react";
import {
    Check,
    Pencil,
    PenLine,
    Plus,
    RefreshCw,
    Trash2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/blog");
            const data = await res.json();

            if (res.ok) {
                setArticles(data.articles);
            } else {
                throw new Error("Erreur serveur");
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateArticle = async () => {
        try {
            const res = await fetch("/api/admin/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })

            if (res.ok) {
                const json = await res.json();

                router.push(`/admin/blog/${json.article.id}`);
            } else {
                throw new Error("Erreur serveur");
            }
        } catch (error) {
            toast.error("Erreur lors de la création de l'article");
        }
    }

    const handleEditArticle = (id: string) => {
        router.push(`/admin/blog/${id}`);
    }

    const handlePublishArticle = async (id: string, published: boolean) => {
        try {
            const res = await fetch("/api/admin/blog", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, published})
            });
            if (res.ok) {
                toast.success(`Article ${published ? 'Publié' : 'Non publié'}`);
                setArticles(prev => prev.map(a => {
                    if (a.id === id) a.published = published
                    return a;
                }));
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    }

    const handleDeleteArticle = async (id: string) => {
        try {
            const res = await fetch("/api/admin/blog", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                toast.success("Article supprimé");
                setArticles(prev => prev.filter(a => a.id !== id));
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle>Articles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end px-3">
                        <Button
                            size="icon"
                            onClick={() => handleCreateArticle()}
                            >
                            <Plus />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {articles.map((a: any) => (
                            <div key={a.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg text-sm">
                                <div className="flex items-center gap-3">
                                    <PenLine className="h-4 w-4 text-primary shrink-0" />
                                    <div>
                                        <span className="text-muted-foreground ml-2">{a.author.firstname} {a.author.lastname} - </span>
                                        <span className="font-mono font-semibold text-xs">{a.title}</span>
                                        <div className="text-muted-foreground ml-2">{a.excerpt}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditArticle(a.id)}
                                            className="rounded-full"
                                        >
                                        <Pencil className="h-4 w-4 mr-1" /> Modifier
                                    </Button>
                                    <Button size="sm" variant={a.published ? "default" : "ghost"} onClick={() => handlePublishArticle(a.id, !a.published)}>
                                        {a.published ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDeleteArticle(a.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
