"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Upload,
  FileText,
  BarChart3
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Determine if it's a provider or broker dashboard based on URL
  const isProvider = pathname?.includes("/provider");

  const brokerNavigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Salle de Marché", href: "/dashboard/marketplace", icon: ShoppingCart },
    { name: "Mes Leads", href: "/dashboard/leads", icon: Users },
    { name: "Crédits & Factures", href: "/dashboard/billing", icon: CreditCard },
  ];

  const providerNavigation = [
    { name: "Tableau de bord", href: "/dashboard/provider", icon: LayoutDashboard },
    { name: "Envoyer un Lead", href: "/dashboard/provider/submit", icon: Upload },
    { name: "Mes Leads", href: "/dashboard/provider/leads", icon: FileText },
    { name: "Statistiques", href: "/dashboard/provider/stats", icon: BarChart3 },
  ];

  const navigation = isProvider ? providerNavigation : brokerNavigation;

  return (
    <div className="min-h-screen bg-secondary/30 text-foreground">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r border-border transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            <span className="text-primary">LEADS</span>ASSURANCE
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-4 pt-4">
          <div className={`px-3 py-2 rounded-lg text-center text-xs font-semibold ${isProvider
            ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
            : "bg-primary/10 text-primary border border-primary/20"
            }`}>
            {isProvider ? "Espace Apporteur" : "Espace Courtier"}
          </div>
        </div>

        <nav className="mt-6 space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10 hover:text-primary"
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Switch Role */}
        <div className="px-4 mt-6">
          <Link
            href={isProvider ? "/dashboard" : "/dashboard/provider"}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors border border-dashed border-border rounded-lg"
          >
            Basculer vers {isProvider ? "Courtier" : "Apporteur"}
          </Link>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-border">
          <Link
            href="/settings"
            className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary transition-all"
          >
            <Settings className="mr-3 h-5 w-5" />
            Paramètres
          </Link>
          <button className="mt-2 flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
            <LogOut className="mr-3 h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`lg:pl-64 flex flex-col min-h-screen transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-secondary/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 border border-transparent focus:border-primary/50"
              />
            </div>

            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shadow-lg">
              JS
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
