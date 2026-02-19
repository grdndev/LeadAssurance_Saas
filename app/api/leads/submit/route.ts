import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "PROVIDER") {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            productType,
            firstName,
            lastName,
            email,
            phone,
            zipCode,
            city,
            attributes,
            isAppointment,
            price,
            consentText,
            urlSource,
        } = body;

        // Validation basique
        if (!productType || !firstName || !lastName || !email || !phone || !consentText) {
            return NextResponse.json(
                { error: "Données obligatoires manquantes" },
                { status: 400 }
            );
        }

        // Récupérer les infos client pour le consentement
        const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const userAgent = req.headers.get("user-agent") || "unknown";
        const timestamp = new Date().toISOString();

        // Créer le hash de preuve (SHA-256)
        const proofString = `${firstName}${lastName}${email}${consentText}${timestamp}${ipAddress}`;
        const proofHash = await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(proofString)
        ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

        const lead = await prisma.lead.create({
            data: {
                productType,
                firstName,
                lastName,
                email,
                phone,
                zipCode,
                city,
                attributes: JSON.stringify(attributes),
                isAppointment: !!isAppointment,
                price: price || 25.0, // Default price if not provided
                providerId: (session.user as any).id,
                consent: {
                    create: {
                        consentText,
                        ipAddress,
                        userAgent,
                        urlSource: urlSource || "manual_injection",
                        proofHash,
                    },
                },
            },
        });

        return NextResponse.json(
            { message: "Lead créé avec succès", leadId: lead.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Lead submission error:", error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la création du lead" },
            { status: 500 }
        );
    }
}
