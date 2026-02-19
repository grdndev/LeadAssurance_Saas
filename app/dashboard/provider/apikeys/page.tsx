"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Key,
    Plus,
    Trash2,
    Copy,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    Clock,
    Code2,
    Eye,
    EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProviderApiKeysPage() {
    const [keys, setKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [creating, setCreating] = useState(false);
    const [newKeyResult, setNewKeyResult] = useState<{ key: string; prefix: string; name: string } | null>(null);
    const [showRawKey, setShowRawKey] = useState(false);
    const [revokeId, setRevokeId] = useState<string | null>(null);
    const [revoking, setRevoking] = useState(false);

    const fetchKeys = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/provider/apikeys");
            const data = await res.json();
            setKeys(data.keys || []);
        } catch {
            toast.error("Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchKeys(); }, []);

    const handleCreate = async () => {
        if (!newKeyName.trim()) return;
        setCreating(true);
        try {
            const res = await fetch("/api/user/provider/apikeys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newKeyName.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setNewKeyResult(data);
            setShowCreateDialog(false);
            setNewKeyName("");
            fetchKeys();
        } catch (e: any) {
            toast.error(e.message || "Erreur lors de la création");
        } finally {
            setCreating(false);
        }
    };

    const handleRevoke = async () => {
        if (!revokeId) return;
        setRevoking(true);
        try {
            const res = await fetch("/api/user/provider/apikeys", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: revokeId }),
            });
            if (!res.ok) throw new Error();
            toast.success("Clé révoquée");
            setRevokeId(null);
            fetchKeys();
        } catch {
            toast.error("Erreur lors de la révocation");
        } finally {
            setRevoking(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papier");
    };

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clés API</h1>
                    <p className="text-muted-foreground mt-1">
                        Intégrez LeadsAssurance directement depuis votre CRM ou site web.
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)} className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" /> Nouvelle clé
                </Button>
            </div>

            {/* API Endpoint Info */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Code2 className="h-4 w-4 text-primary" /> Endpoint public
                    </CardTitle>
                    <CardDescription>
                        Soumettez des leads depuis n&apos;importe quelle source externe via votre clé API.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl font-mono text-xs">
                        <span className="text-primary font-bold">POST</span>
                        <span className="text-muted-foreground">{process.env.NEXT_PUBLIC_APP_URL || "https://votre-domaine.com"}/api/v1/leads</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-auto shrink-0"
                            onClick={() => copyToClipboard("/api/v1/leads")}
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="p-3 bg-secondary rounded-xl">
                        <p className="text-xs text-muted-foreground mb-2 font-semibold">Header requis :</p>
                        <code className="text-xs font-mono">Authorization: Bearer la_xxxxxxxxxxxxxxxx...</code>
                    </div>
                    <div className="p-3 bg-secondary rounded-xl">
                        <p className="text-xs text-muted-foreground mb-2 font-semibold">Corps JSON requis :</p>
                        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{`{
  "productType": "ASSURANCE_AUTO",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "phone": "0612345678",
  "zipCode": "75001",
  "city": "Paris",
  "consentText": "J'accepte d'être recontacté.",
  "urlSource": "https://mon-site.com/formulaire",
  "attributes": { "vehicleType": "Berline" },
  "price": 30.00
}`}</pre>
                    </div>
                </CardContent>
            </Card>

            {/* Keys List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : keys.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Key className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>Aucune clé API. Créez-en une pour commencer l&apos;intégration.</p>
                    </div>
                ) : (
                    keys.map((k, i) => (
                        <motion.div
                            key={k.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className={`border-border/50 bg-background/50 ${!k.active ? "opacity-50" : ""}`}>
                                <CardContent className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Key className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">{k.name}</p>
                                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                                <code className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                                                    {k.prefix}••••••••••••••••••••
                                                </code>
                                                {k.active ? (
                                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">Active</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] text-muted-foreground">Révoquée</Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Créée le {new Date(k.createdAt).toLocaleDateString("fr-FR")}
                                                </span>
                                                {k.lastUsedAt && (
                                                    <span>Dernière utilisation : {new Date(k.lastUsedAt).toLocaleDateString("fr-FR")}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {k.active && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive border-destructive/20 hover:bg-destructive/10 rounded-full shrink-0"
                                            onClick={() => setRevokeId(k.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" /> Révoquer
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Create Key Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={(o) => { setShowCreateDialog(o); if (!o) setNewKeyName(""); }}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Créer une clé API</DialogTitle>
                        <DialogDescription>
                            Donnez un nom descriptif à cette clé (ex: &quot;CRM HubSpot&quot;, &quot;Site WordPress&quot;).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>Nom de la clé</Label>
                        <Input
                            placeholder="Ex: Site web principal"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="rounded-full"
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setShowCreateDialog(false)} className="rounded-full">Annuler</Button>
                        <Button onClick={handleCreate} disabled={creating || !newKeyName.trim()} className="rounded-full">
                            {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                            Créer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New Key Display Dialog — shown ONCE */}
            <Dialog open={!!newKeyResult} onOpenChange={(o) => { if (!o) { setNewKeyResult(null); setShowRawKey(false); } }}>
                <DialogContent className="sm:max-w-lg rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-5 w-5" /> Clé créée avec succès
                        </DialogTitle>
                        <DialogDescription>
                            Copiez cette clé maintenant. Elle ne sera <strong>plus jamais affichée</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-400">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            Stockez cette clé dans un endroit sûr. Vous ne pourrez plus la consulter après fermeture.
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 p-3 bg-secondary rounded-xl font-mono text-xs break-all">
                                {showRawKey ? newKeyResult?.key : newKeyResult?.key.slice(0, 15) + "•".repeat(30)}
                            </code>
                            <Button variant="ghost" size="icon" onClick={() => setShowRawKey(v => !v)}>
                                {showRawKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => newKeyResult && copyToClipboard(newKeyResult.key)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Clé : <strong>{newKeyResult?.name}</strong></p>
                    </div>
                    <DialogFooter>
                        <Button className="rounded-full w-full" onClick={() => { setNewKeyResult(null); setShowRawKey(false); }}>
                            J&apos;ai copié ma clé, fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Confirm Dialog */}
            <Dialog open={!!revokeId} onOpenChange={(o) => { if (!o) setRevokeId(null); }}>
                <DialogContent className="sm:max-w-sm rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Révoquer cette clé ?</DialogTitle>
                        <DialogDescription>
                            Toute intégration utilisant cette clé cessera de fonctionner immédiatement. Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setRevokeId(null)} className="rounded-full">Annuler</Button>
                        <Button variant="destructive" onClick={handleRevoke} disabled={revoking} className="rounded-full">
                            {revoking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Révoquer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
