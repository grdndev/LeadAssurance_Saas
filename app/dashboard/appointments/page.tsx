"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Phone,
    Mail,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    Video,
    ShieldCheck,
    Loader2,
    Search,
    Download,
    Filter,
} from "lucide-react";
import { getProductById } from "@/lib/constants/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { toast } from "sonner";

const appointmentStatusConfig = {
    PENDING: { label: "En attente", color: "bg-yellow-500", icon: Clock },
    CONFIRMED: { label: "Confirmé", color: "bg-green-500", icon: CheckCircle2 },
    CANCELLED: { label: "Annulé", color: "bg-red-500", icon: XCircle },
};

export default function AppointmentsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);
    const [ConsentPDF, setConsentPDF] = useState<any>(null);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [showConsentDialog, setShowConsentDialog] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        Promise.all([
            import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
            import("@/components/leads/ConsentPDF").then((m) => m.ConsentPDF),
        ]).then(([PDFLink, Consent]) => {
            setPDFDownloadLink(() => PDFLink);
            setConsentPDF(() => Consent);
        });
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/leads");
            const data = await res.json();
            // Filter only appointment leads
            const appointments = (Array.isArray(data) ? data : []).filter(
                (l: any) => l.leadType === "APPOINTMENT" || l.isAppointment
            );
            setLeads(appointments);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleUpdateAppointmentStatus = async (leadId: string, appointmentStatus: string) => {
        setUpdatingStatus(leadId);
        try {
            const res = await fetch(`/api/user/leads/${leadId}/appointment`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentStatus }),
            });
            if (!res.ok) throw new Error();
            setLeads(prev => prev.map(l =>
                l.id === leadId ? { ...l, appointmentStatus } : l
            ));
            toast.success(appointmentStatus === "CONFIRMED" ? "RDV confirmé !" : "RDV annulé");
        } catch {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesStatus = filterStatus === "all" || (lead.appointmentStatus || "PENDING") === filterStatus;
        const matchesSearch = searchQuery === "" ||
            lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: leads.length,
        pending: leads.filter(l => !l.appointmentStatus || l.appointmentStatus === "PENDING").length,
        confirmed: leads.filter(l => l.appointmentStatus === "CONFIRMED").length,
        cancelled: leads.filter(l => l.appointmentStatus === "CANCELLED").length,
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-purple-500" />
                        Mes Rendez-vous
                    </h1>
                    <p className="text-muted-foreground">Gérez vos RDV qualifiés achetés et confirmez les créneaux.</p>
                </div>
                <Badge variant="outline" className="px-4 py-2 border-purple-500/30 text-purple-600">
                    {leads.length} RDV achetés
                </Badge>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: stats.total, color: "text-foreground", bg: "bg-secondary" },
                    { label: "En attente", value: stats.pending, color: "text-yellow-600", bg: "bg-yellow-500/10" },
                    { label: "Confirmés", value: stats.confirmed, color: "text-green-600", bg: "bg-green-500/10" },
                    { label: "Annulés", value: stats.cancelled, color: "text-red-600", bg: "bg-red-500/10" },
                ].map(stat => (
                    <div key={stat.label} className={`p-4 rounded-2xl ${stat.bg} text-center`}>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                ))}
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
                    <SelectTrigger className="w-full sm:w-[200px] rounded-full">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Statut RDV" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmés</SelectItem>
                        <SelectItem value="CANCELLED">Annulés</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                ) : (
                    filteredLeads.map((lead, idx) => {
                        const product = getProductById(lead.productType);
                        const apptStatus = lead.appointmentStatus || "PENDING";
                        const StatusIcon = (appointmentStatusConfig as any)[apptStatus]?.icon || Clock;

                        let parsedAvailabilities: string[] = [];
                        try {
                            parsedAvailabilities = lead.availabilities
                                ? JSON.parse(lead.availabilities)
                                : [];
                        } catch { }

                        return (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="border-border/50 bg-background/50 hover:bg-background transition-colors overflow-hidden">
                                    {/* Purple top accent */}
                                    <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-700" />
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                            {/* Lead Info */}
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                                                    {product && <product.icon className="h-6 w-6" />}
                                                </div>
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-bold text-lg">{lead.firstName} {lead.lastName}</h3>
                                                        <Badge
                                                            className={`text-xs text-white ${(appointmentStatusConfig as any)[apptStatus]?.color || "bg-yellow-500"}`}
                                                        >
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {(appointmentStatusConfig as any)[apptStatus]?.label}
                                                        </Badge>
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

                                            {/* Appointment Details */}
                                            <div className="flex flex-col gap-3 min-w-[220px]">
                                                {/* Channel */}
                                                <div className="flex items-center gap-2 p-3 bg-purple-500/5 rounded-xl border border-purple-500/20">
                                                    {lead.appointmentChannel === "PHONE" ? (
                                                        <Phone className="h-4 w-4 text-purple-500 shrink-0" />
                                                    ) : (
                                                        <Video className="h-4 w-4 text-purple-500 shrink-0" />
                                                    )}
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Canal</p>
                                                        <p className="font-semibold text-sm">
                                                            {lead.appointmentChannel === "PHONE" ? "Téléphone" : "Visioconférence"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Preferred date */}
                                                {lead.appointmentDate && (
                                                    <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
                                                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Date souhaitée</p>
                                                            <p className="font-semibold text-sm">
                                                                {new Date(lead.appointmentDate).toLocaleDateString("fr-FR", {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Availability slots */}
                                                {parsedAvailabilities.length > 0 && (
                                                    <div className="p-3 bg-secondary rounded-xl">
                                                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> Créneaux disponibles
                                                        </p>
                                                        <div className="flex flex-col gap-1">
                                                            {parsedAvailabilities.map((slot, i) => (
                                                                <span key={i} className="text-xs font-medium">
                                                                    {new Date(slot).toLocaleString("fr-FR", {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action buttons */}
                                                {apptStatus === "PENDING" && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateAppointmentStatus(lead.id, "CONFIRMED")}
                                                            disabled={updatingStatus === lead.id}
                                                            className="flex-1 rounded-full bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            {updatingStatus === lead.id ? (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            )}
                                                            Confirmer
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateAppointmentStatus(lead.id, "CANCELLED")}
                                                            disabled={updatingStatus === lead.id}
                                                            className="rounded-full text-red-500 border-red-500/30 hover:bg-red-500/10"
                                                        >
                                                            <XCircle className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}

                                                {apptStatus === "CONFIRMED" && lead.confirmationSentAt && (
                                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Confirmé le {new Date(lead.confirmationSentAt).toLocaleDateString("fr-FR")}
                                                    </p>
                                                )}

                                                <div className="flex gap-2">
                                                    <Link href={`/dashboard/leads/${lead.id}`} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full rounded-full">
                                                            Détail
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => { setSelectedLead(lead); setShowConsentDialog(true); }}
                                                        className="rounded-full"
                                                    >
                                                        <ShieldCheck className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lead Attributes */}
                                        {lead.attributes && (
                                            <div className="mt-4 pt-4 border-t border-border/50">
                                                <div className="flex flex-wrap gap-2">
                                                    {(() => {
                                                        try {
                                                            const attrs = typeof lead.attributes === "string"
                                                                ? JSON.parse(lead.attributes)
                                                                : lead.attributes;
                                                            if (!attrs || typeof attrs !== "object") return null;
                                                            return Object.entries(attrs).map(([key, value]) => (
                                                                <span key={key} className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                                                                    <span className="font-semibold text-foreground">{key}:</span> {String(value)}
                                                                </span>
                                                            ));
                                                        } catch {
                                                            return null;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })
                )}

                {!loading && filteredLeads.length === 0 && (
                    <div className="text-center py-16 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
                            <Calendar className="h-8 w-8 text-purple-400" />
                        </div>
                        <p className="text-muted-foreground">
                            {leads.length === 0
                                ? "Vous n'avez pas encore acheté de RDV qualifiés. Rendez-vous sur la Salle de Marché pour en acquérir."
                                : "Aucun RDV ne correspond à vos critères."}
                        </p>
                        {leads.length === 0 && (
                            <Link href="/dashboard/marketplace">
                                <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Voir les RDV disponibles
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Consent Proof Dialog */}
            <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                            Preuve de Consentement Renforcé RGPD
                        </DialogTitle>
                        <DialogDescription>
                            Certificat d'authenticité du consentement renforcé pour ce RDV.
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

                            {PDFDownloadLink && ConsentPDF && selectedLead?.consent && (
                                <PDFDownloadLink
                                    document={<ConsentPDF lead={selectedLead} consent={selectedLead.consent} />}
                                    fileName={`preuve-consentement-rdv-${selectedLead.id}.pdf`}
                                    className="w-full"
                                >
                                    {({ loading: pdfLoading }: { loading: boolean }) => (
                                        <Button className="w-full rounded-full" disabled={pdfLoading}>
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
