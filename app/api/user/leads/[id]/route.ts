import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/user/leads/[id] — get a single purchased lead with full details
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id } = await params;

        const lead = await prisma.lead.findUnique({
            where: { id },
            include: {
                consent: true,
                provider: {
                    select: { id: true, name: true, email: true, companyName: true },
                },
            },
        });

        if (!lead) {
            return NextResponse.json({ error: "Lead non trouvé" }, { status: 404 });
        }

        // Brokers can only see their own purchased leads
        if ((session.user as any).role === "BROKER" && lead.brokerId !== (session.user as any).id) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        // Providers can only see their own submitted leads
        if ((session.user as any).role === "PROVIDER" && lead.providerId !== (session.user as any).id) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error("Fetch lead error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
