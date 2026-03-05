import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du seeding...');

    // Créer un admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@leadsassurance.com' },
        update: {},
        create: {
            email: 'admin@leadsassurance.com',
            firstname: 'Administrateur',
	    password: adminPassword,
            role: Role.ADMIN,
            credits: 0,
        },
    });
    console.log('✅ Admin créé:', admin.email);

    // Créer un courtier de test
    const brokerPassword = await bcrypt.hash('broker123', 10);
    const broker = await prisma.user.upsert({
        where: { email: 'courtier@test.com' },
        update: {},
        create: {
            email: 'courtier@test.com',
            firstname: 'Jean',
            lastname: 'Courtier',
	    password: brokerPassword,
            role: Role.BROKER,
            credits: 500, // 500€ de crédits pour tester
        },
    });
    console.log('✅ Courtier créé:', broker.email, '- Crédits:', broker.credits);

    // Créer un apporteur de test
    const providerPassword = await bcrypt.hash('provider123', 10);
    const provider = await prisma.user.upsert({
        where: { email: 'apporteur@test.com' },
        update: {},
        create: {
            email: 'apporteur@test.com',
            firstname: 'Marie',
            lastname: 'Apporteur',
	    password: providerPassword,
            role: Role.PROVIDER,
            credits: 0,
        },
    });
    console.log('✅ Apporteur créé:', provider.email);

    // Créer quelques leads de test
    const lead1 = await prisma.lead.create({
        data: {
            providerId: provider.id,
            productType: 'CREDIT_IMMO',
            status: 'STOCK',
            firstName: 'Pierre',
            lastName: 'Dupont',
            phone: '0601020304',
            email: 'pierre.dupont@email.com',
            zipCode: '75008',
            city: 'Paris',
            attributes: JSON.stringify({
                projectType: 'Résidence principale',
                amount: 300000,
                apport: true,
                situationPro: 'Salarié CDI',
                income: 4500,
                delay: 'Immédiat',
            }),
            isAppointment: false,
            isExclusive: false, // En salle de marché
            price: 45,
            consent: {
                create: {
                    consentText:
                        "J'accepte d'être contacté par un courtier pour mon projet de crédit immobilier.",
                    ipAddress: '92.184.105.42',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    urlSource: 'https://comparateur-credit.fr',
                    timestamp: new Date(),
                    proofHash: 'abc123def456',
                },
            },
        },
    });
    console.log('✅ Lead 1 créé:', lead1.id, '-', lead1.productType);

    const lead2 = await prisma.lead.create({
        data: {
            providerId: provider.id,
            productType: 'ASSURANCE_EMPRUNTEUR',
            status: 'STOCK',
            firstName: 'Sophie',
            lastName: 'Martin',
            phone: '0612345678',
            email: 'sophie.martin@email.com',
            zipCode: '69002',
            city: 'Lyon',
            attributes: JSON.stringify({
                requestType: 'Changement',
                loanAmount: 200000,
                age: 34,
                smoker: false,
            }),
            isAppointment: true, // RDV qualifié
            isExclusive: false,
            price: 55,
            consent: {
                create: {
                    consentText:
                        "J'accepte d'être contacté pour un RDV concernant mon assurance emprunteur.",
                    ipAddress: '176.132.45.12',
                    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
                    urlSource: 'https://assurance-pret.fr',
                    timestamp: new Date(),
                    proofHash: 'xyz789uvw456',
                },
            },
        },
    });
    console.log('✅ Lead 2 créé:', lead2.id, '-', lead2.productType, '(RDV)');

    const lead3 = await prisma.lead.create({
        data: {
            providerId: provider.id,
            productType: 'MUTUELLE_SANTE_IND',
            status: 'STOCK',
            firstName: 'Lucas',
            lastName: 'Bernard',
            phone: '0687654321',
            email: 'lucas.bernard@email.com',
            zipCode: '13008',
            city: 'Marseille',
            attributes: JSON.stringify({
                peopleCount: 3,
                age: 42,
                regime: 'TNS',
                priority: 'Optique',
            }),
            isAppointment: false,
            isExclusive: false,
            price: 28,
            consent: {
                create: {
                    consentText:
                        "J'accepte d'être contacté pour une mutuelle santé familiale.",
                    ipAddress: '109.23.67.145',
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                    urlSource: 'https://mutuelle-comparateur.fr',
                    timestamp: new Date(),
                    proofHash: 'hash321def987',
                },
            },
        },
    });
    console.log('✅ Lead 3 créé:', lead3.id, '-', lead3.productType);

    // Créer un lead vendu (exemple historique)
    const soldLead = await prisma.lead.create({
        data: {
            providerId: provider.id,
            brokerId: broker.id, // Vendu au courtier de test
            productType: 'RACHAT_CREDIT',
            status: 'SOLD',
            firstName: 'Emma',
            lastName: 'Lefebvre',
            phone: '0698765432',
            email: 'emma.lefebvre@email.com',
            zipCode: '33000',
            city: 'Bordeaux',
            attributes: JSON.stringify({
                owner: true,
                creditCount: 3,
                monthlyPayments: 1200,
                totalDebt: 75000,
                familySituation: 'Marié(e)',
                situationPro: 'Salarié privé',
                income: 3200,
            }),
            isAppointment: false,
            isExclusive: true,
            price: 52,
            consent: {
                create: {
                    consentText:
                        "J'accepte d'être contacté pour mon rachat de crédits.",
                    ipAddress: '88.123.45.67',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
                    urlSource: 'https://rachat-credit.fr',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
                    proofHash: 'sold123hash456',
                },
            },
        },
    });
    console.log('✅ Lead vendu créé:', soldLead.id, '- Acheté par:', broker.email);

    // Seed some blog articles using the administrator as author
    const blogArticles = [
        {
            title: "L'importance du dressage pour la sécurité de votre chien",
            content: "Le dressage ne se résume pas à apprendre à votre chien à faire le \"beau\" ou à donner la patte. C'est un outil fondamental pour assurer sa sécurité et celle des autres."
        },
        {
            title: "Méthodes de Dressage Canin : Éducation Positive ou Traditionnelle ?",
            content: "Il existe plusieurs méthodes de dressage, chacune avec ses avantages et ses inconvénients. Ce dossier compare l'approche positive à la méthode traditionnelle pour vous aider à choisir."
        },
        {
            title: "Éduquer un Chiot : Le Guide Complet des Premiers Mois",
            content: "Les premiers mois de votre chiot sont déterminants. Apprenez les bases de la socialisation, du rappel et de la propreté dans ce guide pratique."
        },
        {
            title: "Comment Devenir Éducateur Canin Professionnel en France",
            content: "Vous souhaitez transformer votre passion pour les chiens en métier ? Suivez nos conseils pour obtenir les formations nécessaires et démarrer en tant qu'éducateur canin."
        },
        {
            title: "Assurance Chien & Chat : Comment Bien Choisir ?",
            content: "Comparer les garanties, comprendre les exclusions et trouver le bon contrat pour votre compagnon : tout ce qu'il faut savoir pour bien choisir une assurance animaux."
        },
    ];

    for (const art of blogArticles) {
        let slug = art.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .split(' ')
            .slice(0, 5)
            .join('-');
        const exists = await prisma.article.count({ where: { slug } });
        if (exists > 0) {
            slug += `-${exists + 1}`;
        }
        const excerpt = art.content.length > 100 ? `${art.content.substring(0, 100)}...` : art.content;
        const duration = Math.ceil(art.content.length / 1000);

        const createdArticle = await prisma.article.upsert({
            where: { slug },
            update: {},
            create: {
                slug,
                title: art.title,
                content: art.content,
                excerpt,
                duration,
                userId: admin.id,
                published: true,
                publishedAt: new Date(),
            },
        });
        console.log('✅ Article créé:', createdArticle.slug);
    }

    console.log('\n🎉 Seeding terminé avec succès!\n');
    console.log('📝 Comptes de test créés:');
    console.log('   Admin:     admin@leadsassurance.com / admin123');
    console.log('   Courtier:  courtier@test.com / broker123 (500€ crédits)');
    console.log('   Apporteur: apporteur@test.com / provider123\n');
    console.log('💡 Accédez à Prisma Studio: npx prisma studio');


}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
