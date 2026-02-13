"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Menu, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { NotificationCenter } from "./NotificationCenter";

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userRole = session?.user?.role;

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case "BROKER": return "Courtier";
      case "PROVIDER": return "Apporteur";
      case "ADMIN": return "Admin";
      default: return "";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center gap-8 px-4 lg:px-8">
        {/* Logo - Left */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight shrink-0">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <Link href="/">
            <span>LeadsAssurance<span className="text-primary">.com</span></span>
          </Link>
        </div>

        {/* Navigation - Center */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-1 justify-center">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard/marketplace" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Salle de Marché
              </Link>
              {userRole === "BROKER" && (
                <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Espace Courtier
                </Link>
              )}
              {userRole === "PROVIDER" && (
                <Link href="/dashboard/provider" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Espace Apporteur
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/#produits" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Produits
              </Link>
              <Link href="/tarifs" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Tarifs
              </Link>
              <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Blog
              </Link>
            </>
          )}
        </nav>

        {/* Actions - Right */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn && (
            <div className="relative w-64 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-secondary/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 border border-transparent focus:border-primary/50"
              />
            </div>
          )}
          {isLoggedIn ? (
            <>
              <NotificationCenter />
              <Link href="/settings" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-semibold leading-none">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{getRoleLabel(userRole)}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm transition-all group-hover:ring-2 group-hover:ring-primary/50">
                  {getInitials(session?.user?.name || "")}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Démarrer
                </Button>
              </Link>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
