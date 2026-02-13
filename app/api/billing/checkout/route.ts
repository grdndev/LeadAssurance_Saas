import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { amount } = await req.json(); // Le montant en Euros

        if (!amount || amount < 50) {
            return NextResponse.json({ error: "Le montant minimum est de 50€" }, { status: 400 });
        }

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Recharge de ${amount} crédits LeadsAssurance`,
                            description: "Crédits valables pour l'achat de leads et RDV",
                        },
                        unit_amount: amount * 100, // En centimes
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
            metadata: {
                userId: (session.user as any).id,
                credits: amount.toString(), // Changed from 'amount' to 'credits'
            },
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error: any) {
        console.error("Stripe Checkout error:", error);
        return NextResponse.json({ error: "Erreur lors de la création de la session de paiement" }, { status: 500 });
    }
}
