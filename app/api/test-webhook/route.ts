import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Test endpoint to simulate Stripe webhook credit purchase
 * Usage: POST /api/test-webhook
 * Body: { "userId": "your-user-id", "credits": 100 }
 */
export async function POST(req: Request) {
    try {
        const { userId, credits } = await req.json();

        if (!userId || !credits) {
            return NextResponse.json(
                { error: "userId and credits are required" },
                { status: 400 }
            );
        }

        const creditsNum = parseFloat(credits);
        const amountHT = creditsNum * 0.83; // Simulating amount with VAT

        console.log(`🧪 Test webhook: userId=${userId}, credits=${creditsNum}`);

        // Simulate the exact same logic as the real webhook
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: {
                    credits: {
                        increment: creditsNum,
                    },
                },
            }),
            prisma.transaction.create({
                data: {
                    userId: userId,
                    type: "CREDIT_PURCHASE",
                    amount: amountHT,
                    credits: creditsNum,
                    description: `TEST: Recharge de ${creditsNum} crédits`,
                    stripeId: `test_${Date.now()}`,
                },
            }),
        ]);

        console.log(`✅ Test credits added for user ${userId}: ${creditsNum} credits`);

        return NextResponse.json({
            success: true,
            message: `Added ${creditsNum} credits to user ${userId}`,
        });
    } catch (error: any) {
        console.error(`❌ Test webhook failed:`, error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
