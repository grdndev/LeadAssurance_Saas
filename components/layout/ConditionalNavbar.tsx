"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  const { status } = useSession();
  
  // Show navbar on marketplace even if in dashboard path, when not authenticated
  const isMarketplace = pathname === "/dashboard/marketplace";
  const isAuthenticated = status === "authenticated";
  
  if (isMarketplace && !isAuthenticated) {
    return <Navbar />;
  }
  
  // Hide navbar on admin dashboard
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) {
    return null;
  }
  
  // Hide navbar on other dashboard pages (they have their own header)
  const isDashboard = pathname?.startsWith("/dashboard");
  
  if (isDashboard) {
    return null;
  }
  
  return <Navbar />;
}
