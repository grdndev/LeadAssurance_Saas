import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/leads/import
 * Importe des leads en masse via CSV
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const providerId = formData.get("providerId") as string;

        if (!file || !providerId) {
            return NextResponse.json(
                { error: "Missing file or providerId" },
                { status: 400 }
            );
        }

        const text = await file.text();
        const lines = text.split("\n").filter(line => line.trim());

        if (lines.length < 2) {
            return NextResponse.json(
                { error: "CSV file is empty or invalid" },
                { status: 400 }
            );
        }

        const headers = lines[0].split(",").map(h => h.trim());
        const results = {
            total: lines.length - 1,
            accepted: 0,
            rejected: 0,
            errors: [] as any[]
        };

        for (let i = 1; i < lines.length; i++) {
            try {
                const values = lines[i].split(",").map(v => v.trim());
                const row: any = {};
                headers.forEach((header, idx) => {
                    row[header] = values[idx];
                });

                // Validation basique
                if (!row.productType || !row.firstName || !row.lastName ||
                    !row.phone || !row.email || !row.zipCode || !row.city) {
                    results.rejected++;
                    results.errors.push({ line: i + 1, error: "Missing required fields" });
                    continue;
                }

                // Validation du consentement
                if (!row.consentText || !row.ipAddress) {
                    results.rejected++;
                    results.errors.push({ line: i + 1, error: "Missing consent data" });
                    continue;
                }

                // Parser les attributes JSON si présent
                let attributes = {};
                try {
                    attributes = row.attributes ? JSON.parse(row.attributes) : {};
                } catch {
                    attributes = {};
                }

                // Créer le hash de preuve
                const proofString = `${row.firstName}${row.lastName}${row.email}${row.consentText}${Date.now()}${row.ipAddress}`;
                const proofHash = await crypto.subtle.digest(
                    'SHA-256',
                    new TextEncoder().encode(proofString)
                ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

                // Créer le lead
                await prisma.lead.create({
                    data: {
                        providerId,
                        productType: row.productType,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        phone: row.phone,
                        email: row.email,
                        zipCode: row.zipCode,
                        city: row.city,
                        attributes,
                        isAppointment: row.isAppointment === "true" || row.isAppointment === "1",
                        isExclusive: true,
                        price: parseFloat(row.price) || 50,
                        status: "STOCK",
                        consent: {
                            create: {
                                consentText: row.consentText,
                                ipAddress: row.ipAddress,
                                userAgent: row.userAgent || "CSV Import",
                                urlSource: row.urlSource || "CSV Import",
                                timestamp: new Date(),
                                proofHash
                            }
                        }
                    }
                });

                results.accepted++;
            } catch (error: any) {
                results.rejected++;
                results.errors.push({ line: i + 1, error: error.message });
            }
        }

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Error importing leads:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
