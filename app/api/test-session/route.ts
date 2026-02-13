import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  return NextResponse.json({
    authenticated: !!session,
    session: session ? {
      user: {
        email: session.user?.email,
        name: session.user?.name,
        role: (session.user as any)?.role,
      }
    } : null
  });
}
