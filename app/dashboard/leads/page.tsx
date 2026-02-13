"use client";

import { useState, useEffect } from "react";
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
    ShieldCheck,
    Loader2
} from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/constants/products";
import { Card, CardContent } from "@/components/ui/card";
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
import dynamic from "next/dynamic";

// Dynamic import of PDF components to avoid SSR issues
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);
const ConsentPDF = dynamic(
    () => import("@/components/leads/ConsentPDF").then((mod) => mod.ConsentPDF),
    { ssr: false }
);

const statusConfig = {
    SOLD: { label: "Nouveau", color: "bg-blue-500", icon: Clock },
    CONTACTED: { label: "Contacté", color: "bg-yellow-500", icon: Phone },
    CONVERTED: { label: "Vendu", color: "bg-green-500", icon: CheckCircle2 },
    LOST: { label: "Perdu", color: "bg-red-500", icon: XCircle },
};

export default function MyLeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [showConsentDialog, setShowConsentDialog] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/leads");
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const filteredLeads = leads.filter(lead => {
        const matchesStatus = filterStatus === "all" || lead.brokerStatus === filterStatus;
        const matchesSearch = searchQuery === "" ||
            lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleViewConsent = (lead: any) => {
        setSelectedLead(lead);
        setShowConsentDialog(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Leads</h1>
                    <p className="text-muted-foreground">Gérez vos leads achetés et suivez leur statut.</p>
                </div>
                <Badge variant="outline" className="px-4 py-2">
                    {leads.length} leads achetés
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
                        <SelectItem value="SOLD">Nouveau</SelectItem>
                        <SelectItem value="CONTACTED">Contacté</SelectItem>
                        <SelectItem value="CONVERTED">Vendu</SelectItem>
                        <SelectItem value="LOST">Perdu</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Leads List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    filteredLeads.map((lead, idx) => {
                        const product = getProductById(lead.productType);
                        const status = (statusConfig as any)[lead.status] || statusConfig.SOLD;
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
                                                        {new Date(lead.updatedAt).toLocaleDateString("fr-FR")}
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
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lead Attributes */}
                                        <div className="mt-4 pt-4 border-t border-border/50">
                                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-hide py-1">
                                                {(() => {
                                                    try {
                                                        const attrs = typeof lead.attributes === "string"
                                                            ? JSON.parse(lead.attributes)
                                                            : lead.attributes;
                                                        if (!attrs || typeof attrs !== "object") return null;
                                                        return Object.entries(attrs).map(([key, value]) => (
                                                            <span key={key} className="text-[10px] sm:text-xs bg-secondary px-2 py-1 rounded text-muted-foreground whitespace-nowrap">
                                                                <span className="font-semibold text-foreground">{key}:</span> {String(value)}
                                                            </span>
                                                        ));
                                                    } catch {
                                                        return <span className="text-xs text-muted-foreground italic">Attributs non disponibles</span>;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })
                )}

                {!loading && filteredLeads.length === 0 && (
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

                    {selectedLead && selectedLead.consent && (
                        <div className="space-y-4 text-sm">
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                <p className="font-medium text-green-700 dark:text-green-400 mb-2">Texte de consentement accepté :</p>
                                <p className="italic">"{selectedLead.consent.consentText}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Date & Heure</p>
                                    <p className="font-mono text-xs">{new Date(selectedLead.consent.timestamp).toLocaleString("fr-FR")}</p>
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

                            {ConsentPDF && PDFDownloadLink && (
                                <PDFDownloadLink
                                    document={<ConsentPDF lead={selectedLead} consent={selectedLead.consent} />}
                                    fileName={`preuve-consentement-${selectedLead.id}.pdf`}
                                    className="w-full"
                                >
                                    {({ loading: pdfLoading }) => (
                                        <Button
                                            className="w-full rounded-full"
                                            disabled={pdfLoading}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            {pdfLoading ? "Génération..." : "Télécharger le certificat PDF"}
                                        </Button>
                                    )}
                                </PDFDownloadLink>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

