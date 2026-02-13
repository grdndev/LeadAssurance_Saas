"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on dashboard pages (they have their own header)
  const isDashboard = pathname?.startsWith("/dashboard");
  
  if (isDashboard) {
    return null;
  }
  
  return <Navbar />;
}
