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
import { CheckCircle2, ShieldCheck, Send, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

export default function SubmitLeadPage() {
  const [selectedProduct, setSelectedProduct] = useState("");
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

