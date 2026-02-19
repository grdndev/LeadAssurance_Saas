import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import { writeAuditLog } from "@/lib/audit";

/**
 * POST /api/v1/leads
 * Public API endpoint for providers — authenticated via Bearer API key.
 * Same logic as /api/leads/submit but no session required.
 *
 * Headers:
 *   Authorization: Bearer la_xxxxx
 *
 * Body: same as /api/leads/submit
 */
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "API key manquante (Authorization: Bearer <key>)" }, { status: 401 });
        }
        const rawKey = authHeader.slice(7);
        const hashedKey = createHash("sha256").update(rawKey).digest("hex");

        // Look up the key
        const apiKey = await prisma.apiKey.findFirst({
            where: { key: hashedKey, active: true },
            include: { user: { select: { id: true, role: true } } },
        });

        if (!apiKey) {
            return NextResponse.json({ error: "Clé API invalide ou révoquée" }, { status: 401 });
        }

        if (apiKey.user.role !== "PROVIDER") {
            return NextResponse.json({ error: "Cette clé n'appartient pas à un compte apporteur" }, { status: 403 });
        }

        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            return NextResponse.json({ error: "Clé API expirée" }, { status: 401 });
        }

        // Update lastUsedAt non-blocking
        prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(() => {});

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

        if (!productType || !firstName || !lastName || !email || !phone || !consentText) {
            return NextResponse.json({ error: "Champs obligatoires manquants: productType, firstName, lastName, email, phone, consentText" }, { status: 400 });
        }

        const ipAddress = req.headers.get("x-forwarded-for") || "0.0.0.0";
        const userAgent = req.headers.get("user-agent") || "api-client";
        const timestamp = new Date().toISOString();

        const proofString = `${firstName}${lastName}${email}${consentText}${timestamp}${ipAddress}`;
        const proofHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(proofString))
            .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join(""));

        const lead = await prisma.lead.create({
            data: {
                productType,
                firstName,
                lastName,
                email,
                phone,
                zipCode: zipCode || "",
                city: city || "",
                attributes: JSON.stringify(attributes || {}),
                isAppointment: !!isAppointment,
                price: price || 25.0,
                providerId: apiKey.user.id,
                consent: {
                    create: {
                        consentText,
                        ipAddress,
                        userAgent,
                        urlSource: urlSource || req.headers.get("referer") || "api",
                        proofHash,
                    },
                },
            },
        });

        writeAuditLog({
            userId: apiKey.user.id,
            action: "LEAD_SUBMITTED",
            entityType: "Lead",
            entityId: lead.id,
            details: { productType, price: lead.price, source: "api_key", apiKeyId: apiKey.id },
            ipAddress,
        });

        return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
    } catch (error) {
        console.error("API v1 lead submit error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
