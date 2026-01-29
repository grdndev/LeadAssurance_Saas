import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  Settings, 
  LogOut,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 min-h-screen border-r bg-muted/40", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Espace Courtier
          </h2>
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button variant="secondary" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </Button>
            </Link>
            <Link href="/dashboard/marketplace">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Salle de Marché
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">New</span>
              </Button>
            </Link>
            <Link href="/dashboard/leads">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Mes Leads
              </Button>
            </Link>
            <Link href="/dashboard/invoices">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Factures
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Compte
          </h2>
          <div className="space-y-1">
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
