# Architecture & Modèle de Données - LeadsAssurance.com

En tant qu'Architecte Logiciel Senior, voici la conception structurée pour le MVP de votre marketplace de leads.

## 1. Analyse des Rôles & Interactions

La plateforme est un écosystème B2B organisé autour de trois piliers :

- **L'Administrateur (Owner)** : Maître de la plateforme. Il valide les comptes, gère le catalogue de produits (18 types), supervise les transactions et arbitre les litiges.
- **L'Apporteur (Lead Source)** : Le fournisseur de matière première. Il injecte les leads (manuellement, CSV ou via API). Sa priorité est le taux d'acceptation et la preuve de conformité RGPD.
- **Le Courtier (Buyer)** : Le client final. Il cherche des leads "frais" et qualifiés. Il achète à l'unité (Salle de marché) ou via des flux configurés. Il doit pouvoir exporter sa preuve de consentement en cas de contrôle ACPR/RGPD.

---

## 2. Modèle de Données (SQL Relationnel)

L'enjeu est de gérer 18 produits différents sans créer 18 tables complexes.
**Approche préconisée : Hybride (Colonnes fixes + JSONB).**

### Schema PostgreSQL (Prisma)

```prisma
// Utilisateurs et Profils
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  role          Role      @default(BROKER)
  profile       Profile?
  leadsCreated  Lead[]    @relation("SourceProvider")
  leadsBought   Lead[]    @relation("BuyerBroker")
  credits       Int       @default(0)
  createdAt     DateTime  @default(now())
}

enum Role {
  ADMIN
  PROVIDER
  BROKER
}

// Le Lead (Cœur du système)
model Lead {
  id              String         @id @default(cuid())
  productType     ProductType    // Les 18 types
  status          LeadStatus     @default(STOCK)

  // Champs Communs (Section 3 du CDC)
  firstName       String
  lastName        String
  phone           String
  email           String
  zipCode         String
  city            String

  // Données Dynamiques (Section 4 du CDC)
  // On utilise JSONB pour la flexibilité des 18 formulaires
  attributes      Json

  // Consentement (Critique - Section 9)
  consent         Consent?

  // Relations
  providerId      String
  provider        User           @relation("SourceProvider", fields: [providerId], references: [id])
  brokerId        String?
  broker          User?          @relation("BuyerBroker", fields: [brokerId], references: [id])

  isExclusive     Boolean        @default(true)
  price           Float
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

// Table de Preuve de Consentement (Audit Log Immuable)
model Consent {
  id              String   @id @default(cuid())
  leadId          String   @unique
  lead            Lead     @relation(fields: [leadId], references: [id])
  consentText     String   // Version du texte de consentement au moment de la capture
  ipAddress       String
  userAgent       String
  urlSource       String
  timestamp       DateTime @default(now())
  proofHash       String   // Pour garantir l'intégrité de la preuve
}

enum ProductType {
  CREDIT_IMMO
  RACHAT_CREDIT
  ASSURANCE_EMPRUNTEUR
  MUTUELLE_SANTE
  // ... etc (les 18 types)
}

enum LeadStatus {
  STOCK
  RESERVED  // Pendant le process de paiement
  SOLD
  REJECTED
}
```

---

## 3. Flux Technique : La Salle de Marché

Le défi est la gestion de la **concurrence** (ne pas vendre le même lead à deux courtiers simultanément).

1.  **Mise en Stock** : Un lead non vendu via flux exclusif passe en `status: STOCK`.
2.  **Réservation (Race Condition Prevention)** :
    - Lorsqu'un courtier clique sur "Acheter", le système exécute une transaction atomique :
    - `UPDATE leads SET status = 'RESERVED', brokerId = 'xyz' WHERE id = 'abc' AND status = 'STOCK'`
    - Si 1 ligne est modifiée, le courtier a "gagné" la main.
3.  **Verrou de Paiement** :
    - On crée une entrée dans une table de cache (Redis ou table `Reservation`) avec un TTL de 10 minutes.
    - Le courtier est redirigé vers le paiement (CB ou prélèvement crédits).
4.  **Finalisation** :
    - _Succès_ : Le statut passe à `SOLD`. Le contact est dévoilé.
    - _Échec/Timeout_ : Un job (Cron ou Trigger) repasse le lead en `STOCK` et supprime le `brokerId` si le délai de 10 min est dépassé sans paiement validé.

---

## 4. Stack Technique Recommandée

Pour un projet SaaS B2B manipulant des données sensibles (RGPD/Assurance), voici la stack la plus robuste et rapide :

- **Frontend & Fullstack Framework** : **Next.js 14/15 (App Router)**. Idéal pour le SEO des pages d'atterrissage et la complexité des tableaux de bord.
- **Langage** : **TypeScript** pour la sécurité du modèle de données (éviter les erreurs sur les 18 types de produits).
- **Base de Données** : **PostgreSQL (via Supabase)**. Utilisation des `Row Level Security (RLS)` pour isoler hermétiquement les données entre courtiers.
- **Styling (WOW Effect)** : **Tailwind CSS + Shadcn UI**. Permet d'obtenir un look "Premium Enterprise" instantanément. Animations avec **Framer Motion**.
- **Paiement** : **Stripe** (gestion des paiements à l'unité et du système de crédits).
- **Conformité** : Bibliothèque **`react-pdf`** côté serveur pour générer instantanément les "Certificats de Consentement" exportables.

---

### Pourquoi l'approche JSONB pour les 18 produits ?

1.  **Évolutivité** : Si vous ajoutez un 19ème produit demain, aucune migration de base de données n'est requise.
2.  **Performance** : PostgreSQL indexe très bien le JSONB.
3.  **Simplicité** : Un seul composant de formulaire dynamique peut gérer tous les cas.
