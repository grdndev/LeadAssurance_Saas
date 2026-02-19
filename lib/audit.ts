import { prisma } from "./prisma";

export type AuditAction =
    | "LEAD_APPROVED"
    | "LEAD_REJECTED"
    | "LEAD_PURCHASED"
    | "LEAD_SUBMITTED"
    | "BROKER_STATUS_CHANGED"
    | "CREDIT_RECHARGED"
    | "DISPUTE_OPENED"
    | "DISPUTE_RESOLVED"
    | "USER_REGISTERED";

/**
 * Write an immutable audit log entry.
 * Call this after any significant state change.
 */
export async function writeAuditLog({
    userId,
    action,
    entityType,
    entityId,
    details,
    ipAddress,
}: {
    userId?: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    details?: Record<string, any>;
    ipAddress?: string;
}) {
    try {
        await prisma.auditLog.create({
            data: {
                userId: userId || null,
                action,
                entityType,
                entityId,
                details: details ? JSON.stringify(details) : null,
                ipAddress: ipAddress || null,
            },
        });
    } catch (error) {
        // Audit log failures must never block the main flow
        console.error("AuditLog write error:", error);
    }
}
