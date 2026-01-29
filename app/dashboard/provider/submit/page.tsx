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
import { CheckCircle2, ShieldCheck, Send } from "lucide-react";

export default function SubmitLeadPage() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const product = PRODUCTS.find(p => p.id === selectedProduct);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Type de Produit</Label>
                <Select onValueChange={setSelectedProduct}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="Choisir un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Email du prospect</Label>
                <Input placeholder="email@exemple.com" className="rounded-full" required />
              </div>

              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input placeholder="Jean" className="rounded-full" required />
              </div>

              <div className="space-y-2">
                <Label>Nom</Label>
                <Input placeholder="Dupont" className="rounded-full" required />
              </div>

              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input placeholder="06 00 00 00 00" className="rounded-full" required />
              </div>

              <div className="space-y-2">
                <Label>Code Postal</Label>
                <Input placeholder="75000" className="rounded-full" required />
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
                        <Select>
                          <SelectTrigger className="rounded-full">
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt: any) => (
                              <SelectItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                                {typeof opt === 'string' ? opt : opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
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
                <input type="checkbox" id="consent" className="rounded border-border" required />
                <Label htmlFor="consent" className="text-xs">Je dispose de la preuve de consentement et j'accepte le texte de référence.</Label>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full py-6 text-lg font-bold gap-2">
              <Send className="h-5 w-5" /> Envoyer le Lead
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
