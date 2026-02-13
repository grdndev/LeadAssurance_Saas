"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Users,
  CreditCard,
  Upload,
  BarChart3,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
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
    <div className={cn("pb-12 min-h-screen border-r bg-muted/40", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {isProvider ? "Espace Apporteur" : "Espace Courtier"}
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Compte
          </h2>
          <div className="space-y-1">
            {userRole === "ADMIN" && (
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start text-red-500">
                  <Shield className="mr-2 h-4 w-4" />
                  Administration
                </Button>
              </Link>
            )}
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
