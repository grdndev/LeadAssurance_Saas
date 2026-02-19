"use client";

import { useState, useEffect } from "react";
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
    MapPin,
    Loader2,
    RefreshCw,
    Pencil,
    Save,
    Download,
    ShieldCheck,
} from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/constants/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

const statusConfig = {
    STOCK: { label: "En stock", color: "bg-blue-500", icon: CheckCircle2 },
    SOLD: { label: "Vendu", color: "bg-green-500", icon: CheckCircle2 },
    REJECTED: { label: "Refusé", color: "bg-red-500", icon: XCircle },
    PENDING: { label: "En validation", color: "bg-yellow-500", icon: Clock },
};

const translateAttributeKey = (key: string): string => {
    const translations: Record<string, string> = {
        // Personal Info
        firstName: "Prénom",
        lastName: "Nom",
        phone: "Téléphone",
        email: "Email",
        zipCode: "Code postal",
        city: "Ville",
        address: "Adresse",
        birthDate: "Date de naissance",
        
        // Status fields
        status: "Statut",
        amount: "Montant",
        seniority: "Ancienneté",
        usage: "Usage",
        
        // Vehicle Info
        vehicleType: "Type de véhicule",
        vehicleBrand: "Marque",
        vehicleModel: "Modèle",
        vehicleYear: "Année",
        licensePlate: "Immatriculation",
        
        // Insurance Info
        currentInsurer: "Assureur actuel",
        contractEndDate: "Fin de contrat",
        claimsHistory: "Historique sinistres",
        driverLicense: "Permis de conduire",
        
        // Property Info
        propertyType: "Type de bien",
        propertySize: "Surface",
        rooms: "Nombre de pièces",
        constructionYear: "Année de construction",
        ownershipStatus: "Statut occupation",
        
        // Professional Info
        companyName: "Nom entreprise",
        siret: "SIRET",
        activity: "Activité",
        employees: "Nombre d'employés",
        turnover: "Chiffre d'affaires",
        
        // Credit Info
        loanAmount: "Montant emprunté",
        loanDuration: "Durée",
        loanPurpose: "Objet du prêt",
        monthlyIncome: "Revenus mensuels",
        creditScore: "Score crédit",
        
        // Other
        projectDescription: "Description projet",
        budget: "Budget",
        timeline: "Délai",
        notes: "Notes",
        consent: "Consentement",
        consentDate: "Date consentement",
        source: "Source",
    };
    
    return translations[key] || key;
};

