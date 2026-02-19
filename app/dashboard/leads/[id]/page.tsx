"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    ShieldCheck,
    Loader2,
    ChevronDown,
    Building2,
    User,
    Tag,
} from "lucide-react";
import { getProductById } from "@/lib/constants/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";

const statusConfig = {
    SOLD: { label: "Nouveau", color: "bg-blue-500", icon: Clock },
    CONTACTED: { label: "Contacté", color: "bg-yellow-500", icon: Phone },
    CONVERTED: { label: "Converti", color: "bg-green-500", icon: CheckCircle2 },
    LOST: { label: "Perdu", color: "bg-red-500", icon: XCircle },
};

const translateKey = (key: string): string => {
    const map: Record<string, string> = {
        projectType: "Type de projet", amount: "Montant", apport: "Apport", situationPro: "Situation pro",
        income: "Revenus", delay: "Délai", owner: "Propriétaire", creditCount: "Nb crédits",
        monthlyPayments: "Mensualités", totalDebt: "Total dettes", familySituation: "Situation familiale",
        status: "Statut", activity: "Activité", usage: "Usage", seniority: "Ancienneté",
        requestType: "Type demande", loanDate: "Date prêt", loanAmount: "Montant prêt",
        age: "Âge", smoker: "Fumeur", peopleCount: "Nb personnes", regime: "Régime",
        priority: "Priorité", employeeCount: "Nb employés", sector: "Secteur", convention: "Convention",
        startDate: "Date début", vehicleType: "Type véhicule", vehicleBrand: "Marque",
        vehicleModel: "Modèle", vehicleYear: "Année", licensePlate: "Immatriculation",
        currentInsurer: "Assureur actuel", contractEndDate: "Fin contrat", claimsHistory: "Sinistres",
        propertyType: "Type bien", propertySize: "Surface", rooms: "Pièces",
        constructionYear: "Année construction", ownershipStatus: "Statut occupation",
        companyName: "Entreprise", siret: "SIRET", employees: "Employés", turnover: "CA",
        loanDuration: "Durée prêt", loanPurpose: "Objet prêt", monthlyIncome: "Revenus mensuels",
        budget: "Budget", timeline: "Délai projet", notes: "Notes",
    };
    return map[key] || key;
};

