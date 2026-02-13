import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Get all transactions
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        // Calculate total budget (all purchases)
        const totalBudget = transactions
            .filter(t => t.type === "LEAD_PURCHASE")
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate monthly usage
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyUsage = transactions
            .filter(t => {
                const transactionDate = new Date(t.createdAt);
                return t.type === "LEAD_PURCHASE" && transactionDate >= startOfMonth;
            })
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate total credits purchased
        const totalCreditsPurchased = transactions
            .filter(t => t.type === "CREDIT_PURCHASE")
            .reduce((sum, t) => sum + t.amount, 0);

        return NextResponse.json({
            totalBudget,
            monthlyUsage,
            totalCreditsPurchased,
            transactionCount: transactions.length
        });
    } catch (error) {
        console.error("Billing stats error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
