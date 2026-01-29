import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/leads/marketplace
 * Récupère les leads disponibles dans la salle de marché
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const productType = searchParams.get("productType");
        const zipCode = searchParams.get("zipCode");

        const where: any = {
            status: "STOCK",
            isExclusive: false // Seulement les leads non exclusifs en salle de marché
        };

        if (productType && productType !== "all") {
            where.productType = productType;
        }

        if (zipCode) {
            where.zipCode = { startsWith: zipCode };
        }

        const leads = await prisma.lead.findMany({
            where,
            select: {
                id: true,
                productType: true,
                city: true,
                zipCode: true,
                price: true,
                isAppointment: true,
                createdAt: true,
                attributes: true,
                // Ne pas révéler les coordonnées avant l'achat
                firstName: false,
                lastName: false,
                phone: false,
                email: false
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ leads });
    } catch (error) {
        console.error("Error fetching marketplace leads:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/leads/marketplace/reserve
 * Réserve un lead pendant 10 minutes pour finaliser l'achat
 */
export async function POST(request: NextRequest) {
    try {
        const { leadId, brokerId } = await request.json();

        if (!leadId || !brokerId) {
            return NextResponse.json(
                { error: "Missing leadId or brokerId" },
                { status: 400 }
            );
        }

        // Transaction atomique pour éviter les race conditions
        const result = await prisma.$transaction(async (tx) => {
            // Vérifier que le lead est disponible
            const lead = await tx.lead.findUnique({
                where: { id: leadId },
                include: { reservation: true }
            });

            if (!lead || lead.status !== "STOCK") {
                throw new Error("Lead not available");
            }

            if (lead.reservation) {
                throw new Error("Lead already reserved");
            }

            // Réserver le lead
            const reservation = await tx.marketplaceReservation.create({
                data: {
                    leadId,
                    brokerId,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
                }
            });

            // Mettre à jour le statut du lead
            await tx.lead.update({
                where: { id: leadId },
                data: { status: "RESERVED" }
            });

            return { reservation, lead };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error reserving lead:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 400 }
        );
    }
}
