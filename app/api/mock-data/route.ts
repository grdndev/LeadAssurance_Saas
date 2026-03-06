import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const productTypes = [
      "CREDIT_IMMO",
      "ASSURANCE_EMPRUNTEUR",
      "MUTUELLE_SANTE_IND",
      "ASSURANCE_AUTO",
      "ASSURANCE_HABITATION",
      "PREVOYANCE_TNS",
      "RC_PRO",
      "RC_DECENNALE",
    ];

    const cities = [
      { city: "Paris", zipCode: "75008" },
      { city: "Lyon", zipCode: "69002" },
      { city: "Marseille", zipCode: "13008" },
      { city: "Toulouse", zipCode: "31000" },
      { city: "Nice", zipCode: "06000" },
      { city: "Nantes", zipCode: "44000" },
      { city: "Strasbourg", zipCode: "67000" },
      { city: "Bordeaux", zipCode: "33000" },
    ];

    const firstnames = ["Jean", "Marie", "Pierre", "Sophie", "Luc", "Anne", "Paul", "Claire"];
    const lastnames = ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand"];

    const createdLeads = [];
    const createdNotifications = [];

    // Create 8-15 random leads (more for "last opportunities")
    const numLeads = Math.floor(Math.random() * 8) + 8;

    for (let i = 0; i < numLeads; i++) {
      const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
      const location = cities[Math.floor(Math.random() * cities.length)];
      const firstname = firstnames[Math.floor(Math.random() * firstnames.length)];
      const lastname = lastnames[Math.floor(Math.random() * lastnames.length)];
      const price = Math.floor(Math.random() * 50) + 20; // 20-70€

      // More STOCK leads for "last opportunities" section
      const status = Math.random() > 0.3 ? "STOCK" : "SOLD";

      // Create leads with varying ages for realistic "last opportunities"
      const daysAgo = Math.floor(Math.random() * 3); // 0-2 days ago
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 24));

      const lead = await prisma.lead.create({
        data: {
          productType,
          status,
          leadType: "LEAD",
          firstname,
          lastname,
          phone: `06${Math.floor(Math.random() * 90000000) + 10000000}`,
          email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@example.com`,
          zipCode: location.zipCode,
          city: location.city,
          attributes: JSON.stringify({
            project: "Test project",
            amount: Math.floor(Math.random() * 100000) + 50000,
          }),
          isExclusive: Math.random() > 0.5,
          price,
          providerId: user.id,
          brokerId: status === "SOLD" ? user.id : null,
          createdAt,
        },
      });

      createdLeads.push(lead);
    }

    // Create 3-5 random notifications
    const notificationTypes = [
      { type: "LEAD_PURCHASED", title: "Lead vendu ! 🎉", getMessage: () => `Votre lead a été acheté pour ${(Math.random() * 50 + 20).toFixed(2)} €` },
      { type: "LEAD_SOLD", title: "Lead acheté avec succès", getMessage: () => `Vous avez acheté un lead pour ${(Math.random() * 50 + 20).toFixed(2)} €` },
      { type: "CREDIT_LOW", title: "Crédits faibles ⚠️", getMessage: () => `Il vous reste ${(Math.random() * 100).toFixed(2)} € de crédits` },
      { type: "LEAD_APPROVED", title: "Lead approuvé ✅", getMessage: () => "Votre lead a été approuvé et est disponible sur la marketplace" },
      { type: "DISPUTE_OPENED", title: "Litige ouvert", getMessage: () => "Un litige a été ouvert sur votre lead" },
    ];

    const numNotifications = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numNotifications; i++) {
      const notif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          type: notif.type,
          title: notif.title,
          message: notif.getMessage(),
          read: Math.random() > 0.5,
          link: Math.random() > 0.5 ? "/dashboard/leads" : undefined,
        },
      });

      createdNotifications.push(notification);
    }

    // Create 3-6 random transactions (purchases and credits)
    const numTransactions = Math.floor(Math.random() * 4) + 3;

    for (let i = 0; i < numTransactions; i++) {
      const transactionType = Math.random() > 0.6 ? "CREDIT_PURCHASE" : "LEAD_PURCHASE";
      const amount = transactionType === "CREDIT_PURCHASE"
        ? Math.floor(Math.random() * 400) + 100  // 100-500€ credit purchase
        : Math.floor(Math.random() * 60) + 20;    // 20-80€ lead purchase

      const daysAgo = Math.floor(Math.random() * 30); // Last 30 days
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: transactionType,
          amount,
          credits: transactionType === "CREDIT_PURCHASE" ? amount : -amount,
          description: transactionType === "CREDIT_PURCHASE"
            ? `Recharge de crédits ${amount.toFixed(2)} €`
            : `Achat lead ${productTypes[Math.floor(Math.random() * productTypes.length)]}`,
          createdAt,
        },
      });
    }

    // Update user credits with a reasonable amount
    const creditAmount = Math.floor(Math.random() * 800) + 200; // 200-1000€
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: creditAmount },
    });

    return NextResponse.json({
      success: true,
      message: "Mock data created successfully",
      stats: {
        leads: createdLeads.length,
        notifications: createdNotifications.length,
        transactions: numTransactions,
      },
    });
  } catch (error) {
    console.error("Error creating mock data:", error);
    return NextResponse.json(
      { error: "Failed to create mock data" },
      { status: 500 }
    );
  }
}
