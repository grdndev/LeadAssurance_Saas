import { prisma } from "./prisma";
import { sseClients } from "./sse";

export type NotificationType =
  | "LEAD_PURCHASED"
  | "LEAD_SOLD"
  | "CREDIT_LOW"
  | "DISPUTE_OPENED"
  | "LEAD_APPROVED"
  | "LEAD_REJECTED";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
      },
    });

    // Push to any live SSE connections for this user (non-blocking)
    sseClients.send(params.userId, "notification", notification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

/**
 * Notify a provider when their lead is purchased
 */
export async function notifyLeadPurchased(
  providerId: string,
  leadId: string,
  productType: string,
  price: number
) {
  return createNotification({
    userId: providerId,
    type: "LEAD_PURCHASED",
    title: "Lead vendu ! 🎉",
    message: `Votre lead ${productType} a été acheté pour ${price.toFixed(2)} €`,
    link: `/dashboard/provider/leads`,
  });
}

/**
 * Notify a broker when they purchase a lead
 */
export async function notifyLeadSold(
  brokerId: string,
  leadId: string,
  productType: string,
  price: number
) {
  return createNotification({
    userId: brokerId,
    type: "LEAD_PURCHASED",
    title: "Lead acheté avec succès",
    message: `Vous avez acheté un lead ${productType} pour ${price.toFixed(2)} €`,
    link: `/dashboard/leads`,
  });
}

/**
 * Notify user when credits are low
 */
export async function notifyCreditLow(userId: string, remainingCredits: number) {
  return createNotification({
    userId,
    type: "CREDIT_LOW",
    title: "Crédits faibles ⚠️",
    message: `Il vous reste ${remainingCredits.toFixed(2)} € de crédits. Rechargez votre compte pour continuer à acheter des leads.`,
    link: `/dashboard/billing`,
  });
}

/**
 * Notify when a dispute is opened on a lead
 */
export async function notifyDisputeOpened(
  providerId: string,
  leadId: string,
  productType: string
) {
  return createNotification({
    userId: providerId,
    type: "DISPUTE_OPENED",
    title: "Litige ouvert",
    message: `Un litige a été ouvert sur votre lead ${productType}`,
    link: `/dashboard/provider/leads`,
  });
}

/**
 * Notify provider when lead is approved
 */
export async function notifyLeadApproved(
  providerId: string,
  leadId: string,
  productType: string
) {
  return createNotification({
    userId: providerId,
    type: "LEAD_APPROVED",
    title: "Lead approuvé ✅",
    message: `Votre lead ${productType} a été approuvé et est maintenant disponible sur la marketplace`,
    link: `/dashboard/provider/leads`,
  });
}

/**
 * Notify provider when lead is rejected
 */
export async function notifyLeadRejected(
  providerId: string,
  leadId: string,
  productType: string,
  reason?: string
) {
  return createNotification({
    userId: providerId,
    type: "LEAD_REJECTED",
    title: "Lead rejeté ❌",
    message: reason
      ? `Votre lead ${productType} a été rejeté. Raison: ${reason}`
      : `Votre lead ${productType} a été rejeté`,
    link: `/dashboard/provider/leads`,
  });
}
