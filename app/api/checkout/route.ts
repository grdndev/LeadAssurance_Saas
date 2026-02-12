import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { amount, bonus } = await req.json();

        if (!amount || amount < 10) {
            return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
        }

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Recharge crédits LeadsAssurance - ${amount}€`,
                            description: `Pack de ${amount}€ + ${bonus}€ de bonus`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?status=success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?status=cancel`,
            metadata: {
                userId: (session.user as any).id,
                amount: amount.toString(),
                bonus: bonus.toString(),
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: "Erreur lors de la création de la session" }, { status: 500 });
    }
}
