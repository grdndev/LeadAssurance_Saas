import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const leads = await prisma.lead.findMany({
            where: {
                status: "STOCK",
                // Optionnel: filtrer par produit ou zone via query params
            },
            include: {
                consent: {
                    select: {
                        timestamp: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        // Masquer les infos sensibles avant l'achat
        const sanitizedLeads = leads.map(lead => ({
            id: lead.id,
            productType: lead.productType,
            city: lead.city,
            zipCode: lead.zipCode.substring(0, 2) + "xxx",
            price: lead.price,
            isAppointment: lead.isAppointment,
            isExclusive: lead.isExclusive,
            createdAt: lead.createdAt,
            freshness: lead.createdAt, // Utilsé pour calculer la fraîcheur côté client
        }));

        return NextResponse.json({ leads: sanitizedLeads });
    } catch (error) {
        console.error("Marketplace fetch error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
