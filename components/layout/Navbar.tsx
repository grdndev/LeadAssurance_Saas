import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>LeadsAssurance<span className="text-primary">.com</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/marketplace" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Salle de Marché
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Espace Courtier
          </Link>
          <Link href="/provider" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Espace Apporteur
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            Connexion
          </Button>
          <Button size="sm">
            Démarrer
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
