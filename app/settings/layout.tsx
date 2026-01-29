"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, ArrowLeft } from "lucide-react";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
