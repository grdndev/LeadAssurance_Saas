"use client";

import { useState } from "react";
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
    Euro
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

// Mock billing data
const CREDIT_PACKS = [
    { id: 1, amount: 100, bonus: 0, price: 100, popular: false },
    { id: 2, amount: 250, bonus: 25, price: 250, popular: false },
    { id: 3, amount: 500, bonus: 75, price: 500, popular: true },
    { id: 4, amount: 1000, bonus: 200, price: 1000, popular: false },
];

const MOCK_TRANSACTIONS = [
    { id: "tx-1", type: "credit", amount: 500, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "completed", description: "Recharge crédit - Pack 500€" },
    { id: "tx-2", type: "debit", amount: -45, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "completed", description: "Achat Lead - Crédit Immobilier - Paris" },
    { id: "tx-3", type: "debit", amount: -55, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: "completed", description: "Achat RDV - Assurance Emprunteur - Lyon" },
    { id: "tx-4", type: "debit", amount: -52, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: "completed", description: "Achat Lead - Rachat Crédits - Bordeaux" },
];

const MOCK_INVOICES = [
    { id: "INV-2024-001", date: new Date(2024, 0, 15), amount: 500, status: "paid" },
    { id: "INV-2024-002", date: new Date(2024, 1, 10), amount: 250, status: "paid" },
    { id: "INV-2024-003", date: new Date(2024, 2, 5), amount: 500, status: "paid" },
];

export default function BillingPage() {
    const [showRechargeDialog, setShowRechargeDialog] = useState(false);
    const [selectedPack, setSelectedPack] = useState<typeof CREDIT_PACKS[0] | null>(null);
    const currentBalance = 450;

    const handleSelectPack = (pack: typeof CREDIT_PACKS[0]) => {
        setSelectedPack(pack);
        setShowRechargeDialog(true);
    };

    const handleConfirmRecharge = () => {
        alert(`Redirection vers Stripe pour le paiement de ${selectedPack?.price}€...`);
        setShowRechargeDialog(false);
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
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Wallet className="h-4 w-4" /> Solde disponible
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-primary">{currentBalance.toFixed(2)} €</div>
                            <Button
                                className="mt-4 w-full rounded-full"
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
                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Dépensé ce mois
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">152.00 €</div>
                            <p className="text-xs text-muted-foreground mt-2">3 leads achetés</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-border/50 bg-background/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Receipt className="h-4 w-4" /> Total facturé
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">1,250.00 €</div>
                            <p className="text-xs text-muted-foreground mt-2">Depuis le début</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Credit Packs */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle>Recharger mes crédits</CardTitle>
                    <CardDescription>Choisissez un pack et payez par carte bancaire sécurisée.</CardDescription>
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
                                        <Badge className="bg-primary text-primary-foreground">Populaire</Badge>
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

            {/* Transaction History */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle>Historique des transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {MOCK_TRANSACTIONS.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                                        }`}>
                                        {tx.type === "credit" ? <Plus className="h-5 w-5" /> : <Euro className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <div className="font-medium">{tx.description}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {tx.date.toLocaleDateString("fr-FR")} • {tx.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.amount > 0 ? "text-green-500" : ""}`}>
                                    {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)} €
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Invoices */}
            <Card className="border-border/50 bg-background/50">
                <CardHeader>
                    <CardTitle>Mes factures</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {MOCK_INVOICES.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                        <Receipt className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{invoice.id}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {invoice.date.toLocaleDateString("fr-FR")}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-bold">{invoice.amount.toFixed(2)} €</div>
                                        <Badge variant="outline" className="text-green-500 border-green-500/30">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Payée
                                        </Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recharge Dialog */}
            <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmer la recharge</DialogTitle>
                        <DialogDescription>
                            Vous allez être redirigé vers Stripe pour finaliser le paiement.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPack && (
                        <div className="py-6 space-y-4">
                            <div className="p-6 bg-secondary/30 rounded-2xl text-center">
                                <div className="text-4xl font-bold">{selectedPack.amount} €</div>
                                {selectedPack.bonus > 0 && (
                                    <div className="text-green-500 font-semibold mt-1">+{selectedPack.bonus}€ offerts</div>
                                )}
                                <div className="text-muted-foreground mt-2">
                                    Solde après recharge: <span className="font-bold text-foreground">{currentBalance + selectedPack.amount + selectedPack.bonus}€</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                                <CreditCard className="h-4 w-4" />
                                <span>Paiement sécurisé par Stripe. Aucune donnée bancaire n'est stockée.</span>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRechargeDialog(false)}>Annuler</Button>
                        <Button onClick={handleConfirmRecharge}>
                            <CreditCard className="h-4 w-4 mr-2" /> Payer {selectedPack?.price}€
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
