import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Cron job pour nettoyer les réservations expirées
 * Devrait être appelé toutes les minutes par un service externe (Vercel Cron, etc.)
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET || "dev-secret";

        // Sécurité: vérifier que la requête vient bien du cron
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const now = new Date();

        // Trouver toutes les réservations expirées
        const expiredReservations = await prisma.marketplaceReservation.findMany({
            where: {
                expiresAt: { lt: now }
            },
            include: { lead: true }
        });

        let cleanedCount = 0;

        // Nettoyer chaque réservation expirée
        for (const reservation of expiredReservations) {
            await prisma.$transaction(async (tx) => {
                // Remettre le lead en stock
                await tx.lead.update({
                    where: { id: reservation.leadId },
                    data: { status: "STOCK" }
                });

                // Supprimer la réservation
                await tx.marketplaceReservation.delete({
                    where: { id: reservation.id }
                });

                cleanedCount++;
            });
        }

        return NextResponse.json({
            success: true,
            cleaned: cleanedCount,
            timestamp: now.toISOString()
        });
    } catch (error) {
        console.error("Error in cleanup cron:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
