"use client";

import { Settings, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SettingsLayout({ children }: { children: React.ReactNode; }) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if ((status ?? null) !== "authenticated") {
            router.push("/login");
        }
    }, []);

    if ((status ?? null) !== "authenticated") {
        return null;
    }

    return (
        <div className="min-h-screen bg-secondary/30 text-foreground">
            {/* Simple Header */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 lg:px-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <span className="font-bold">Paramètres</span>
                    </div>
                </div>
                <Link href="/" className="text-xl font-bold tracking-tighter">
                    <span className="text-primary">LEADS</span>ASSURANCE
                </Link>
            </header>

            <main className="p-6 lg:p-10">
            {children}
            </main>
        </div>
    );
}
