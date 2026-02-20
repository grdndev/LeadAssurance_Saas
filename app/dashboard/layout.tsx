"use client";

import { useState, useEffect } from "react";
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
  BarChart3,
  Calendar,
  Key,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { NotificationCenter } from "@/components/layout/NotificationCenter";

// Routes that only BROKERs may access
const BROKER_ONLY = ["/dashboard/leads", "/dashboard/appointments", "/dashboard/billing"];
// Routes that only PROVIDERs may access
const PROVIDER_ONLY_PREFIX = "/dashboard/provider";
// Routes shared by all authenticated roles
const SHARED = ["/dashboard/marketplace", "/dashboard/notifications"];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const userRole = (session?.user as any)?.role as string | undefined;

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // ── Role-based redirect ──────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== "authenticated" || !userRole) return;

    const isShared = SHARED.some((s) => pathname?.startsWith(s));
    if (isShared) return;

    if (userRole === "PROVIDER") {
      // Provider landing on /dashboard (broker home) → send to provider home
      if (pathname === "/dashboard") {
        router.replace("/dashboard/provider");
        return;
      }
      // Provider trying to access a broker-only route
      if (BROKER_ONLY.some((r) => pathname?.startsWith(r))) {
        router.replace("/dashboard/provider");
        return;
      }
    }

    if (userRole === "BROKER") {
      // Broker trying to access a provider-only route
      if (pathname?.startsWith(PROVIDER_ONLY_PREFIX)) {
        router.replace("/dashboard");
        return;
      }
    }
  }, [status, userRole, pathname, router]);
  // ─────────────────────────────────────────────────────────────────────────────

  // Nav is based on actual role, not URL
  const isProvider = userRole === "PROVIDER";

  // Check if on marketplace and not authenticated
  const isMarketplace = pathname === "/dashboard/marketplace";
  const isAuthenticated = status === "authenticated";

  // If on marketplace and not authenticated, show simplified layout
  if (isMarketplace && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <main className="p-6 lg:p-10">
          {children}
        </main>
      </div>
    );
  }

  // Show nothing while session resolves (avoids flash of wrong nav)
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const brokerNavigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Salle de Marché", href: "/dashboard/marketplace", icon: ShoppingCart },
    { name: "Mes Leads", href: "/dashboard/leads", icon: Users },
    { name: "Mes RDV", href: "/dashboard/appointments", icon: Calendar },
    { name: "Crédits & Factures", href: "/dashboard/billing", icon: CreditCard },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ];

  const providerNavigation = [
    { name: "Tableau de bord", href: "/dashboard/provider", icon: LayoutDashboard },
    { name: "Envoyer un Lead", href: "/dashboard/provider/submit", icon: Upload },
    { name: "Mes Leads", href: "/dashboard/provider/leads", icon: FileText },
    { name: "Statistiques", href: "/dashboard/provider/stats", icon: BarChart3 },
    { name: "Clés API", href: "/dashboard/provider/apikeys", icon: Key },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ];

  const navigation = isProvider ? providerNavigation : brokerNavigation;

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "??";
  };

  return (
    <div className="min-h-screen bg-secondary/30 text-foreground">
      {/* Backdrop overlay — mobile only, closes sidebar when tapped */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

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

        {/* Admin shortcut */}
        {userRole === "ADMIN" && (
          <div className="px-4 mt-6">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-500 hover:text-red-600 transition-colors border border-dashed border-red-500/30 rounded-lg"
            >
              Administration
            </Link>
          </div>
        )}

        <div className="absolute bottom-0 w-full p-4 border-t border-border">
          <Link
            href="/settings"
            className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary transition-all"
          >
            <Settings className="mr-3 h-5 w-5" />
            Paramètres
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-2 flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
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

            <NotificationCenter />
            <Link href="/settings" className="group flex items-center gap-3 ml-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold leading-none">{session?.user?.name}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase mt-1">{userRole}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg border-2 border-background transition-all group-hover:ring-2 group-hover:ring-primary/50">
                {getInitials(session?.user?.name || "")}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

