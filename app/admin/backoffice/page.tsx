"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Calendar,
    CheckCircle2,
    Clock,
    Edit,
    Loader2,
    MapPin,
    Pencil,
    RefreshCw,
    Save,
    ScrollText,
    Trash2,
    Users,
    XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getProductById } from "@/lib/constants/products";
import { Label } from "@/components/ui/label";

const statusConfig = {
    STOCK: { label: "En stock", color: "bg-blue-500", icon: CheckCircle2 },
    SOLD: { label: "Vendu", color: "bg-green-500", icon: CheckCircle2 },
    REJECTED: { label: "Refusé", color: "bg-red-500", icon: XCircle },
    PENDING: { label: "En validation", color: "bg-yellow-500", icon: Clock },
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersRes = await fetch("/api/admin/users");
            const usersData = await usersRes.json();

            setUsers(usersData.users || []);

            const leadsRes = await fetch("/api/admin/leads?all=true");
            const leadsData = await leadsRes.json();

            setLeads(leadsData.leads || []);
        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditUser = (userId: string) => {
        // navigate to an edit page – implement the route as needed
        router.push(`/admin/users/${userId}`);
    };

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

    const handleEditLead = (lead: any) => {
        setSelectedLead(lead);
        setEditForm({
            firstname: lead.firstname,
            lastname: lead.lastname,
            phone: lead.phone,
            email: lead.email,
            zipCode: lead.zipCode,
            city: lead.city,
            price: lead.price,
        });
        setShowEditDialog(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedLead) return;
        setEditSaving(true);
        try {
            const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                const data = await res.json();
                setShowEditDialog(false);
                setLeads(leads.map(l => l.id == selectedLead.id ? data.lead : l) || []);
            }
        } catch (err) {
            console.error("Edit error:", err);
        } finally {
            setEditSaving(false);
        }
    };

    const handleDeleteLead = async (leadId: string) => {
        try {
            const res = await fetch("/api/admin/leads", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId })
            });
            if (res.ok) {
                toast.success("Lead supprimé");
                setLeads(prev => prev.filter(u => u.id !== leadId));
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    if (loading) {
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
                        <TabsTrigger value="leads" className="whitespace-nowrap px-6 sm:px-0">Leads</TabsTrigger>
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
                                            <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditUser(u.id)}
                                                    className="rounded-full"
                                                >
                                                <Pencil className="h-4 w-4 mr-1" /> Modifier
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

                <TabsContent value="leads" className="space-y-6">
                    <Card className="border-border/50 bg-background/50">
                        <CardHeader>
                            <CardTitle>Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {leads.map((l: any) => {
                                    const product = getProductById(l.productType);
                                    const status = (statusConfig as any)[l.status] || statusConfig.PENDING;
                                    const StatusIcon = status.icon;

                                    return (<div key={l.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg text-sm">
                                        <div className="flex items-center">
                                            <ScrollText className="h-4 w-4 text-primary shrink-0" />
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="font-mono font-semibold text-xs px-2">{product?.name ?? l.productType}</span>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${status.color}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {status.label}
                                                    </span>
                                                    <span className="flex flex-col text-muted-foreground ml-2">
                                                        <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{l.zipCode} {l.city}</span></div>
                                                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{new Date(l.createdAt).toLocaleDateString("fr-FR")}</span></div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <div className="text-xs text-muted-foreground">Prix de vente</div>
                                                <div className="font-bold">{l.price.toFixed(2)}€</div>
                                            </div>
                                            {(l.status === "PENDING" || l.status === "STOCK") && (
                                                <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditLead(l)}
                                                        className="rounded-full"
                                                    >
                                                    <Pencil className="h-4 w-4 mr-1" /> Modifier
                                                </Button>
                                            )}
                                            <Button size="icon" variant="destructive" onClick={() => handleDeleteLead(l.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Modifier le Lead</DialogTitle>
                        <DialogDescription>
                            Mettez à jour les informations du prospect (uniquement les leads en attente).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Prénom</Label>
                                <Input
                                    value={editForm.firstname || ""}
                                    onChange={(e) => setEditForm({ ...editForm, firstname: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nom</Label>
                                <Input
                                    value={editForm.lastname || ""}
                                    onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input
                                value={editForm.phone || ""}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="rounded-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={editForm.email || ""}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="rounded-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Prix de vente (€)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={editForm.price || ""}
                                onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                                className="rounded-full"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Code postal</Label>
                                <Input
                                    value={editForm.zipCode || ""}
                                    onChange={(e) => setEditForm({ ...editForm, zipCode: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ville</Label>
                                <Input
                                    value={editForm.city || ""}
                                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="rounded-full">
                                Annuler
                            </Button>
                            <Button onClick={handleSaveEdit} disabled={editSaving} className="rounded-full">
                                {editSaving ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sauvegarde...</>
                                ) : (
                                    <><Save className="h-4 w-4 mr-2" /> Enregistrer</>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
