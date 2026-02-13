"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-lg font-bold tracking-tighter">
            <span className="text-primary">LEADS</span>ASSURANCE
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/cgu" className="hover:text-primary transition-colors">
              Conditions Générales
            </Link>
            <Link href="/confidentialite" className="hover:text-primary transition-colors">
              Politique de Confidentialité
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 LeadsAssurance.com. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
