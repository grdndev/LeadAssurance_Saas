"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/constants/products";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ShieldCheck,
  Send,
  Loader2,
  Calendar,
  Phone,
  Video,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";

export default function SubmitLeadPage() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRdv, setIsRdv] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState("");

  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    defaultValues: {
      productType: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      city: "",
      price: "",
      appointmentChannel: "",
      appointmentDate: "",
      attributes: {} as any,
    }
  });

  const product = PRODUCTS.find(p => p.id === selectedProduct);

  const addSlot = () => {
    if (newSlot && !availabilitySlots.includes(newSlot)) {
      setAvailabilitySlots(prev => [...prev, newSlot]);
      setNewSlot("");
    }
  };

  const removeSlot = (slot: string) => {
    setAvailabilitySlots(prev => prev.filter(s => s !== slot));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const basePrice = isRdv ? (product?.appointmentPrice || 45.0) : (product?.basePrice || 25.0);
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          productType: selectedProduct,
          leadType: isRdv ? "APPOINTMENT" : "LEAD",
          isAppointment: isRdv,
          appointmentChannel: isRdv ? data.appointmentChannel : undefined,
          appointmentDate: isRdv && data.appointmentDate ? data.appointmentDate : undefined,
          availabilities: isRdv ? availabilitySlots : undefined,
          consentText: isRdv
            ? "Le prospect a donné son consentement explicite et renforcé pour un rendez-vous de conseil personnalisé. Il accepte d'être contacté par un professionnel qualifié."
            : "Le prospect a donné son consentement explicite pour être recontacté.",
          urlSource: window.location.href,
          price: data.price ? parseFloat(data.price) : basePrice,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      setSubmitted(true);
      reset();
      setSelectedProduct("");
      setIsRdv(false);
      setAvailabilitySlots([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`h-20 w-20 rounded-full flex items-center justify-center ${isRdv ? "bg-purple-500/10 text-purple-500" : "bg-green-500/10 text-green-500"}`}
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <h2 className="text-3xl font-bold">{isRdv ? "RDV envoyé avec succès !" : "Lead envoyé avec succès !"}</h2>
        <p className="text-muted-foreground max-w-md">
          {isRdv
            ? "Votre rendez-vous qualifié a été validé et mis en stock. Il sera proposé aux courtiers sous peu. Preuve de consentement renforcé archivée."
            : "Votre lead a été validé et mis en stock. Il sera proposé aux courtiers sous peu. Preuve de consentement archivée."}
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full px-8">
          Envoyer un autre {isRdv ? "RDV" : "lead"}
        </Button>
      </div>
    );
  }

  const suggestedPrice = isRdv
    ? (product?.appointmentPrice || 45.0)
    : (product?.basePrice || 25.0);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Injection de Lead</h1>
        <p className="text-muted-foreground">Fournissez les détails du prospect et la preuve de consentement.</p>
      </div>

      {/* Lead Type Toggle */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setIsRdv(false)}
          className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${!isRdv ? "border-primary bg-primary/5" : "border-border/50 bg-background/50 hover:border-primary/30"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!isRdv ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Lead Standard</p>
              <p className="text-xs text-muted-foreground">Coordonnées prospect + projet</p>
            </div>
            {!isRdv && <Badge className="ml-auto">Sélectionné</Badge>}
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setIsRdv(true); }}
          disabled={product ? !product.hasAppointment : false}
          className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${isRdv ? "border-purple-500 bg-purple-500/5" : "border-border/50 bg-background/50 hover:border-purple-500/30"} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isRdv ? "bg-purple-500 text-white" : "bg-secondary"}`}>
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold flex items-center gap-2">
                RDV Qualifié
                <Badge variant="outline" className="text-[10px] border-purple-500/50 text-purple-600">Premium</Badge>
              </p>
              <p className="text-xs text-muted-foreground">Rendez-vous avec créneaux de disponibilité</p>
            </div>
            {isRdv && <Badge className="ml-auto bg-purple-500">Sélectionné</Badge>}
          </div>
        </button>
      </div>

      {product && isRdv && !product.hasAppointment && (
        <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl text-sm border border-amber-500/20">
          ⚠️ Ce produit ne propose pas de RDV qualifiés. Choisissez un autre produit ou utilisez le mode Lead Standard.
        </div>
      )}

      <Card className="border-border/50 bg-background/50 overflow-hidden">
        <CardHeader className={`border-b border-border/50 ${isRdv ? "bg-purple-500/5" : "bg-primary/5"}`}>
          <CardTitle className="flex items-center gap-2">
            {isRdv ? <Calendar className="h-5 w-5 text-purple-500" /> : <Phone className="h-5 w-5" />}
            {isRdv ? "Nouveau RDV Qualifié" : "Nouveau Lead"}
          </CardTitle>
          <CardDescription>
            {isRdv
              ? "Sélectionnez le produit et remplissez les informations de rendez-vous."
              : "Sélectionnez le produit et remplissez les informations obligatoires."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Type de Produit</Label>
                <Controller
                  name="productType"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedProduct(val);
                        const p = PRODUCTS.find(pr => pr.id === val);
                        if (isRdv && p && !p.hasAppointment) setIsRdv(false);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Choisir un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {(isRdv ? PRODUCTS.filter(p => p.hasAppointment) : PRODUCTS).map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Prix de vente (€)</Label>
                <Input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  placeholder={`${suggestedPrice.toFixed(2)}`}
                  className="rounded-full"
                />
                <p className="text-xs text-muted-foreground">
                  Prix suggéré {isRdv ? "(RDV)" : ""}: <span className={isRdv ? "text-purple-600 font-semibold" : ""}>{suggestedPrice.toFixed(2)}€</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Email du prospect</Label>
                <Input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="email@exemple.com"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  {...register("firstName", { required: true })}
                  placeholder="Jean"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  {...register("lastName", { required: true })}
                  placeholder="Dupont"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  {...register("phone", { required: true })}
                  placeholder="06 00 00 00 00"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Code Postal</Label>
                <Input
                  {...register("zipCode", { required: true })}
                  placeholder="75000"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  {...register("city", { required: true })}
                  placeholder="Paris"
                  className="rounded-full"
                />
              </div>
            </div>

            {/* RDV-specific fields */}
            {isRdv && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-6 border-t border-purple-500/20 space-y-6"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Calendar className="h-5 w-5" />
                  Informations du Rendez-vous
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Canal de RDV *</Label>
                    <Controller
                      name="appointmentChannel"
                      control={control}
                      rules={{ required: isRdv }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="rounded-full">
                            <SelectValue placeholder="Choisir le canal..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PHONE">
                              <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> Téléphone</span>
                            </SelectItem>
                            <SelectItem value="VISIO">
                              <span className="flex items-center gap-2"><Video className="h-4 w-4" /> Visioconférence</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date souhaitée (si connue)</Label>
                    <Input
                      {...register("appointmentDate")}
                      type="datetime-local"
                      className="rounded-full"
                    />
                  </div>
                </div>

                {/* Availability slots */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Créneaux de disponibilité du prospect
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="datetime-local"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      className="rounded-full flex-1"
                    />
                    <Button type="button" onClick={addSlot} variant="outline" className="rounded-full" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {availabilitySlots.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {availabilitySlots.map(slot => (
                        <Badge key={slot} variant="secondary" className="gap-1 pr-1 py-1">
                          <Clock className="h-3 w-3" />
                          {new Date(slot).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          <button type="button" onClick={() => removeSlot(slot)} className="ml-1 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Dynamic Product Fields */}
            {product && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-6 border-t border-border/50 space-y-6"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Détails du projet {product.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.fields.map(field => (
                    <div key={field.name} className="space-y-2">
                      <Label>{field.label}</Label>
                      {field.type === "select" ? (
                        <Controller
                          name={`attributes.${field.name}`}
                          control={control}
                          render={({ field: selectField }) => (
                            <Select
                              onValueChange={selectField.onChange}
                              value={selectField.value}
                            >
                              <SelectTrigger className="rounded-full">
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((opt: any) => (
                                  <SelectItem
                                    key={typeof opt === 'string' ? opt : opt.value}
                                    value={typeof opt === 'string' ? opt : opt.value}
                                  >
                                    {typeof opt === 'string' ? opt : opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      ) : (
                        <Input
                          {...register(`attributes.${field.name}`)}
                          type={field.type === "number" ? "number" : "text"}
                          placeholder={(field as any).placeholder}
                          className="rounded-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Consent Validation */}
            <div className={`p-4 rounded-2xl border space-y-4 ${isRdv ? "bg-purple-500/10 border-purple-500/20" : "bg-primary/10 border-primary/20"}`}>
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isRdv ? "bg-purple-500/20 text-purple-600" : "bg-primary/20 text-primary"}`}>
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {isRdv ? "Garantie de Consentement Renforcé RGPD" : "Garantie de Consentement RGPD"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {isRdv
                      ? "En envoyant ce RDV, vous certifiez avoir recueilli le consentement libre, éclairé et renforcé du prospect pour un rendez-vous de conseil personnalisé avec un professionnel qualifié. Les disponibilités et le canal ont été validés avec le prospect. L'empreinte numérique sera générée automatiquement."
                      : "En envoyant ce lead, vous certifiez avoir recueilli le consentement libre, éclairé et non équivoque du prospect pour être contacté concernant son projet. L'empreinte numérique sera générée automatiquement."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="rounded border-border w-4 h-4"
                  required
                />
                <Label htmlFor="consent" className="text-xs cursor-pointer">
                  {isRdv
                    ? "Je dispose de la preuve de consentement renforcé et j'accepte les conditions de collecte RDV."
                    : "Je dispose de la preuve de consentement et j'accepte le texte de référence."}
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !selectedProduct || (isRdv && product && !product.hasAppointment)}
              className={`w-full rounded-full py-6 text-lg font-bold gap-2 ${isRdv ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isRdv ? (
                <Calendar className="h-5 w-5" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              {loading
                ? "Envoi en cours..."
                : isRdv
                  ? "Envoyer le RDV Qualifié"
                  : "Envoyer le Lead"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    defaultValues: {
      productType: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      city: "",
      price: "",
      isAppointment: false,
      attributes: {} as any,
    }
  });

  const product = PRODUCTS.find(p => p.id === selectedProduct);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          productType: selectedProduct,
          consentText: "Le prospect a donné son consentement explicite pour être recontacté.",
          urlSource: window.location.href,
          price: data.price ? parseFloat(data.price) : (product?.basePrice || 25.0),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      setSubmitted(true);
      reset();
      setSelectedProduct("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <h2 className="text-3xl font-bold">Lead envoyé avec succès !</h2>
        <p className="text-muted-foreground max-w-md">
          Votre lead a été validé et mis en stock. Il sera proposé aux courtiers sous peu.
          Preuve de consentement archivée.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full px-8">
          Envoyer un autre lead
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Injection de Lead</h1>
        <p className="text-muted-foreground">Fournissez les détails du prospect et la preuve de consentement.</p>
      </div>

      <Card className="border-border/50 bg-background/50 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-border/50">
          <CardTitle>Nouveau Lead</CardTitle>
          <CardDescription>Sélectionnez le produit et remplissez les informations obligatoires.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Type de Produit</Label>
                <Controller
                  name="productType"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedProduct(val);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Choisir un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCTS.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Prix de vente (€)</Label>
                <Input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  placeholder={product?.basePrice ? `${product.basePrice.toFixed(2)}` : "25.00"}
                  className="rounded-full"
                />
                <p className="text-xs text-muted-foreground">Prix suggéré: {product?.basePrice ? `${product.basePrice.toFixed(2)}€` : "25.00€"}</p>
              </div>

              <div className="space-y-2">
                <Label>Email du prospect</Label>
                <Input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="email@exemple.com"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  {...register("firstName", { required: true })}
                  placeholder="Jean"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  {...register("lastName", { required: true })}
                  placeholder="Dupont"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  {...register("phone", { required: true })}
                  placeholder="06 00 00 00 00"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Code Postal</Label>
                <Input
                  {...register("zipCode", { required: true })}
                  placeholder="75000"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  {...register("city", { required: true })}
                  placeholder="Paris"
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Dynamic Product Fields */}
            {product && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-6 border-t border-border/50 space-y-6"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Détails du projet {product.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.fields.map(field => (
                    <div key={field.name} className="space-y-2">
                      <Label>{field.label}</Label>
                      {field.type === "select" ? (
                        <Controller
                          name={`attributes.${field.name}`}
                          control={control}
                          render={({ field: selectField }) => (
                            <Select
                              onValueChange={selectField.onChange}
                              value={selectField.value}
                            >
                              <SelectTrigger className="rounded-full">
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((opt: any) => (
                                  <SelectItem
                                    key={typeof opt === 'string' ? opt : opt.value}
                                    value={typeof opt === 'string' ? opt : opt.value}
                                  >
                                    {typeof opt === 'string' ? opt : opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      ) : (
                        <Input
                          {...register(`attributes.${field.name}`)}
                          type={field.type === "number" ? "number" : "text"}
                          placeholder={field.placeholder}
                          className="rounded-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Consent Validation (Critical Section 9) */}
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Garantie de Consentement RGPD</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    En envoyant ce lead, vous certifiez avoir recueilli le consentement libre, éclairé et non équivoque du prospect pour être contacté concernant son projet. L'empreinte numérique sera générée automatiquement.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="rounded border-border w-4 h-4"
                  required
                />
                <Label htmlFor="consent" className="text-xs cursor-pointer">Je dispose de la preuve de consentement et j'accepte le texte de référence.</Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !selectedProduct}
              className="w-full rounded-full py-6 text-lg font-bold gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              {loading ? "Envoi en cours..." : "Envoyer le Lead"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

