"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    RefreshCw,
    ScrollText,
    ChevronRight,
    Edit,
    Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersRes = await fetch("/api/admin/users");
            const usersData = await usersRes.json();

            setUsers(usersData.users || []);
        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (userId: string) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            });
            if (res.ok) {
                toast.success("Utilisateur supprimé");
                setUsers(prev => prev.filter(u => u.id !== userId));
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleEditUser = (userId: string) => {
        // navigate to an edit page – implement the route as needed
        router.push(`/admin/users/${userId}`);
    };

    if (loading && !users) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Backoffice</h1>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="overflow-x-auto pb-2 scrollbar-hide">
                    <TabsList className="inline-flex w-auto min-w-full sm:w-full sm:max-w-3xl sm:grid sm:grid-cols-4">
                        <TabsTrigger value="users" className="whitespace-nowrap px-6 sm:px-0">Utilisateurs</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="users" className="space-y-6">
                    <Card className="border-border/50 bg-background/50">
                        <CardHeader>
                            <CardTitle>Utilisateurs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {users.map((u: any) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg text-sm">
                                        <div className="flex items-center gap-3">
                                            <Users className="h-4 w-4 text-primary shrink-0" />
                                            <div>
                                                <span className="font-mono font-semibold text-xs">{u.name}</span>
                                                <span className="text-muted-foreground ml-2">{u.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleString("fr-FR")}</span>
                                            <Button size="icon" variant="ghost" onClick={() => handleEditUser(u.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="destructive" onClick={() => handleDeleteUser(u.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