export default function ProviderLeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [editSaving, setEditSaving] = useState(false);
    const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);
    const [ConsentPDF, setConsentPDF] = useState<any>(null);

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
            const res = await fetch("/api/user/provider/leads");
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
        const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
        const matchesSearch = searchQuery === "" ||
            lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleViewDetails = (lead: any) => {
        setSelectedLead(lead);
        setShowDetailDialog(true);
    };

    const handleEditLead = (lead: any) => {
        setSelectedLead(lead);
        setEditForm({
            firstName: lead.firstName,
            lastName: lead.lastName,
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
            const res = await fetch(`/api/leads/${selectedLead.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                setShowEditDialog(false);
                fetchLeads();
            }
        } catch (err) {
            console.error("Edit error:", err);
        } finally {
            setEditSaving(false);
        }
    };

    // Calculate stats - Provider gets 50% commission
    const totalRevenue = leads
        .filter(l => l.status === "SOLD")
        .reduce((sum, l) => sum + (l.price * 0.5), 0);
    const soldCount = leads.filter(l => l.status === "SOLD").length;
    const rejectedCount = leads.filter(l => l.status === "REJECTED").length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Leads Envoyés</h1>
                    <p className="text-muted-foreground">Suivez le statut de vos leads soumis.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="px-4 py-2 bg-green-500/10 text-green-500 border-green-500/20">
                        {soldCount} vendus • {totalRevenue.toFixed(2)}€ gagnés
                    </Badge>
                    {rejectedCount > 0 && (
                        <Badge variant="outline" className="px-4 py-2 bg-red-500/10 text-red-500 border-red-500/20">
                            {rejectedCount} refusé(s)
                        </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={fetchLeads} className="rounded-full">
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par prénom, ville..."
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
                        <SelectItem value="PENDING">En validation</SelectItem>
                        <SelectItem value="STOCK">En stock</SelectItem>
                        <SelectItem value="SOLD">Vendu</SelectItem>
                        <SelectItem value="REJECTED">Refusé</SelectItem>
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
                        const status = (statusConfig as any)[lead.status] || statusConfig.PENDING;
                        const StatusIcon = status.icon;
                        const providerRevenue = lead.status === "SOLD" ? lead.price * 0.5 : null;

                        return (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className={`border-border/50 bg-background/50 hover:bg-background transition-colors ${lead.status === "REJECTED" ? "border-red-500/30" : ""}`}>
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
                                                            <Calendar className="h-3 w-3" /> {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                                                        </span>
                                                    </div>

                                                    {lead.status === "REJECTED" && (
                                                        <div className="mt-2 text-xs text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg inline-block">
                                                            Motif: {lead.rejectionReason || "Non conforme"}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price & Revenue */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">Prix de vente</div>
                                                    <div className="font-bold">{lead.price.toFixed(2)}€</div>
                                                </div>
                                                {providerRevenue !== null && (
                                                    <div className="text-right">
                                                        <div className="text-xs text-muted-foreground">Votre revenu</div>
                                                        <div className="font-bold text-green-500">+{providerRevenue.toFixed(2)}€</div>
                                                    </div>
                                                )}
                                                {(lead.status === "PENDING" || lead.status === "STOCK") && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditLead(lead)}
                                                        className="rounded-full"
                                                    >
                                                        <Pencil className="h-4 w-4 mr-1" /> Modifier
                                                    </Button>
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
                    })
                )}

                {!loading && filteredLeads.length === 0 && (
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
                            Informations sur le lead soumis par vous.
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
                                    <p className="text-xs text-muted-foreground">Date d&apos;envoi</p>
                                    <p className="font-medium">{new Date(selectedLead.createdAt).toLocaleString("fr-FR")}</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Prix</p>
                                    <p className="font-medium">{selectedLead.price.toFixed(2)}€</p>
                                </div>
                            </div>

                            {selectedLead.status === "SOLD" && (
                                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                    <div className="flex items-center gap-2 text-green-500 font-semibold">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Lead vendu !
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Félicitations, ce lead a trouvé un acheteur.
                                    </p>
                                    <p className="text-lg font-bold text-green-500 mt-2">
                                        +{(selectedLead.price * 0.5).toFixed(2)}€ crédités
                                    </p>
                                </div>
                            )}

                            {selectedLead.status === "REJECTED" && (
                                <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                    <div className="flex items-center gap-2 text-red-500 font-semibold">
                                        <XCircle className="h-5 w-5" />
                                        Lead refusé
                                    </div>
                                    <p className="text-sm mt-2">{selectedLead.rejectionReason || "Les informations fournies ne permettent pas la validation de ce prospect selon nos critères de qualité."}</p>
                                </div>
                            )}

                            {/* RGPD Consent Proof */}
                            {selectedLead.consent && (
                                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 space-y-3">
                                    <p className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                                        <ShieldCheck className="h-4 w-4" /> Preuve de Consentement RGPD
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <p className="text-muted-foreground">Date</p>
                                            <p className="font-mono">{new Date(selectedLead.consent.timestamp).toLocaleString("fr-FR")}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">IP</p>
                                            <p className="font-mono">{selectedLead.consent.ipAddress}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs">
                                        <p className="text-muted-foreground mb-1">Hash SHA-256</p>
                                        {selectedLead.consent.proofHash ? (
                                            <p className="font-mono break-all text-muted-foreground">{selectedLead.consent.proofHash.slice(0, 32)}…</p>
                                        ) : (
                                            <p className="italic text-muted-foreground">Non disponible (lead antérieur)</p>
                                        )}
                                    </div>
                                    {PDFDownloadLink && ConsentPDF && (
                                        <PDFDownloadLink
                                            document={<ConsentPDF lead={selectedLead} consent={selectedLead.consent} />}
                                            fileName={`preuve-consentement-${selectedLead.id}.pdf`}
                                            className="w-full block"
                                        >
                                            {({ loading: pdfLoading }: { loading: boolean }) => (
                                                <button
                                                    disabled={pdfLoading}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-60"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    {pdfLoading ? "Génération..." : "Télécharger certificat PDF"}
                                                </button>
                                            )}
                                        </PDFDownloadLink>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="font-medium">Attributs fournis :</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(JSON.parse(selectedLead.attributes)).map(([key, value]) => (
                                        <div key={key} className="flex justify-between border-b pb-1">
                                            <span className="text-muted-foreground">{translateAttributeKey(key)}</span>
                                            <span className="font-medium">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
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
                                    value={editForm.firstName || ""}
                                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nom</Label>
                                <Input
                                    value={editForm.lastName || ""}
                                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
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

