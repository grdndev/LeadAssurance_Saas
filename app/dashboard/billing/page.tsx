"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    CreditCard,
    Plus,
    Download,
    Receipt,
    TrendingUp,
    Wallet,
    CheckCircle2,
    Clock,
    Euro,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Credit Packs Configuration
const CREDIT_PACKS = [
    { id: 1, amount: 100, bonus: 0, price: 100, popular: false },
    { id: 2, amount: 250, bonus: 25, price: 250, popular: false },
    { id: 3, amount: 500, bonus: 75, price: 500, popular: true },
    { id: 4, amount: 1000, bonus: 200, price: 1000, popular: false },
];

export default function BillingPage() {
    const searchParams = useSearchParams();
    const [showRechargeDialog, setShowRechargeDialog] = useState(false);
    const [selectedPack, setSelectedPack] = useState<typeof CREDIT_PACKS[0] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            setUserProfile(data);
        } catch (err) {
            console.error("Fetch profile error:", err);
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const [statsRes, historyRes] = await Promise.all([
                fetch("/api/billing/stats"),
                fetch("/api/billing/history")
            ]);
            
            const statsData = await statsRes.json();
            const historyData = await historyRes.json();
            
            setStats(statsData);
            setTransactions(historyData.transactions || []);
        } catch (err) {
            console.error("Fetch data error:", err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchData();

        // Handle success/cancel from Stripe
        const status = searchParams.get("status");
        if (status === "success") {
            toast.success("Paiement réussi ! Vos crédits ont été ajoutés.");
            // Refresh data after successful payment
            setTimeout(() => {
                fetchProfile();
                fetchData();
            }, 1000);
        } else if (status === "cancel") {
            toast.error("Paiement annulé.");
        }
    }, [searchParams]);

    const handleSelectPack = (pack: typeof CREDIT_PACKS[0]) => {
        setSelectedPack(pack);
        setShowRechargeDialog(true);
    };

    const handleConfirmRecharge = async () => {
        if (!selectedPack) return;

        setIsLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: selectedPack.price,
                    bonus: selectedPack.bonus,
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Erreur lors de la redirection");
            }
        } catch (err) {
            toast.error("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Crédits & Factures</h1>
                <p className="text-muted-foreground">Gérez votre solde et consultez vos factures.</p>
            </div>

            {/* Balance Card */}
            <div className="grid gap-6 md:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Wallet className="h-4 w-4" /> Solde disponible
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingProfile ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                                <div className="text-4xl font-bold text-primary">{userProfile?.credits?.toFixed(2) || "0.00"} €</div>
                            )}
                            <Button
                                className="mt-4 w-full rounded-full shadow-lg shadow-primary/20"
                                onClick={() => setShowRechargeDialog(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Recharger
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-border/50 bg-background/50 h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Usage ce mois
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingData ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                                <>
                                    <div className="text-4xl font-bold">{stats?.monthlyUsage?.toFixed(2) || "0.00"} €</div>
                                    <p className="text-xs text-muted-foreground mt-2">Dépenses ce mois-ci</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-border/50 bg-background/50 h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Receipt className="h-4 w-4" /> Budget total
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingData ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                                <>
                                    <div className="text-4xl font-bold">{stats?.totalBudget?.toFixed(2) || "0.00"} €</div>
                                    <p className="text-xs text-muted-foreground mt-2">Dépenses depuis l'inscription</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Credit Packs */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle>Recharger mes crédits</CardTitle>
                    <CardDescription>Choisissez un pack et payez par carte bancaire sécurisée via Stripe.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {CREDIT_PACKS.map((pack) => (
                            <motion.div
                                key={pack.id}
                                whileHover={{ scale: 1.02 }}
                                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${pack.popular
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50 hover:border-primary/50"
                                    }`}
                                onClick={() => handleSelectPack(pack)}
                            >
                                {pack.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground">Meilleur choix</Badge>
                                    </div>
                                )}
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{pack.amount} €</div>
                                    {pack.bonus > 0 && (
                                        <div className="text-sm text-green-500 font-semibold mt-1">
                                            +{pack.bonus}€ offerts
                                        </div>
                                    )}
                                    <div className="text-xs text-muted-foreground mt-2">
                                        = {pack.amount + pack.bonus}€ de crédits
                                    </div>
                                    <Button
                                        variant={pack.popular ? "default" : "outline"}
                                        className="mt-4 w-full rounded-full"
                                    >
                                        Sélectionner
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Transaction History */}
                <Card className="border-border/50 bg-background/50 h-full">
                    <CardHeader>
                        <CardTitle>Historique</CardTitle>
                        <CardDescription>Flux de crédit récent</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingData ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground italic">
                                Les transactions s'afficheront ici après vos premiers achats.
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {transactions.slice(0, 20).map((transaction) => {
                                    const isCreditPurchase = transaction.type === "CREDIT_PURCHASE";
                                    const isLeadSale = transaction.type === "LEAD_SALE";
                                    const isLeadPurchase = transaction.type === "LEAD_PURCHASE";
                                    
                                    return (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-secondary/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {isCreditPurchase && (
                                                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                        <Plus className="h-5 w-5 text-green-500" />
                                                    </div>
                                                )}
                                                {isLeadPurchase && (
                                                    <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                                        <Euro className="h-5 w-5 text-orange-500" />
                                                    </div>
                                                )}
                                                {isLeadSale && (
                                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                        <TrendingUp className="h-5 w-5 text-blue-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">
                                                        {isCreditPurchase && "Recharge de crédits"}
                                                        {isLeadPurchase && "Achat de lead"}
                                                        {isLeadSale && "Vente de lead"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`text-lg font-bold ${
                                                isCreditPurchase || isLeadSale ? "text-green-500" : "text-orange-500"
                                            }`}>
                                                {isCreditPurchase || isLeadSale ? "+" : "-"}
                                                {(transaction.credits || transaction.amount).toFixed(2)} €
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Invoices */}
                <Card className="border-border/50 bg-background/50 h-full">
                    <CardHeader>
                        <CardTitle>Mes factures</CardTitle>
                        <CardDescription>Téléchargez vos reçus fiscaux</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingData ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : transactions.filter(t => t.type === "CREDIT_PURCHASE").length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground italic">
                                Aucune facture générée pour le moment.
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {transactions
                                    .filter(t => t.type === "CREDIT_PURCHASE")
                                    .slice(0, 10)
                                    .map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-secondary/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Receipt className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        Facture #{transaction.id.slice(0, 8)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric"
                                                        })}
                                                    </div>
                                                    <div className="text-xs font-semibold text-foreground mt-1">
                                                        {transaction.credits?.toFixed(2)} € HT
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-full"
                                                onClick={() => window.open(`/api/billing/invoice/${transaction.id}`, "_blank")}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                PDF
                                            </Button>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recharge Dialog */}
            <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Confirmer la recharge</DialogTitle>
                        <DialogDescription>
                            Vous allez être redirigé vers Stripe pour finaliser le paiement.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPack && (
                        <div className="py-6 space-y-4">
                            <div className="p-6 bg-secondary/30 rounded-2xl text-center border border-border/50">
                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-2">Pack Sélectionné</div>
                                <div className="text-5xl font-bold text-primary">{selectedPack.amount} €</div>
                                {selectedPack.bonus > 0 && (
                                    <div className="text-green-500 font-semibold mt-2 text-lg">+{selectedPack.bonus}€ de bonus offert</div>
                                )}
                                <div className="text-muted-foreground mt-4 pt-4 border-t border-border/50">
                                    Votre nouveau solde sera de : <br />
                                    <span className="font-bold text-xl text-foreground">{(userProfile?.credits || 0) + selectedPack.amount + selectedPack.bonus}€</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-secondary/20 p-3 rounded-xl border border-border/10">
                                <CreditCard className="h-4 w-4 shrink-0" />
                                <span>Paiement 100% sécurisé via Stripe. Facture disponible immédiatement après confirmation.</span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setShowRechargeDialog(false)} className="rounded-full">Annuler</Button>
                        <Button onClick={handleConfirmRecharge} disabled={isLoading} className="rounded-full px-8">
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Payer {selectedPack?.price}€
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

