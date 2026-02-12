import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "PENDING_APPROVAL";

        const leads = await prisma.lead.findMany({
            where: { status },
            include: {
                provider: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                consent: true
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ leads });
    } catch (error) {
        console.error("Admin leads error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { leadId, status } = await request.json();

        if (!leadId || !["STOCK", "REJECTED"].includes(status)) {
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: { status }
        });

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error) {
        console.error("Admin lead update error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
