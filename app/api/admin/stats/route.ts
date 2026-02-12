import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const [
            totalUsers,
            activeBrokers,
            activeProviders,
            totalLeads,
            leadsThisMonth,
            totalRevenue,
            leadsSold,
            pendingDisputes
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "BROKER" } }),
            prisma.user.count({ where: { role: "PROVIDER" } }),
            prisma.lead.count(),
            prisma.lead.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            prisma.transaction.aggregate({
                where: { type: "CREDIT_PURCHASE" },
                _sum: { amount: true }
            }),
            prisma.lead.count({ where: { status: "SOLD" } }),
            prisma.dispute.count({ where: { status: "OPEN" } })
        ]);

        return NextResponse.json({
            stats: {
                totalUsers,
                activeBrokers,
                activeProviders,
                totalLeads,
                leadsThisMonth,
                revenue: totalRevenue._sum.amount || 0,
                leadsSold,
                pendingDisputes,
                conversionRate: totalLeads > 0 ? (leadsSold / totalLeads) * 100 : 0
            }
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
