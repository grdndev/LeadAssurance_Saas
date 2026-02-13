import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/users/[id]/credits
 * Récupère le solde de crédits d'un utilisateur
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: { credits: true, email: true, name: true, role: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ credits: user.credits, user });
    } catch (error) {
        console.error("Error fetching credits:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/users/[id]/credits
 * Recharge les crédits d'un utilisateur
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { amount, paymentMethod, paymentIntentId } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            );
        }

        // Dans un vrai système, on vérifierait le paiement Stripe ici
        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        const user = await prisma.user.update({
            where: { id },
            data: { credits: { increment: amount } }
        });

        return NextResponse.json({
            success: true,
            newBalance: user.credits
        });
    } catch (error) {
        console.error("Error adding credits:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
