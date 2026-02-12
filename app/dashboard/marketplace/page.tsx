"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Euro,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  RefreshCw,
  Search,
  Loader2
} from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/constants/products";
import { getLeadFreshness, isUltraFresh } from "@/lib/types/leads";
import { Card, CardContent } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";

export default function MarketplacePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProductType, setSelectedProductType] = useState("all");
  const [zipFilter, setZipFilter] = useState("");
  const [reservedLead, setReservedLead] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedLeadForPurchase, setSelectedLeadForPurchase] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [boughtLeadDetails, setBoughtLeadDetails] = useState<any | null>(null);

  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, profileRes] = await Promise.all([
        fetch("/api/marketplace/leads"),
        fetch("/api/user/profile")
      ]);
      const leadsData = await leadsRes.json();
      const profileData = await profileRes.json();
      setLeads(leadsData);
      setUserProfile(profileData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (reservedLead && timeLeft > 0 && !purchaseSuccess) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleCancelReservation();
    }
    return () => clearInterval(timer);
  }, [reservedLead, timeLeft, purchaseSuccess]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleBuyClick = (lead: any) => {
    setSelectedLeadForPurchase(lead);
    setReservedLead(lead.id);
    setTimeLeft(600);
    setPurchaseSuccess(false);
    setShowPaymentDialog(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedLeadForPurchase) return;

    setPurchasing(true);
    try {
      const response = await fetch("/api/marketplace/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: selectedLeadForPurchase.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'achat");
      }

      setBoughtLeadDetails(result.lead);
      setPurchaseSuccess(true);
      // Refresh user profile for credits
      const profileRes = await fetch("/api/user/profile");
      const profileData = await profileRes.json();
      setUserProfile(profileData);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancelReservation = () => {
    setReservedLead(null);
    setTimeLeft(600);
    setShowPaymentDialog(false);
    setPurchaseSuccess(false);
    setSelectedLeadForPurchase(null);
  };

  const handleCloseSuccess = () => {
    router.push("/dashboard/leads");
  };

  // Filter leads
  const filteredLeads = (Array.isArray(leads) ? leads : []).filter(lead => {
    const product = getProductById(lead.productType);
    const matchesCategory = selectedCategory === "All" || product?.category === selectedCategory;
    const matchesProduct = selectedProductType === "all" || lead.productType === selectedProductType;
    const matchesZip = zipFilter === "" || lead.zipCode.startsWith(zipFilter);
    return matchesCategory && matchesProduct && matchesZip;
  });

  // Get unique product types for filter
  const availableProducts = [...new Set(leads.map(l => l.productType))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salle de Marché</h1>
          <p className="text-muted-foreground">Leads en stock disponibles à l'achat immédiat.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-4 py-2 bg-primary/10 text-primary border-primary/20">
            Crédit: {userProfile?.credits?.toFixed(2) || "0.00"} €
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchData} className="rounded-full">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Actualiser
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-wrap gap-2">
          {["All", "Crédit", "Assurance", "Patrimoine"].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => { setSelectedCategory(cat); setSelectedProductType("all"); }}
              className="rounded-full"
            >
              {cat === "All" ? "Tous" : cat}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <Select value={selectedProductType} onValueChange={setSelectedProductType}>
            <SelectTrigger className="w-[200px] rounded-full">
              <SelectValue placeholder="Type de produit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les produits</SelectItem>
              {availableProducts.map(pt => {
                const product = getProductById(pt);
                return (
                  <SelectItem key={pt} value={pt}>{product?.name || pt}</SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Code postal..."
              className="pl-10 w-32 rounded-full"
              value={zipFilter}
              onChange={(e) => setZipFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span><strong className="text-foreground">{filteredLeads.length}</strong> leads disponibles</span>
        <span className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Mise à jour en temps réel
        </span>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const product = getProductById(lead.productType);
              const isReservedByMe = reservedLead === lead.id;
              const freshness = getLeadFreshness(lead.createdAt);
              const ultraFresh = isUltraFresh(lead.createdAt);

              return (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className={`relative overflow-hidden border-border/50 bg-background/50 hover:border-primary/50 transition-all ${isReservedByMe ? "ring-2 ring-primary" : ""}`}>
                    {ultraFresh && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                          Ultra-Frais
                        </div>
                      </div>
                    )}

                    {lead.isAppointment && (
                      <div className="absolute top-0 left-0">
                        <div className="bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> RDV
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6 pt-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          {product ? <product.icon className="h-6 w-6" /> : <Euro className="h-6 w-6" />}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{product?.name || lead.productType}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" /> {lead.city} ({lead.zipCode})
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Fraîcheur</span>
                          <span className={`font-medium flex items-center gap-1 ${ultraFresh ? "text-green-500" : ""}`}>
                            <Clock className="h-3 w-3" /> {freshness}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Consentement</span>
                          <span className="text-green-500 font-semibold flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Vérifié
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Type</span>
                          <span className="text-foreground font-medium">{lead.isExclusive ? "Exclusif" : "Mutualisé"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/50 pt-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Prix</div>
                          <div className="text-2xl font-bold">{lead.price.toFixed(2)} €</div>
                        </div>
                        <Button
                          onClick={() => handleBuyClick(lead)}
                          disabled={!!reservedLead}
                          className="rounded-full px-6"
                        >
                          Acheter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {!loading && filteredLeads.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun lead disponible avec ces critères. Modifiez vos filtres ou revenez plus tard.
        </div>
      )}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={(open) => !open && handleCancelReservation()}>
        <DialogContent className="sm:max-w-[450px]">
          {!purchaseSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle>Finaliser l'achat</DialogTitle>
                <DialogDescription>
                  Prix du lead: <span className="font-bold text-foreground">{selectedLeadForPurchase?.price.toFixed(2)} €</span>
                </DialogDescription>
              </DialogHeader>

              {selectedLeadForPurchase && (
                <div className="py-4 space-y-4">
                  {/* Lead Summary */}
                  <div className="p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const product = getProductById(selectedLeadForPurchase.productType);
                        return product ? <product.icon className="h-6 w-6 text-primary" /> : null;
                      })()}
                      <div>
                        <div className="font-bold">{getProductById(selectedLeadForPurchase.productType)?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedLeadForPurchase.city} ({selectedLeadForPurchase.zipCode})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="space-y-2 bg-secondary/30 p-4 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span>Crédits actuels</span>
                      <span>{userProfile?.credits?.toFixed(2)} €</span>
                    </div>
                    <div className={`flex justify-between text-sm font-bold ${userProfile?.credits < selectedLeadForPurchase.price ? "text-destructive" : "text-primary"}`}>
                      <span>Solde après achat</span>
                      <span>{(userProfile?.credits - selectedLeadForPurchase.price).toFixed(2)} €</span>
                    </div>
                  </div>

                  {userProfile?.credits < selectedLeadForPurchase.price && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-xs font-medium">
                      Crédits insuffisants. Veuillez recharger votre compte.
                    </div>
                  )}

                  {/* Warning */}
                  <div className="flex items-start gap-2 text-amber-500 bg-amber-500/10 p-3 rounded-lg text-xs">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>En confirmant, les coordonnées complètes du prospect vous seront immédiatement révélées. Cette action est irréversible.</span>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={handleCancelReservation}>Annuler</Button>
                <Button
                  onClick={handleConfirmPurchase}
                  disabled={purchasing || (userProfile?.credits < (selectedLeadForPurchase?.price || 0))}
                >
                  {purchasing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Confirmer l'achat
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="py-8 flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"
                >
                  <CheckCircle2 className="h-12 w-12" />
                </motion.div>
                <h2 className="text-2xl font-bold">Achat réussi !</h2>
                <p className="text-muted-foreground text-center max-w-xs">
                  Le lead a été ajouté à votre espace. Vous pouvez maintenant contacter le prospect.
                </p>

                {boughtLeadDetails && (
                  <div className="w-full p-4 bg-secondary/30 rounded-xl space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nom</span>
                      <span className="font-bold">{boughtLeadDetails.firstName} {boughtLeadDetails.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Téléphone</span>
                      <span className="font-bold">{boughtLeadDetails.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-bold">{boughtLeadDetails.email}</span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button className="w-full" onClick={handleCloseSuccess}>
                  Voir mes leads
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

