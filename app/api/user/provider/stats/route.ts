import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "PROVIDER") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const providerId = (session.user as any).id;

        const [
            totalLeads,
            acceptedLeads,
            soldLeads,
            pendingLeads,
            totalEarnings
        ] = await Promise.all([
            prisma.lead.count({ where: { providerId } }),
            prisma.lead.count({ where: { providerId, status: { in: ["STOCK", "SOLD"] } } }),
            prisma.lead.count({ where: { providerId, status: "SOLD" } }),
            prisma.lead.count({ where: { providerId, status: "PENDING_APPROVAL" } }),
            prisma.transaction.aggregate({
                where: { userId: providerId, type: "LEAD_SALE" },
                _sum: { amount: true }
            })
        ]);

        // Recent leads for the dashboard
        const recentLeads = await prisma.lead.findMany({
            where: { providerId },
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                productType: true,
                city: true,
                status: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            stats: {
                totalLeads,
                acceptedLeads,
                soldLeads,
                pendingLeads,
                earnings: totalEarnings._sum.amount || 0,
                acceptanceRate: totalLeads > 0 ? (acceptedLeads / totalLeads) * 100 : 0,
                conversionRate: acceptedLeads > 0 ? (soldLeads / acceptedLeads) * 100 : 0
            },
            recentLeads
        });
    } catch (error) {
        console.error("Provider stats error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
