"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    Filter,
    Search,
    Calendar,
    MapPin
} from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/constants/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Mock provider leads data
const MOCK_PROVIDER_LEADS = [
    {
        id: "prov-lead-1",
        productType: "CREDIT_IMMO",
        firstName: "Jean",
        lastName: "D.",
        zipCode: "75001",
        city: "Paris",
        status: "sold",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        soldAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        price: 45,
        revenue: 22.50,
    },
    {
        id: "prov-lead-2",
        productType: "ASSURANCE_EMPRUNTEUR",
        firstName: "Marie",
        lastName: "M.",
        zipCode: "69002",
        city: "Lyon",
        status: "accepted",
        submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        price: 55,
        revenue: null,
    },
    {
        id: "prov-lead-3",
        productType: "MUTUELLE_SANTE_IND",
        firstName: "Pierre",
        lastName: "D.",
        zipCode: "13008",
        city: "Marseille",
        status: "pending",
        submittedAt: new Date(Date.now() - 30 * 60 * 1000),
        price: 28,
        revenue: null,
    },
    {
        id: "prov-lead-4",
        productType: "RACHAT_CREDIT",
        firstName: "Sophie",
        lastName: "B.",
        zipCode: "33000",
        city: "Bordeaux",
        status: "rejected",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        rejectionReason: "Consentement non conforme - texte incomplet",
        price: 52,
        revenue: null,
    },
    {
        id: "prov-lead-5",
        productType: "DEFISCALISATION",
        firstName: "François",
        lastName: "P.",
        zipCode: "31000",
        city: "Toulouse",
        status: "sold",
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        soldAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        price: 85,
        revenue: 42.50,
    },
];

const statusConfig = {
    pending: { label: "En validation", color: "bg-yellow-500", icon: Clock },
    accepted: { label: "En stock", color: "bg-blue-500", icon: CheckCircle2 },
    sold: { label: "Vendu", color: "bg-green-500", icon: CheckCircle2 },
    rejected: { label: "Refusé", color: "bg-red-500", icon: XCircle },
};

export default function ProviderLeadsPage() {
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLead, setSelectedLead] = useState<typeof MOCK_PROVIDER_LEADS[0] | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    const filteredLeads = MOCK_PROVIDER_LEADS.filter(lead => {
        const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
        const matchesSearch = searchQuery === "" ||
            lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleViewDetails = (lead: typeof MOCK_PROVIDER_LEADS[0]) => {
        setSelectedLead(lead);
        setShowDetailDialog(true);
    };

    // Calculate stats
    const totalRevenue = MOCK_PROVIDER_LEADS.reduce((sum, l) => sum + (l.revenue || 0), 0);
    const soldCount = MOCK_PROVIDER_LEADS.filter(l => l.status === "sold").length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Leads Envoyés</h1>
                    <p className="text-muted-foreground">Suivez le statut de vos leads soumis.</p>
                </div>
                <div className="flex gap-4">
                    <Badge variant="outline" className="px-4 py-2 bg-green-500/10 text-green-500 border-green-500/20">
                        {soldCount} vendus • {totalRevenue.toFixed(2)}€ gagnés
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-10 rounded-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px] rounded-full">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En validation</SelectItem>
                        <SelectItem value="accepted">En stock</SelectItem>
                        <SelectItem value="sold">Vendu</SelectItem>
                        <SelectItem value="rejected">Refusé</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Leads List */}
            <div className="space-y-4">
                {filteredLeads.map((lead, idx) => {
                    const product = getProductById(lead.productType);
                    const status = statusConfig[lead.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;

                    return (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className={`border-border/50 bg-background/50 hover:bg-background transition-colors ${lead.status === "rejected" ? "border-red-500/30" : ""}`}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        {/* Lead Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                {product && <product.icon className="h-6 w-6" />}
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold">{product?.name}</h3>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${status.color}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {lead.zipCode} {lead.city}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> {lead.submittedAt.toLocaleDateString("fr-FR")}
                                                    </span>
                                                </div>

                                                {lead.status === "rejected" && lead.rejectionReason && (
                                                    <div className="mt-2 text-xs text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg inline-block">
                                                        Motif: {lead.rejectionReason}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price & Revenue */}
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-xs text-muted-foreground">Prix de vente</div>
                                                <div className="font-bold">{lead.price}€</div>
                                            </div>
                                            {lead.revenue !== null && (
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">Votre revenu</div>
                                                    <div className="font-bold text-green-500">+{lead.revenue.toFixed(2)}€</div>
                                                </div>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(lead)}
                                                className="rounded-full"
                                            >
                                                <Eye className="h-4 w-4 mr-1" /> Détails
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}

                {filteredLeads.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        Aucun lead ne correspond à vos critères.
                    </div>
                )}
            </div>

            {/* Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Détails du Lead</DialogTitle>
                        <DialogDescription>
                            Informations sur le lead soumis.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLead && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Produit</p>
                                    <p className="font-medium">{getProductById(selectedLead.productType)?.name}</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Localisation</p>
                                    <p className="font-medium">{selectedLead.zipCode} {selectedLead.city}</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Date d'envoi</p>
                                    <p className="font-medium">{selectedLead.submittedAt.toLocaleString("fr-FR")}</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Prix</p>
                                    <p className="font-medium">{selectedLead.price}€</p>
                                </div>
                            </div>

                            {selectedLead.status === "sold" && (
                                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                    <div className="flex items-center gap-2 text-green-500 font-semibold">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Lead vendu !
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Vendu le {selectedLead.soldAt?.toLocaleDateString("fr-FR")}
                                    </p>
                                    <p className="text-lg font-bold text-green-500 mt-2">
                                        +{selectedLead.revenue?.toFixed(2)}€ crédités
                                    </p>
                                </div>
                            )}

                            {selectedLead.status === "rejected" && (
                                <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                    <div className="flex items-center gap-2 text-red-500 font-semibold">
                                        <XCircle className="h-5 w-5" />
                                        Lead refusé
                                    </div>
                                    <p className="text-sm mt-2">{selectedLead.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
