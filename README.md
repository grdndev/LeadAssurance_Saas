# LeadsAssurance.com - Plateforme de Vente de Leads & RDV Qualifiés  

## 🎯 **Vue d'ensemble**

**LeadsAssurance.com** est une marketplace B2B permettant aux **courtiers en assurance et crédit** d'acheter des leads qualifiés et rendez-vous auprès d'**apporteurs certifiés**.

### Caractéristiques clés :
- ✅ **18 produits** (crédit, assurance, patrimoine)
- ✅ **Conformité RGPD native** avec preuve de consentement sur chaque lead
- ✅ **Salle de marché** pour achat à l'unité
- ✅ **Leads exclusifs** ou non-exclusifs
- ✅ **Fraîcheur garantie** (24h/48h/72h)
- ✅ **Système de crédits** avec paiement sécurisé
- ✅ **Import CSV** et **API** pour les apporteurs  

---

## 🚀 **Démarrage rapide**

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd LeadAssuranceSaas

# Installer les dépendances
npm install

# Configurer la base de données
# 1. Créez une base PostgreSQL
# 2. Copiez .env.example vers .env
# 3. Configurez DATABASE_URL dans .env

# Migrer la base de données
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

---

## 📊 **Architecture**

### Stack technique
- **Frontend**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **Base de données**: PostgreSQL via Prisma ORM
- **Paiement**: Stripe (à intégrer)
- **Authentification**: NextAuth.js (à finaliser)

### Structure du projet
```
LeadAssuranceSaas/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── leads/              # Gestion des leads
│   │   ├── users/              # Gestion utilisateurs
│   │   └── cron/               # Jobs automatisés
│   ├── dashboard/              # Interface courtier & apporteur
│   ├── admin/                  # Interface admin
│   ├── leads/[productId]/      # Formulaires publics de capture
│   ├── login/                  # Authentification
│   └── register/               # Inscription
├── components/                 # Composants réutilisables
├── lib/
│   ├── constants/              # Définition des 18 produits
│   └── types/                  # Types TypeScript
├── prisma/
│   └── schema.prisma           # Schéma de base de données
└── public/                     # Assets statiques
```

---

## 🔐 **Conformité RGPD**

Chaque lead inclut une **preuve de consentement immuable** :
- ✅ Texte de consentement versionné
- ✅ Horodatage (timestamp)
- ✅ Adresse IP publique
- ✅ User-Agent
- ✅ URL source
- ✅ Hash SHA-256 pour intégrité des données

Export PDF disponible pour les audits ACPR.

---

## 📦 **Catalogue des 18 produits**

### **Crédit** (3)
1. Crédit Immobilier
2. Rachat / Regroupement de Crédits
3. Crédit Professionnel

### **Assurance** (13)
4. Assurance Emprunteur
5. Mutuelle Santé Individuelle
6. Mutuelle d'Entreprise
7. Prévoyance TNS / Dirigeants
8. Assurance Auto
9. Assurance Habitation (MRH)
10. Assurance Chiens & Chats
11. RC Pro
12. Multirisque Professionnelle
13. RC Décennale
14. Dommage Ouvrage
15. Multirisque Immeuble
16. Assurance Obsèques

### **Patrimoine** (2)
17. Assurance Vie & Retraite (PER)
18. Défiscalisation

---

## 🔑 **Rôles & Permissions**

### **ADMIN**
- Supervise toute la plateforme
- Valide les nouveaux utilisateurs
- Gère le catalogue de produits
- Accès aux statistiques globales

### **BROKER** (Courtier)
- Achète des leads/RDV
- Accède à la salle de marché
- Consulte ses leads achetés
- Exporte les preuves de consentement
- Recharge ses crédits

### **PROVIDER** (Apporteur)
- Soumet des leads (manuel/CSV/API)
- Suit le statut de ses leads
- Reçoit son revenu (50% du prix de vente)
- Consulte ses statistiques

---

## 🛡️ **Sécurité & Performance**

### Réservation atomique (Race Condition Prevention)
Lorsqu'un courtier clique sur "Acheter" dans la salle de marché :
1. **Transaction atomique** SQL pour réserver le lead
2. Verrou de **10 minutes** pour finaliser le paiement
3. Job automatique pour libérer les réservations expirées

### Données sensibles
- Les coordonnées complètes ne sont **jamais révélées avant l'achat**
- Hash de preuve de consentement **immuable**
- Audit log complet

---

## 📡 **API Endpoints**

### Leads
- `GET /api/leads` - Liste des leads (filtré par rôle)
- `POST /api/leads` - Créer un lead
- `POST /api/leads/import` - Import CSV
- `GET /api/leads/marketplace` - Leads disponibles en salle de marché
- `POST /api/leads/marketplace/reserve` - Réserver un lead
- `POST /api/leads/purchase` - Finaliser l'achat

### Utilisateurs
- `GET /api/users/[id]/credits` - Solde de crédits
- `POST /api/users/[id]/credits` - Recharger

### Cron
- `GET /api/cron/cleanup-reservations` - Nettoyer réservations expirées

---

## 🎨 **Design System**

### Couleurs
- Primary: Bleu (#0070F3)
- Secondary: Violet (#7C3AED)
- Success: Vert (#10B981)
- Destructive: Rouge (#EF4444)

### Composants principaux
- Cards avec glassmorphism
- Boutons arrondis (rounded-full)
- Animations Framer Motion
- Badges de statut colorés

---

## 🚧 **À finaliser**

### Priorité haute
1. ⚠️ **Authentification** complète (NextAuth.js)
2. ⚠️ **Intégration Stripe** pour les paiements
3. ⚠️ **Export PDF** des preuves de consentement
4. ⚠️ **Cron Vercel** pour nettoyage automatique

### Priorité moyenne
5. Tests unitaires (Jest/Vitest)
6. API externe pour apporteurs (webhook)
7. Dashboard analytics avancé
8. Notifications email (Resend/SendGrid)

---

## 🐛 **Dépannage**

### Le serveur ne démarre pas
```bash
# Vérifier que PostgreSQL est actif
psql <database_url>

# Régénérer le client Prisma
npx prisma generate

# Redémarrer le serveur
npm run dev
```

### Erreurs de migration Prisma
```bash
# Réinitialiser la base (⚠️ perte de données)
npx prisma migrate reset

# Ou créer une nouvelle migration
npx prisma migrate dev --name <nom_migration>
```

---

## 📝 **License**

Propriétaire - LeadsAssurance.com © 2024

---

## 🤝 **Contact & Support**

- **Email**: support@leadsassurance.com
- **Documentation**: [docs.leadsassurance.com]
- **Status**: [status.leadsassurance.com]

---

## 🎓 **Formation**

Pour onboarder de nouveaux développeurs :
1. Lire ce README
2. Consulter `ARCHITECTURE.md`
3. Explorer `lib/constants/products.ts` (définition des 18 produits)
4. Tester en local avec données mock

**MVP fonctionnel** ✅ - Prêt pour démo client
