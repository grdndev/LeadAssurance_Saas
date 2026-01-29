"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Eye,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    Filter,
    Search,
    ShieldCheck
} from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/constants/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Mock purchased leads data
const MOCK_MY_LEADS = [
    {
        id: "my-lead-1",
        productType: "CREDIT_IMMO",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
        phone: "0601020304",
        zipCode: "75001",
        city: "Paris",
        attributes: { projectType: "Résidence principale", amount: 350000, income: 4500 },
        isAppointment: false,
        price: 45,
        purchasedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        brokerStatus: "contacted",
        consent: {
            consentText: "J'accepte d'être contacté par un courtier partenaire pour mon projet de crédit immobilier.",
            ipAddress: "92.184.105.42",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            urlSource: "https://comparateur-credit.fr/credit-immobilier",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        }
    },
    {
        id: "my-lead-2",
        productType: "ASSURANCE_EMPRUNTEUR",
        firstName: "Marie",
        lastName: "Martin",
        email: "m.martin@email.com",
        phone: "0612345678",
        zipCode: "69002",
        city: "Lyon",
        attributes: { requestType: "Changement", loanAmount: 200000, age: 34, smoker: false },
        isAppointment: true,
        price: 55,
        purchasedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        brokerStatus: "new",
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        consent: {
            consentText: "J'accepte d'être recontacté pour un rendez-vous concernant mon assurance emprunteur.",
            ipAddress: "176.132.45.12",
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
            urlSource: "https://assurance-pret.fr/changement",
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        }
    },
    {
        id: "my-lead-3",
        productType: "RACHAT_CREDIT",
        firstName: "Sophie",
        lastName: "Bernard",
        email: "s.bernard@email.com",
        phone: "0687654321",
        zipCode: "33000",
        city: "Bordeaux",
        attributes: { owner: true, creditCount: 3, monthlyPayments: 1200, totalDebt: 75000, income: 3200 },
        isAppointment: false,
        price: 52,
        purchasedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        brokerStatus: "sold",
        consent: {
            consentText: "J'accepte d'être contacté concernant ma demande de rachat de crédits.",
            ipAddress: "109.23.67.145",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0",
            urlSource: "https://rachat-credit-online.fr",
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        }
    },
];

const statusConfig = {
    new: { label: "Nouveau", color: "bg-blue-500", icon: Clock },
    contacted: { label: "Contacté", color: "bg-yellow-500", icon: Phone },
    sold: { label: "Vendu", color: "bg-green-500", icon: CheckCircle2 },
    lost: { label: "Perdu", color: "bg-red-500", icon: XCircle },
};

export default function MyLeadsPage() {
    const [selectedLead, setSelectedLead] = useState<typeof MOCK_MY_LEADS[0] | null>(null);
    const [showConsentDialog, setShowConsentDialog] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLeads = MOCK_MY_LEADS.filter(lead => {
        const matchesStatus = filterStatus === "all" || lead.brokerStatus === filterStatus;
        const matchesSearch = searchQuery === "" ||
            lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleViewConsent = (lead: typeof MOCK_MY_LEADS[0]) => {
        setSelectedLead(lead);
        setShowConsentDialog(true);
    };

    const handleDownloadConsent = (lead: typeof MOCK_MY_LEADS[0]) => {
        // In real app, this would generate a PDF
        const consentData = `
CERTIFICAT DE PREUVE DE CONSENTEMENT
=====================================

Lead ID: ${lead.id}
Date de capture: ${lead.consent.timestamp.toLocaleString("fr-FR")}

PROSPECT
--------
Nom: ${lead.firstName} ${lead.lastName}
Email: ${lead.email}
Téléphone: ${lead.phone}
Localisation: ${lead.zipCode} ${lead.city}

TEXTE DE CONSENTEMENT
---------------------
"${lead.consent.consentText}"

EMPREINTE NUMÉRIQUE
-------------------
Adresse IP: ${lead.consent.ipAddress}
User Agent: ${lead.consent.userAgent}
URL Source: ${lead.consent.urlSource}
Horodatage: ${lead.consent.timestamp.toISOString()}

Ce document atteste du consentement explicite du prospect
conformément au RGPD et aux exigences de l'ACPR.
    `;

        const blob = new Blob([consentData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `preuve-consentement-${lead.id}.txt`;
        a.click();
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Leads</h1>
                    <p className="text-muted-foreground">Gérez vos leads achetés et suivez leur statut.</p>
                </div>
                <Badge variant="outline" className="px-4 py-2">
                    {MOCK_MY_LEADS.length} leads achetés
                </Badge>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par nom, ville..."
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
                        <SelectItem value="new">Nouveau</SelectItem>
                        <SelectItem value="contacted">Contacté</SelectItem>
                        <SelectItem value="sold">Vendu</SelectItem>
                        <SelectItem value="lost">Perdu</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Leads List */}
            <div className="space-y-4">
                {filteredLeads.map((lead, idx) => {
                    const product = getProductById(lead.productType);
                    const status = statusConfig[lead.brokerStatus as keyof typeof statusConfig];
                    const StatusIcon = status.icon;

                    return (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="border-border/50 bg-background/50 hover:bg-background transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        {/* Lead Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                {product && <product.icon className="h-6 w-6" />}
                                            </div>
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-lg">{lead.firstName} {lead.lastName}</h3>
                                                    {lead.isAppointment && (
                                                        <Badge variant="secondary" className="text-xs">RDV</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{product?.name}</p>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" /> {lead.phone}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {lead.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {lead.zipCode} {lead.city}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end xl:flex-row xl:items-center">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {status.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {lead.purchasedAt.toLocaleDateString("fr-FR")}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewConsent(lead)}
                                                    className="rounded-full"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" /> Consentement
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownloadConsent(lead)}
                                                    className="rounded-full"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lead Attributes */}
                                    <div className="mt-4 pt-4 border-t border-border/50">
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(lead.attributes).map(([key, value]) => (
                                                <span key={key} className="text-xs bg-secondary px-2 py-1 rounded">
                                                    {typeof value === "boolean" ? (value ? "✓ " : "✗ ") : ""}{key}: {String(value)}
                                                </span>
                                            ))}
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

            {/* Consent Proof Dialog */}
            <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                            Preuve de Consentement RGPD
                        </DialogTitle>
                        <DialogDescription>
                            Certificat d'authenticité du consentement pour ce lead.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLead && (
                        <div className="space-y-4 text-sm">
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                <p className="font-medium text-green-700 dark:text-green-400 mb-2">Texte de consentement accepté :</p>
                                <p className="italic">"{selectedLead.consent.consentText}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Date & Heure</p>
                                    <p className="font-mono text-xs">{selectedLead.consent.timestamp.toLocaleString("fr-FR")}</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Adresse IP</p>
                                    <p className="font-mono text-xs">{selectedLead.consent.ipAddress}</p>
                                </div>
                            </div>

                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">URL Source</p>
                                <p className="font-mono text-xs break-all">{selectedLead.consent.urlSource}</p>
                            </div>

                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">User Agent</p>
                                <p className="font-mono text-xs break-all">{selectedLead.consent.userAgent}</p>
                            </div>

                            <Button
                                className="w-full rounded-full"
                                onClick={() => handleDownloadConsent(selectedLead)}
                            >
                                <Download className="h-4 w-4 mr-2" /> Télécharger le certificat PDF
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
