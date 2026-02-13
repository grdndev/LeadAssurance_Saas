import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedNotifications() {
  console.log("🌱 Seeding notifications...");

  // Get all users
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    console.log("❌ No users found. Please run the main seed first.");
    return;
  }

  // Find a broker and provider
  const broker = users.find((u) => u.role === "BROKER");
  const provider = users.find((u) => u.role === "PROVIDER");

  if (!broker) {
    console.log("⚠️  No broker found, skipping broker notifications");
  } else {
    // Create notifications for broker
    await prisma.notification.createMany({
      data: [
        {
          userId: broker.id,
          type: "LEAD_PURCHASED",
          title: "Lead acheté avec succès",
          message: "Vous avez acheté un lead Assurance Auto pour 45.00 €",
          link: "/dashboard/leads",
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          userId: broker.id,
          type: "LEAD_PURCHASED",
          title: "Lead acheté avec succès",
          message: "Vous avez acheté un lead Crédit Immobilier pour 55.00 €",
          link: "/dashboard/leads",
          read: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
        {
          userId: broker.id,
          type: "CREDIT_LOW",
          title: "Crédits faibles ⚠️",
          message: "Il vous reste 85.50 € de crédits. Rechargez votre compte pour continuer à acheter des leads.",
          link: "/dashboard/billing",
          read: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        },
      ],
    });
    console.log(`✅ Created 3 notifications for broker ${broker.email}`);
  }

  if (!provider) {
    console.log("⚠️  No provider found, skipping provider notifications");
  } else {
    // Create notifications for provider
    await prisma.notification.createMany({
      data: [
        {
          userId: provider.id,
          type: "LEAD_SOLD",
          title: "Lead vendu ! 🎉",
          message: "Votre lead Assurance Habitation a été acheté pour 35.00 €",
          link: "/dashboard/provider/leads",
          read: false,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        },
        {
          userId: provider.id,
          type: "LEAD_APPROVED",
          title: "Lead approuvé ✅",
          message: "Votre lead RC Pro a été approuvé et est maintenant disponible sur la marketplace",
          link: "/dashboard/provider/leads",
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          userId: provider.id,
          type: "LEAD_SOLD",
          title: "Lead vendu ! 🎉",
          message: "Votre lead Mutuelle Santé a été acheté pour 28.00 €",
          link: "/dashboard/provider/leads",
          read: true,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        },
      ],
    });
    console.log(`✅ Created 3 notifications for provider ${provider.email}`);
  }

  console.log("✅ Notification seeding complete!");
}

seedNotifications()
  .catch((e) => {
    console.error("❌ Error seeding notifications:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
