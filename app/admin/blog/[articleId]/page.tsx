"use client";

import {
    ArrowLeft,
    RefreshCw,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TextEditor from "@/components/editor/TextEditor";

export default function ArticlePage({ params }: { params: Promise<{ articleId: string } >}) {
    const { articleId } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<any>({ title: "", content: "", clean: "", published: false, image: null });
    const [imageData, setImageData] = useState<string | null>(null);

    const setImage = (image: string | null) => {
        if (image) {
            // ensure we have a data URI for preview
            const b64 = image.startsWith("data:") ? image : `data:image/*;base64,${image}`;
            setImageData(b64);
        }
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/blog?articleId=${articleId}`);

            if (res.ok) {
                const data = await res.json();
                if (data.article) {
                    const art = data.article;
                    if (art.image) setImage(art.image);
                    setArticle(art);
                }
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

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/admin/blog`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(article)
            });

            if (article.image) {
                setImage(article.image);
            }

            if (res.ok) {
                toast.success("Article mis à jour");
            } else {
                toast.error("Erreur lors de la mise à jour");
            }
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde");
        }
    }

    const handlePublish = async () => {
        try {
            const res = await fetch(`/api/admin/blog/publish`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: articleId })
            });

            if (res.ok) {
                toast.success(!article.published ? "Publié" : "Non publié");
                setArticle((p: any) => ({ ...p, published: !p.published }));
            } else {
                toast.error("Erreur lors du changement de statut");
            }
        } catch (error) {
            toast.error("Erreur lors du changement de statut");
        }
    }

    const handleDelete = async () => {
        if (!confirm("Supprimer cet article ?")) return;
        try {
            const res = await fetch(`/api/admin/blog`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: articleId })
            });

            if (res.ok) {
                toast.success("Article supprimé");
                router.push('/admin/blog');
            } else {
                toast.error("Erreur lors de la suppression");
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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="p-0" onClick={() => router.push('/admin/blog')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-lg font-semibold">{articleId === 'new' ? 'Nouvel article' : 'Édition d\'article'}</h2>
                </div>
                <div className="flex items-center gap-2">
                    {articleId !== 'new' && (
                        <Button size="sm" variant={article.published ? 'default' : 'ghost'} onClick={handlePublish}>
                            {article.published ? 'Publié' : 'Non publié'}
                        </Button>
                    )}
                    {articleId !== 'new' && (
                        <Button size="sm" variant="destructive" onClick={handleDelete}>Supprimer</Button>
                    )}
                    <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
                </div>
            </div>

            <Card className="border-border/50 bg-background/50">
                <CardContent>
                    <div className="space-y-3">
                        <Input value={article.title} onChange={(e: any) => setArticle((a: any) => ({ ...a, title: e.target.value }))} placeholder="Titre" />
                        {/* image upload */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 p-2">Image</label>
                            <label className="top-0 flex flex-col items-center justify-center w-48 h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition">
                                <div className="flex flex-col items-center">
                                    <svg
                                    className="w-10 h-10 mb-2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l-3 3m3-3l3 3m0-9a4 4 0 10-8 0v1H5a3 3 0 000 6h14a3 3 0 000-6h-1V4z" />
                                    </svg>

                                    <p className="text-sm text-gray-600">
                                    Clique ou glisse une image ici
                                    </p>
                                </div>

                                <input type="file" accept="image/*" className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            const result = reader.result as string;
                                            // strip data URI prefix for storage
                                            const base64 = result.split(",")[1];
                                            setImageData(result);
                                            setArticle((a: any) => ({ ...a, image: base64 }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                            {imageData && (
                                <div className="relative">
                                    <img src={imageData} className="mt-2 h-24 w-auto object-contain" alt="Preview" />
                                    <button
                                        className="absolute top-0 text-red-500 cursor-pointer"
                                        onClick={() => {
                                            setImageData(null)
                                            setArticle((a: any) => ({ ...a, image: null }));
                                        }}
                                    >
                                        <X />
                                    </button>
                                </div>
                            )}
                        </div>
                        <TextEditor content={article.content} onChange={(html, clean) => setArticle((a: any) => ({ ...a, content: html, clean }))} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
