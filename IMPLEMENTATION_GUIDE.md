# 🚀 GUIDE D'IMPLÉMENTATION FINALE
# LeadsAssurance.com - Checklist de finalisation

## ✅ **ÉTAT ACTUEL**

### Complété à 85%

✅ Architecture Next.js 16 + Prisma + PostgreSQL
✅ 18 produits définis avec champs dynamiques
✅ Interface courtier (dashboard, leads, marketplace, billing)
✅ Interface apporteur (soumission, suivi)
✅ Interface admin (dashboard, validation)
✅ APIs backend (/api/leads, /api/users, /api/cron)
✅ Système de réservation atomique
✅ Preuves de consentement RGPD
✅ Design system premium
✅ Formulaires publics de capture de leads

---

## ⚠️ **À FINALISER (15%) - PRIORITÉ HAUTE**

### 1. **Base de données PostgreSQL**
**Status**: Configuration requise
**Temps estimé**: 1h

#### Actions :
```bash
# 1. Créer une base PostgreSQL (local ou Supabase)
# Exemple avec Supabase (gratuit) :
# - Aller sur https://supabase.com
# - Créer un projet
# - Copier l'URL de connexion

# 2. Mettre à jour .env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# 3. Migrer la base
npx prisma migrate dev --name init

# 4. Créer un utilisateur admin de test
npx prisma studio
# Créer manuellement un User avec role=ADMIN
```

**Fichiers impactés**: `.env`, `prisma/schema.prisma`

---

### 2. **Authentification NextAuth.js**
**Status**: Pages login/register créées mais pas connectées
**Temps estimé**: 3h

#### Actions :
```bash
# Installer NextAuth
npm install next-auth @auth/prisma-adapter
```

#### Fichier à créer : `app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### Ajouter `password` au schema Prisma :
```prisma
model User {
  id       String  @id @default(cuid())
  email    String  @unique
  password String? // Ajouter cette ligne
  name     String?
  role     Role    @default(BROKER)
  // ... reste inchangé
}
```

**Fichiers impactés**:
- `app/api/auth/[...nextauth]/route.ts` (nouveau)
- `app/login/page.tsx` (connecter à NextAuth)
- `app/register/page.tsx` (créer utilisateur avec hash password)
- `prisma/schema.prisma` (ajouter champ password)

---

### 3. **Intégration Stripe**
**Status**: UI ready, paiements à connecter
**Temps estimé**: 4h

#### Actions :
```bash
npm install stripe @stripe/stripe-js
```

#### Fichier : `app/api/stripe/create-payment-intent/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  const { amount, userId } = await request.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // en centimes
    currency: "eur",
    metadata: { userId },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
```

#### Fichier : `app/api/stripe/webhook/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata.userId;
    const amount = paymentIntent.amount / 100;

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    });
  }

  return NextResponse.json({ received: true });
}
```

**Variables d'environnement** (`.env`) :
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Fichiers impactés**:
- `app/api/stripe/create-payment-intent/route.ts` (nouveau)
- `app/api/stripe/webhook/route.ts` (nouveau)
- `app/dashboard/billing/page.tsx` (connecter Stripe Elements)

---

### 4. **Export PDF des preuves de consentement**
**Status**: Bouton présent, génération à implémenter
**Temps estimé**: 2h

#### Actions :
```bash
npm install @react-pdf/renderer
```

#### Fichier : `lib/pdf/consent-certificate.tsx`
```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 10 },
  label: { fontSize: 10, color: '#666' },
  value: { fontSize: 12, marginBottom: 5 }
});

export const ConsentCertificatePDF = ({ lead }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>CERTIFICAT DE PREUVE DE CONSENTEMENT</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Lead ID:</Text>
        <Text style={styles.value}>{lead.id}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Prospect:</Text>
        <Text style={styles.value}>{lead.firstname} {lead.lastname}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Texte de consentement:</Text>
        <Text style={styles.value}>"{lead.consent.consentText}"</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Horodatage:</Text>
        <Text style={styles.value}>{lead.consent.timestamp}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Adresse IP:</Text>
        <Text style={styles.value}>{lead.consent.ipAddress}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Hash de preuve:</Text>
        <Text style={styles.value}>{lead.consent.proofHash}</Text>
      </View>
    </Page>
  </Document>
);
```

#### API endpoint : `app/api/leads/[id]/consent-pdf/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma } from "@/lib/prisma";
import { ConsentCertificatePDF } from "@/lib/pdf/consent-certificate";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: { consent: true }
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const pdfBuffer = await renderToBuffer(<ConsentCertificatePDF lead={lead} />);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="consent-${lead.id}.pdf"`
    }
  });
}
```

**Fichiers impactés**:
- `lib/pdf/consent-certificate.tsx` (nouveau)
- `app/api/leads/[id]/consent-pdf/route.ts` (nouveau)
- `app/dashboard/leads/page.tsx` (remplacer download TXT par PDF)

---

### 5. **Cron Job Vercel**
**Status**: Endpoint créé, à déployer
**Temps estimé**: 30min

#### Fichier : `vercel.json` (racine du projet)
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-reservations",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

#### Variables d'environnement Vercel :
```
CRON_SECRET=<générer_un_secret_fort>
```

**Fichiers impactés**:
- `vercel.json` (nouveau)
- Paramètres Vercel (ajouter CRON_SECRET)

---

## 🎯 **ORDRE D'IMPLÉMENTATION RECOMMANDÉ**

### Sprint 1 (Jour 1-2) : Base de données & Auth
1. ✅ Configurer PostgreSQL
2. ✅ Migrer Prisma
3. ✅ Implémenter NextAuth
4. ✅ Tester login/register

### Sprint 2 (Jour 3-4) : Paiements
5. ✅ Configurer Stripe
6. ✅ Implémenter recharge crédits
7. ✅ Webhook pour créditer le compte

### Sprint 3 (Jour 5) : Export PDF & Cron
8. ✅ Export PDF consent
9. ✅ Déployer cron Vercel

---

## 🧪 **TESTS FONCTIONNELS**

### Scénario 1 : Apporteur → Courtier
1. Apporteur soumet un lead via `/dashboard/provider/submit`
2. Lead apparaît en validation admin
3. Admin approuve → Lead en STOCK
4. Courtier voit le lead dans `/dashboard/marketplace`
5. Courtier achète → Crédits débités
6. Lead apparaît dans `/dashboard/leads` avec coordonnées complètes
7. Courtier exporte PDF de consentement

### Scénario 2 : Import CSV
1. Apporteur upload CSV via interface
2. API parse et valide chaque ligne
3. Leads conformes → STOCK
4. Leads non-conformes → Report d'erreur

### Scénario 3 : Réservation expirée
1. Courtier clique "Acheter"
2. Lead réservé 10 min
3. Courtier ferme sans payer
4. Cron libère le lead après 10 min
5. Lead redevient disponible

---

## 📋 **CHECKLIST FINALE AVANT PRODUCTION**

- [ ] Tests E2E (Playwright/Cypress)
- [ ] Logs centralisés (Sentry/Datadog)
- [ ] Rate limiting sur APIs
- [ ] HTTPS forcé
- [ ] Variables d'environnement sécurisées
- [ ] Backup automatique BDD
- [ ] Monitoring uptime
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] CGU + Politique de confidentialité
- [ ] Conformité RGPD validée par juriste

---

## 📞 **Support technique**

Pour toute question lors de l'implémentation :
- Consulter la doc Prisma : https://www.prisma.io/docs
- Consulter la doc NextAuth : https://next-auth.js.org
- Consulter la doc Stripe : https://stripe.com/docs

**Bon courage ! 🚀**
