import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/leads
 * Récupère les leads en fonction du rôle (broker ou provider)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role"); // "broker" or "provider"
        const userId = searchParams.get("userId");
        const status = searchParams.get("status");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        let leads;

        if (role === "broker") {
            // Leads achetés par le courtier
            const where: any = { brokerId: userId };
            if (status && status !== "all") {
                where.status = status.toUpperCase();
            }

            leads = await prisma.lead.findMany({
                where,
                include: {
                    consent: true,
                    provider: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            });
        } else if (role === "provider") {
            // Leads créés par l'apporteur
            const where: any = { providerId: userId };
            if (status && status !== "all") {
                where.status = status.toUpperCase();
            }

            leads = await prisma.lead.findMany({
                where,
                include: {
                    consent: true,
                    broker: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            });
        } else {
            return NextResponse.json(
                { error: "Invalid role" },
                { status: 400 }
            );
        }

        return NextResponse.json({ leads });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/leads
 * Création d'un nouveau lead par un apporteur
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            providerId,
            productType,
            firstName,
            lastName,
            phone,
            email,
            zipCode,
            city,
            attributes,
            isAppointment,
            price,
            consent
        } = body;

        // Validation des champs obligatoires
        if (!providerId || !productType || !firstName || !lastName || !phone || !email || !zipCode || !city || !consent) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validation du consentement
        if (!consent.consentText || !consent.ipAddress || !consent.userAgent || !consent.urlSource) {
            return NextResponse.json(
                { error: "Invalid consent data" },
                { status: 400 }
            );
        }

        // Créer le hash de preuve (SHA-256)
        const proofString = `${firstName}${lastName}${email}${consent.consentText}${consent.timestamp}${consent.ipAddress}`;
        const proofHash = await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(proofString)
        ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

        // Créer le lead avec consentement
        const lead = await prisma.lead.create({
            data: {
                providerId,
                productType,
                firstName,
                lastName,
                phone,
                email,
                zipCode,
                city,
                attributes,
                isAppointment: isAppointment || false,
                isExclusive: true,
                price,
                status: "STOCK", // Par défaut en stock après validation
                consent: {
                    create: {
                        consentText: consent.consentText,
                        ipAddress: consent.ipAddress,
                        userAgent: consent.userAgent,
                        urlSource: consent.urlSource,
                        timestamp: consent.timestamp || new Date(),
                        proofHash
                    }
                }
            },
            include: { consent: true }
        });

        return NextResponse.json({ lead }, { status: 201 });
    } catch (error) {
        console.error("Error creating lead:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
