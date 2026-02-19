import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = "LeadsAssurance <noreply@leadsassurance.com>";

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    if (!resend) {
        console.log("Mock Email Sent:");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${html.substring(0, 100)}...`);
        return { success: true, mock: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Email error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email exception:", error);
        return { success: false, error };
    }
};

export const emailTemplates = {
    leadSale: (providerName: string, productType: string, price: number) => ({
        subject: "🎉 Votre lead a été vendu !",
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Bonne nouvelle, ${providerName} !</h2>
                <p>Votre lead <strong>${productType}</strong> vient d'être acheté par un courtier.</p>
                <p>Votre commission de <strong>${(price / 2).toFixed(2)}€</strong> a été ajoutée à votre solde.</p>
                <br/>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/provider" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; rounded: 5px;">Voir mon dashboard</a>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">L'équipe LeadsAssurance</p>
            </div>
        `
    }),
    leadPurchase: (brokerName: string, productType: string) => ({
        subject: "🛒 Confirmation d'achat de lead",
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Merci pour votre achat, ${brokerName} !</h2>
                <p>Vous avez maintenant accès aux coordonnées du lead : <strong>${productType}</strong>.</p>
                <p>Retrouvez tous les détails et la preuve de consentement dans votre espace client.</p>
                <br/>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/leads" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; rounded: 5px;">Accéder à mes leads</a>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">L'équipe LeadsAssurance</p>
            </div>
        `
    }),
    creditReload: (userName: string, amount: number, credits: number) => ({
        subject: "💳 Confirmation de recharge",
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Votre compte a été crédité</h2>
                <p>Bonjour ${userName},</p>
                <p>Votre recharge de <strong>${amount}€</strong> pour <strong>${credits} crédits</strong> a bien été prise en compte.</p>
                <p>Votre nouveau solde est disponible immédiatement sur votre dashboard.</p>
                <br/>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">L'équipe LeadsAssurance</p>
            </div>
        `
    }),
    appointmentPurchased: (brokerName: string, productType: string, appointmentDate: string | null, appointmentChannel: string | null) => ({
        subject: "📅 Confirmation d'achat de RDV qualifié",
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #7c3aed;">Votre RDV qualifié est confirmé, ${brokerName} !</h2>
                <p>Vous avez acquis un rendez-vous qualifié pour le produit : <strong>${productType}</strong>.</p>
                ${appointmentDate ? `<p>📅 Date souhaitée : <strong>${new Date(appointmentDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</strong></p>` : ""}
                ${appointmentChannel ? `<p>📞 Canal : <strong>${appointmentChannel === "PHONE" ? "Téléphone" : "Visioconférence"}</strong></p>` : ""}
                <p>Retrouvez les coordonnées complètes du prospect et la preuve de consentement dans votre espace RDV.</p>
                <br/>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/appointments" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir mes RDV</a>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">L'équipe LeadsAssurance</p>
            </div>
        `
    }),
    appointmentSold: (providerName: string, productType: string, price: number) => ({
        subject: "🎉 Votre RDV a été vendu !",
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #7c3aed;">Excellente nouvelle, ${providerName} !</h2>
                <p>Votre rendez-vous qualifié <strong>${productType}</strong> vient d'être acheté par un courtier.</p>
                <p>Votre commission de <strong>${(price / 2).toFixed(2)}€</strong> a été ajoutée à votre solde.</p>
                <br/>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/provider" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir mon dashboard</a>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">L'équipe LeadsAssurance</p>
            </div>
        `
    }),
    appointmentStatusChanged: (recipientName: string, newStatus: string, productType: string) => {
        const statusLabel = newStatus === "CONFIRMED" ? "confirmé ✅" : "annulé ❌";
        const statusColor = newStatus === "CONFIRMED" ? "#16a34a" : "#dc2626";
        return {
            subject: `📅 Statut RDV mis à jour : ${newStatus === "CONFIRMED" ? "Confirmé" : "Annulé"}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: ${statusColor};">RDV ${statusLabel}</h2>
                    <p>Bonjour ${recipientName},</p>
                    <p>Le statut de votre rendez-vous qualifié <strong>${productType}</strong> a été mis à jour : <strong>${statusLabel}</strong>.</p>
                    <br/>
                    <a href="${process.env.NEXTAUTH_URL}/dashboard/appointments" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir mes RDV</a>
                    <p style="margin-top: 30px; font-size: 12px; color: #666;">L'équipe LeadsAssurance</p>
                </div>
            `
        };
    }
};
