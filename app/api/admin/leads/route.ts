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
        const all = searchParams.get("all") ?? false;
        var leads = [];

        if (all) {
            leads = await prisma.lead.findMany({
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
        } else {
            leads = await prisma.lead.findMany({
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
        }

        return NextResponse.json({ leads });
    } catch (error) {
        console.error("Admin leads error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { leadId } = await req.json();
        if (!leadId) return NextResponse.json({ error: "ID requis" }, { status: 400 });

        const lead = await prisma.lead.findFirst({
            where: { id: leadId },
            include: { consent: true }
        });

        if (!lead) return NextResponse.json({ error: "Lead introuvable" }, { status: 404 });

        if (lead.consent) {
            await prisma.consent.delete({
                where: { id: lead.consent.id, leadId: lead.id }
            })
        }

        await prisma.lead.delete({
            where: { id: leadId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Lead Delete error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
