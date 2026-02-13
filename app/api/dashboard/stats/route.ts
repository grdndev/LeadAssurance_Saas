import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, credits: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    // Total leads (bought for BROKER, created for PROVIDER)
    const totalLeads = await prisma.lead.count({
      where:
        user.role === "PROVIDER"
          ? { providerId: user.id }
          : { brokerId: user.id },
    });

    // Total leads last month
    const totalLeadsLastMonth = await prisma.lead.count({
      where: {
        ...(user.role === "PROVIDER"
          ? { providerId: user.id }
          : { brokerId: user.id }),
        createdAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo,
        },
      },
    });

    // Recent purchases this month (for BROKER)
    const recentPurchases =
      user.role === "BROKER"
        ? await prisma.lead.count({
            where: {
              brokerId: user.id,
              createdAt: { gte: oneMonthAgo },
            },
          })
        : 0;

    // Recent purchases last month
    const recentPurchasesLastMonth =
      user.role === "BROKER"
        ? await prisma.lead.count({
            where: {
              brokerId: user.id,
              createdAt: {
                gte: twoMonthsAgo,
                lt: oneMonthAgo,
              },
            },
          })
        : 0;

    // Credits (current balance)
    const credits = user.credits;

    // Calculate credits spent this month
    const creditsSpentThisMonth = await prisma.transaction.aggregate({
      where: {
        userId: user.id,
        type: "LEAD_PURCHASE",
        createdAt: { gte: oneMonthAgo },
      },
      _sum: { amount: true },
    });

    // Conversion rate for BROKER (leads purchased that resulted in sales)
    // For simplicity, we'll calculate conversion as sold leads / total leads
    let conversionRate = 0;
    let conversionRateLastMonth = 0;

    if (user.role === "BROKER") {
      const soldLeads = await prisma.lead.count({
        where: {
          brokerId: user.id,
          status: "SOLD",
        },
      });

      const soldLeadsLastMonth = await prisma.lead.count({
        where: {
          brokerId: user.id,
          status: "SOLD",
          createdAt: {
            gte: twoMonthsAgo,
            lt: oneMonthAgo,
          },
        },
      });

      conversionRate = totalLeads > 0 ? (soldLeads / totalLeads) * 100 : 0;
      conversionRateLastMonth =
        totalLeadsLastMonth > 0
          ? (soldLeadsLastMonth / totalLeadsLastMonth) * 100
          : 0;
    }

    // Calculate changes
    const totalLeadsChange =
      totalLeadsLastMonth > 0
        ? ((totalLeads - totalLeadsLastMonth) / totalLeadsLastMonth) * 100
        : totalLeads > 0
        ? 100
        : 0;

    const recentPurchasesChange =
      recentPurchasesLastMonth > 0
        ? recentPurchases - recentPurchasesLastMonth
        : recentPurchases;

    const conversionRateChange = conversionRate - conversionRateLastMonth;

    return NextResponse.json({
      totalLeads: {
        value: totalLeads,
        change: `${totalLeadsChange > 0 ? "+" : ""}${totalLeadsChange.toFixed(1)}%`,
        trend: totalLeadsChange >= 0 ? "up" : "down",
      },
      recentPurchases: {
        value: recentPurchases,
        change: `${recentPurchasesChange > 0 ? "+" : ""}${recentPurchasesChange}`,
        trend: recentPurchasesChange >= 0 ? "up" : "down",
      },
      credits: {
        value: `${credits.toFixed(2)} €`,
        change: `-${Math.abs(creditsSpentThisMonth._sum.amount || 0).toFixed(2)} €`,
        trend: "down",
      },
      conversionRate: {
        value: `${conversionRate.toFixed(1)}%`,
        change: `${conversionRateChange > 0 ? "+" : ""}${conversionRateChange.toFixed(1)}%`,
        trend: conversionRateChange >= 0 ? "up" : "down",
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
