import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { InvoicePDF } from "@/components/billing/InvoicePDF";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id: transactionId } = await params;

        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { user: true }
        });

        if (!transaction || transaction.type !== "CREDIT_PURCHASE") {
            return NextResponse.json({ error: "Transaction non trouvée" }, { status: 404 });
        }

        if (transaction.userId !== (session.user as any).id && (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const buffer = await renderToBuffer(
            React.createElement(InvoicePDF, {
                transaction: transaction,
                user: transaction.user
            })
        );

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Facture_${transactionId.substring(0, 8)}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Invoice Export error:", error);
        return NextResponse.json({ error: "Erreur lors de la génération de la facture" }, { status: 500 });
    }
}
