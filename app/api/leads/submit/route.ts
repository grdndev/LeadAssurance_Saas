import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";
import { getProductById } from "@/lib/constants/products";

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
            leadType,
            // Appointment-specific fields
            appointmentChannel,
            appointmentDate,
            availabilities,
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

        // Determine if this is an RDV lead
        const isRdv = leadType === "APPOINTMENT" || !!isAppointment;

        // Validate RDV-specific fields
        if (isRdv) {
            if (!appointmentChannel || !["PHONE", "VISIO"].includes(appointmentChannel)) {
                return NextResponse.json(
                    { error: "Canal de RDV obligatoire (PHONE ou VISIO)" },
                    { status: 400 }
                );
            }
        }

        // Get product to determine price
        const product = getProductById(productType);

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

        // Determine final price
        const finalPrice = price
            ? parseFloat(price)
            : isRdv
                ? (product?.appointmentPrice || 45.0)
                : (product?.basePrice || 25.0);

        const lead = await prisma.lead.create({
            data: {
                productType,
                firstName,
                lastName,
                email,
                phone,
                zipCode,
                city,
                attributes: JSON.stringify(attributes || {}),
                isAppointment: isRdv,
                leadType: isRdv ? "APPOINTMENT" : "LEAD",
                appointmentChannel: isRdv ? appointmentChannel : null,
                appointmentDate: isRdv && appointmentDate ? new Date(appointmentDate) : null,
                appointmentStatus: isRdv ? "PENDING" : null,
                availabilities: isRdv && availabilities ? JSON.stringify(availabilities) : null,
                price: finalPrice,
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

        writeAuditLog({
            userId: (session.user as any).id,
            action: "LEAD_SUBMITTED",
            entityType: "Lead",
            entityId: lead.id,
            details: { productType, price: lead.price, leadType: isRdv ? "APPOINTMENT" : "LEAD" },
            ipAddress,
        });

        return NextResponse.json(
            { message: isRdv ? "RDV créé avec succès" : "Lead créé avec succès", leadId: lead.id },
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

