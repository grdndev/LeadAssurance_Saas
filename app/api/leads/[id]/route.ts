import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
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
            },
        });

        if (!lead) {
            return NextResponse.json({ error: "Lead non trouvé" }, { status: 404 });
        }

        // Vérifier que le courtier a bien acheté ce lead (sauf admin)
        if (
            (session.user as any).role !== "ADMIN" &&
            lead.brokerId !== (session.user as any).id &&
            lead.providerId !== (session.user as any).id
        ) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error("Fetch lead for PDF error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const lead = await prisma.lead.findUnique({
            where: { id },
        });

        if (!lead) {
            return NextResponse.json({ error: "Lead non trouvé" }, { status: 404 });
        }

        // Only the provider who created the lead can edit it, and only if it's pending
        if (lead.providerId !== (session.user as any).id) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        if (lead.status !== "PENDING_APPROVAL" && lead.status !== "PENDING") {
            return NextResponse.json({ error: "Seuls les leads en attente peuvent être modifiés" }, { status: 400 });
        }

        // Whitelist of editable fields
        const allowedFields = ["firstName", "lastName", "phone", "email", "zipCode", "city"];
        const data: Record<string, string> = {};

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        }

        const updated = await prisma.lead.update({
            where: { id },
            data,
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update lead error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
