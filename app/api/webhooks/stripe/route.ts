import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { writeAuditLog } from "@/lib/audit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const credits = parseFloat(session.metadata?.credits || "0");
        const amountHT = (session.amount_total || 0) / 100 / 1.2; // Assuming 20% VAT for now

        console.log(`Webhook received: userId=${userId}, credits=${credits}, amountHT=${amountHT}`);

        if (userId && credits > 0) {
            try {
                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: userId },
                        data: {
                            credits: {
                                increment: credits,
                            },
                        },
                    }),
                    prisma.transaction.create({
                        data: {
                            userId: userId,
                            type: "CREDIT_PURCHASE",
                            amount: amountHT,
                            credits: credits,
                            description: `Recharge de ${credits} crédits`,
                            stripeId: session.id,
                        },
                    }),
                ]);
                writeAuditLog({
                    userId,
                    action: "CREDIT_RECHARGED",
                    entityType: "Transaction",
                    entityId: session.id,
                    details: { credits, amountHT, stripeSessionId: session.id },
                });
                console.log(`✅ Credits and Transaction updated for user ${userId}: ${credits} credits`);
            } catch (error) {
                console.error(`❌ Failed to update credits for user ${userId}:`, error);
                return NextResponse.json({ error: "Database update failed" }, { status: 500 });
            }
        } else {
            console.warn(`⚠️ Invalid webhook data: userId=${userId}, credits=${credits}`);
        }
    }

    return NextResponse.json({ received: true });
}