export default function LeadDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [lead, setLead] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);
    const [ConsentPDF, setConsentPDF] = useState<any>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showLossDialog, setShowLossDialog] = useState(false);
    const [lossReason, setLossReason] = useState("");
    const [showConsentDialog, setShowConsentDialog] = useState(false);

    useEffect(() => {
        setMounted(true);
        Promise.all([
            import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
            import("@/components/leads/ConsentPDF").then((m) => m.ConsentPDF),
        ]).then(([PDFLink, Consent]) => {
            setPDFDownloadLink(() => PDFLink);
            setConsentPDF(() => Consent);
        });
    }, []);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const res = await fetch(`/api/user/leads/${id}`);
                if (!res.ok) {
                    toast.error("Lead introuvable");
                    router.push("/dashboard/leads");
                    return;
                }
                const data = await res.json();
                setLead(data);
            } catch {
                toast.error("Erreur lors du chargement");
                router.push("/dashboard/leads");
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id, router]);

    const handleUpdateStatus = async (brokerStatus: string, reason?: string) => {
        if (!lead) return;
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/user/leads/${lead.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brokerStatus, lossReason: reason }),
            });
            if (!res.ok) throw new Error();
            setLead((prev: any) => ({ ...prev, brokerStatus, lossReason: reason || null }));
            toast.success("Statut mis à jour");
        } catch {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const confirmLoss = async () => {
        await handleUpdateStatus("LOST", lossReason);
        setShowLossDialog(false);
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!lead) return null;

    const product = getProductById(lead.productType);
    const bStatus = (statusConfig as any)[lead.brokerStatus || "SOLD"] || statusConfig.SOLD;
    const StatusIcon = bStatus.icon;

    let attrs: Record<string, any> = {};
    try {
        attrs = typeof lead.attributes === "string" ? JSON.parse(lead.attributes) : (lead.attributes || {});
    } catch { /* */ }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/leads">
                    <Button variant="ghost" size="sm" className="rounded-full">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Retour
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{lead.firstName} {lead.lastName}</h1>
                    <p className="text-muted-foreground text-sm">{product?.name} · Lead #{lead.id.slice(-8).toUpperCase()}</p>
                </div>
                {/* CRM Status Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            disabled={updatingStatus}
                            className={`rounded-full text-white ${bStatus.color} hover:opacity-90`}
                            size="sm"
                        >
                            {updatingStatus ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <StatusIcon className="h-4 w-4 mr-2" />
                                    {bStatus.label}
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => handleUpdateStatus("CONTACTED")}>
                            <Phone className="h-4 w-4 mr-2 text-yellow-500" /> Contacté
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus("CONVERTED")}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Converti
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500" onClick={() => { setLossReason(""); setShowLossDialog(true); }}>
                            <XCircle className="h-4 w-4 mr-2" /> Perdu...
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left: Contact Info */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="h-4 w-4 text-primary" /> Informations de contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                                        <Phone className="h-4 w-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Téléphone</p>
                                            <a href={`tel:${lead.phone}`} className="font-semibold hover:text-primary transition-colors">
                                                {lead.phone}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                                        <Mail className="h-4 w-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <a href={`mailto:${lead.email}`} className="font-semibold hover:text-primary transition-colors truncate block max-w-[200px]">
                                                {lead.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Localisation</p>
                                            <p className="font-semibold">{lead.zipCode} {lead.city}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Date d&apos;achat</p>
                                            <p className="font-semibold">{new Date(lead.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Attributes */}
                    {Object.keys(attrs).length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="border-border/50 bg-background/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Tag className="h-4 w-4 text-primary" /> Données qualifiantes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {Object.entries(attrs).map(([key, value]) => (
                                            <div key={key} className="flex flex-col p-3 bg-secondary rounded-xl">
                                                <span className="text-xs text-muted-foreground mb-1">{translateKey(key)}</span>
                                                <span className="font-semibold text-sm">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Loss reason */}
                    {lead.lossReason && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                            <strong>Motif de perte :</strong> {lead.lossReason}
                        </div>
                    )}
                </div>

                {/* Right: Meta + Consent */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                        <Card className="border-border/50 bg-background/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Building2 className="h-4 w-4 text-primary" /> Produit & Prix
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        {product && <product.icon className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{product?.name}</p>
                                        <p className="text-xs text-muted-foreground">{product?.category}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-secondary rounded-xl">
                                    <span className="text-sm text-muted-foreground">Prix payé</span>
                                    <span className="font-bold text-primary">{lead.price?.toFixed(2)} €</span>
                                </div>
                                {lead.isAppointment && (
                                    <Badge variant="secondary" className="w-full justify-center py-1.5">
                                        RDV qualifié
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Consent */}
                    {lead.consent && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <Card className="border-green-500/20 bg-green-500/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base text-green-600 dark:text-green-400">
                                        <ShieldCheck className="h-4 w-4" /> Consentement RGPD
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Date</p>
                                        <p className="font-mono text-xs">{new Date(lead.consent.timestamp).toLocaleString("fr-FR")}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">IP</p>
                                        <p className="font-mono text-xs">{lead.consent.ipAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Hash SHA-256</p>
                                        {lead.consent.proofHash ? (
                                            <p className="font-mono text-[10px] break-all text-muted-foreground">
                                                {lead.consent.proofHash.slice(0, 32)}…
                                            </p>
                                        ) : (
                                            <p className="text-[10px] text-muted-foreground italic">Non disponible (lead antérieur)</p>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full rounded-full border-green-500/30 text-green-600 hover:bg-green-500/10"
                                        onClick={() => setShowConsentDialog(true)}
                                    >
                                        <ShieldCheck className="h-4 w-4 mr-2" /> Voir le certificat
                                    </Button>
                                    {PDFDownloadLink && ConsentPDF ? (
                                        <PDFDownloadLink
                                            document={<ConsentPDF lead={lead} consent={lead.consent} />}
                                            fileName={`preuve-consentement-${lead.id}.pdf`}
                                            className="w-full block"
                                        >
                                            {({ loading: pdfLoading }: { loading: boolean }) => (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="w-full rounded-full"
                                                    disabled={pdfLoading}
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    {pdfLoading ? "Génération..." : "Télécharger PDF"}
                                                </Button>
                                            )}
                                        </PDFDownloadLink>
                                    ) : (
                                        <Button variant="default" size="sm" className="w-full rounded-full" disabled>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Chargement...
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Loss Reason Dialog */}
            <Dialog open={showLossDialog} onOpenChange={setShowLossDialog}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Marquer comme perdu</DialogTitle>
                        <DialogDescription>Optionnel : indiquez la raison de la perte.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <Select onValueChange={setLossReason} value={lossReason}>
                            <SelectTrigger className="rounded-full">
                                <SelectValue placeholder="Sélectionner un motif (optionnel)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Prix trop élevé">Prix trop élevé</SelectItem>
                                <SelectItem value="Injoignable">Injoignable</SelectItem>
                                <SelectItem value="Déjà assuré">Déjà assuré</SelectItem>
                                <SelectItem value="Projet annulé">Projet annulé</SelectItem>
                                <SelectItem value="Pas intéressé">Pas intéressé</SelectItem>
                                <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Précisez si besoin..."
                            className="rounded-full"
                            value={lossReason}
                            onChange={(e) => setLossReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setShowLossDialog(false)} className="rounded-full">Annuler</Button>
                        <Button variant="destructive" onClick={confirmLoss} className="rounded-full">
                            <XCircle className="h-4 w-4 mr-2" /> Confirmer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Consent Proof Dialog */}
            <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                            Preuve de Consentement RGPD
                        </DialogTitle>
                        <DialogDescription>Certificat d&apos;authenticité du consentement pour ce lead.</DialogDescription>
                    </DialogHeader>
                    {lead?.consent && (
                        <div className="space-y-4 text-sm">
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                <p className="font-medium text-green-700 dark:text-green-400 mb-2">Texte de consentement accepté :</p>
                                <p className="italic text-sm">&quot;{lead.consent.consentText}&quot;</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Date &amp; Heure</p>
                                    <p className="font-mono text-xs mt-1">{new Date(lead.consent.timestamp).toLocaleString("fr-FR")}</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg">
                                    <p className="text-xs text-muted-foreground">Adresse IP</p>
                                    <p className="font-mono text-xs mt-1">{lead.consent.ipAddress}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">URL Source</p>
                                <p className="font-mono text-xs break-all">{lead.consent.urlSource}</p>
                            </div>
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">User Agent</p>
                                <p className="font-mono text-xs break-all text-muted-foreground">{lead.consent.userAgent}</p>
                            </div>
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Hash SHA-256</p>
                                {lead.consent.proofHash ? (
                                    <p className="font-mono text-xs break-all">{lead.consent.proofHash}</p>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">Non disponible (lead antérieur à la mise en place du hash)</p>
                                )}
                            </div>
                            {PDFDownloadLink && ConsentPDF && (
                                <PDFDownloadLink
                                    document={<ConsentPDF lead={lead} consent={lead.consent} />}
                                    fileName={`preuve-consentement-${lead.id}.pdf`}
                                    className="w-full block"
                                >
                                    {({ loading: pdfLoading }: { loading: boolean }) => (
                                        <Button className="w-full rounded-full" disabled={pdfLoading}>
                                            <Download className="h-4 w-4 mr-2" />
                                            {pdfLoading ? "Génération du certificat..." : "Télécharger le certificat PDF"}
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
