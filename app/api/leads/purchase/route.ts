import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/leads/purchase
 * Finalise l'achat d'un lead réservé
 */
export async function POST(request: NextRequest) {
    try {
        const { leadId, brokerId, paymentMethod } = await request.json();

        if (!leadId || !brokerId || !paymentMethod) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            // Vérifier la réservation
            const reservation = await tx.marketplaceReservation.findUnique({
                where: { leadId },
                include: { lead: true }
            });

            if (!reservation) {
                throw new Error("No reservation found");
            }

            if (reservation.brokerId !== brokerId) {
                throw new Error("Unauthorized - not your reservation");
            }

            if (new Date() > reservation.expiresAt) {
                throw new Error("Reservation expired");
            }

            const lead = reservation.lead;

            // Vérifier les crédits du courtier
            const broker = await tx.user.findUnique({
                where: { id: brokerId }
            });

            if (!broker) {
                throw new Error("Broker not found");
            }

            if (paymentMethod === "credits") {
                if (broker.credits < lead.price) {
                    throw new Error("Insufficient credits");
                }

                // Débiter les crédits
                await tx.user.update({
                    where: { id: brokerId },
                    data: { credits: { decrement: lead.price } }
                });

                // Créditer l'apporteur (50% du prix)
                await tx.user.update({
                    where: { id: lead.providerId },
                    data: { credits: { increment: lead.price * 0.5 } }
                });
            }

            // Finaliser la vente
            await tx.lead.update({
                where: { id: leadId },
                data: {
                    status: "SOLD",
                    brokerId
                }
            });

            // Supprimer la réservation
            await tx.marketplaceReservation.delete({
                where: { leadId }
            });

            // Retourner le lead complet avec coordonnées
            const purchasedLead = await tx.lead.findUnique({
                where: { id: leadId },
                include: { consent: true }
            });

            return { lead: purchasedLead };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error purchasing lead:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 400 }
        );
    }
}
