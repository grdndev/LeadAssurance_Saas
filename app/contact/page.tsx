"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Contactez-nous</h1>
            <p className="text-lg text-muted-foreground">
              Une question ? Un besoin d'information ? Notre équipe est à votre écoute.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="mailto:contact@leadsassurance.com" className="text-primary hover:underline">
                    contact@leadsassurance.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Réponse sous 24h ouvrées
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Téléphone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="tel:+33123456789" className="text-primary hover:underline">
                    +33 1 23 45 67 89
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lun-Ven : 9h-18h
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Adresse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <address className="not-italic text-sm">
                    LeadsAssurance.com<br />
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris<br />
                    France
                  </address>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 shadow-2xl">
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Jean Dupont"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="jean.dupont@exemple.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Objet de votre demande"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Décrivez votre demande en détail..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full rounded-full py-6" 
                      disabled={loading}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? "Envoi en cours..." : "Envoyer le message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Questions Fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Comment puis-je acheter des leads ?</h3>
                  <p className="text-sm text-muted-foreground">
                    Créez un compte courtier, rechargez vos crédits, puis accédez à notre marketplace pour acheter des leads qualifiés selon vos critères.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quelle est la conformité RGPD des leads ?</h3>
                  <p className="text-sm text-muted-foreground">
                    Tous nos leads sont accompagnés d'une preuve de consentement RGPD incluant l'horodatage, l'IP et l'URL source.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Comment devenir apporteur d'affaires ?</h3>
                  <p className="text-sm text-muted-foreground">
                    Inscrivez-vous en tant qu'apporteur avec votre numéro SIRET, soumettez vos leads et commencez à générer des revenus immédiatement.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quels sont vos délais de réponse ?</h3>
                  <p className="text-sm text-muted-foreground">
                    Nous répondons à toutes les demandes dans un délai de 24h ouvrées maximum. Pour les urgences, n'hésitez pas à nous appeler.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
