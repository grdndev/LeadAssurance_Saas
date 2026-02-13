"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, LogOut, Settings, LayoutDashboard, Users, FileText, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if ((session?.user as any)?.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
            {/* Admin Navigation Header */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl font-bold tracking-tighter">
                        <span className="text-primary">LEADS</span>ASSURANCE
                    </Link>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        <Shield className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
                        </Button>
                    </Link>
                    <Link href="/settings">
                        <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4 mr-2" /> Paramètres
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => signOut({ callbackUrl: "/" })}>
                        <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                    </Button>
                </div>
            </header>

            <main className="p-6">
                {children}
            </main>
        </div>
    );
}
