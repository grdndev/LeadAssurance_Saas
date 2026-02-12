import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    // Check for Vercel Cron header to secure it
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const now = new Date();

        // 1. Trouver les réservations expirées
        const expiredReservations = await prisma.marketplaceReservation.findMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
            include: {
                lead: true,
            }
        });

        if (expiredReservations.length === 0) {
            return NextResponse.json({ message: "Aucune réservation à expirer" });
        }

        // 2. Libérer les leads et supprimer les réservations
        const result = await prisma.$transaction(async (tx) => {
            const leadIds = expiredReservations.map(r => r.leadId);

            // Update leads back to STOCK
            await tx.lead.updateMany({
                where: {
                    id: { in: leadIds },
                    status: "RESERVED",
                },
                data: {
                    status: "STOCK",
                }
            });

            // Delete reservations
            await tx.marketplaceReservation.deleteMany({
                where: {
                    id: { in: expiredReservations.map(r => r.id) }
                }
            });

            return leadIds.length;
        });

        return NextResponse.json({
            message: `${result} réservations expirées ont été traitées.`,
            timestamp: now.toISOString()
        });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: "Erreur lors du traitement cron" }, { status: 500 });
    }
}
