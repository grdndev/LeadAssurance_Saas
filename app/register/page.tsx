"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2, Users, Upload, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"BROKER" | "PROVIDER">("BROKER");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Auto-login after registration
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInResult?.error) {
        // Fallback: redirect to login if auto-sign-in fails
        router.push("/login?registered=true");
      } else {
        // Role-based redirect
        const session = await getSession();
        const userRole = (session?.user as any)?.role;
        if (userRole === "PROVIDER") {
          router.push("/dashboard/provider");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-6">
          <Link href="/" className="flex justify-center mb-4">
            <div className="text-2xl font-bold tracking-tighter">
              <span className="text-primary">LEADS</span>ASSURANCE
            </div>
          </Link>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez la marketplace de leads assurance & crédit
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("BROKER")}
                className={`p-4 rounded-xl border-2 transition-all ${role === "BROKER"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
                  }`}
              >
                <Users className={`h-6 w-6 mx-auto mb-2 ${role === "BROKER" ? "text-primary" : "text-muted-foreground"}`} />
                <div className={`text-sm font-semibold ${role === "BROKER" ? "text-primary" : ""}`}>Courtier</div>
                <div className="text-xs text-muted-foreground">J'achète des leads</div>
              </button>
              <button
                type="button"
                onClick={() => setRole("PROVIDER")}
                className={`p-4 rounded-xl border-2 transition-all ${role === "PROVIDER"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
                  }`}
              >
                <Upload className={`h-6 w-6 mx-auto mb-2 ${role === "PROVIDER" ? "text-primary" : "text-muted-foreground"}`} />
                <div className={`text-sm font-semibold ${role === "PROVIDER" ? "text-primary" : ""}`}>Apporteur</div>
                <div className="text-xs text-muted-foreground">Je vends des leads</div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Jean"
                  className="rounded-full"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Dupont"
                  className="rounded-full"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@entreprise.com"
                className="rounded-full"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="rounded-full pr-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1 rounded" required />
              <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                J'accepte les{" "}
                <Link href="#" className="text-primary hover:underline">Conditions Générales</Link>
                {" "}et la{" "}
                <Link href="#" className="text-primary hover:underline">Politique de Confidentialité</Link>
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full rounded-full py-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Créer mon compte {role === "BROKER" ? "courtier" : "apporteur"}
                </>
              )}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

