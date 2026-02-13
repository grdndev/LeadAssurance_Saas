import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/Footer";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadsAssurance.com | Marketplace de Leads & RDV Qualifiés",
  description: "La plateforme de référence pour les courtiers en assurance et crédit. leads qualifiés, rendez-vous conformes RGPD et salle de marché transparente.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ConditionalNavbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>

    </html>
  );
}
