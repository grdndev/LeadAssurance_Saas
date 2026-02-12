# 🚀 PRÉREQUIS CLIENT POUR DÉPLOIEMENT PRODUCTION
## LeadsAssurance.com - Liste Complète des Services & Comptes Nécessaires

**Date** : 9 Février 2024  
**Pour** : Présentation client et mise en production  
**Objectif** : Préparer tous les éléments nécessaires au lancement

---

## 📋 RÉSUMÉ EXÉCUTIF

Pour mettre la plateforme **LeadsAssurance.com** en production et accueillir des utilisateurs réels, le client devra fournir/créer les éléments suivants :

| Service | Pourquoi | Coût estimé | Urgence |
|---------|----------|-------------|---------|
| **1. Hébergement Web** | Héberger l'application Next.js | 20-50€/mois | 🔴 Critique |
| **2. Base de Données** | Stocker leads, users, transactions | 10-25€/mois | 🔴 Critique |
| **3. Stripe** | Paiement CB + gestion crédits | 0€ + commission | 🔴 Critique |
| **4. Service Email** | Envoi emails (confirmation, RDV) | 0-10€/mois | 🟡 Important |
| **5. Nom de Domaine** | leadsassurance.com | 10-15€/an | 🟡 Important |
| **6. SSL/HTTPS** | Sécurité (souvent inclus) | Gratuit | 🔴 Critique |
| **7. Monitoring** | Surveillance erreurs | 0-25€/mois | 🟢 Optionnel |

**Budget total estimé** : **50-100€/mois** + frais Stripe (1,4% + 0,25€ par transaction)

---

## 🎯 OPTION RECOMMANDÉE : STACK MODERNE & ÉCONOMIQUE

### 🏆 **Solution Clé en Main (Recommandation #1)**

Pour une **mise en production rapide et fiable**, je recommande cette stack :

```
┌─────────────────────────────────────────────────────────┐
│  HÉBERGEMENT WEB                                        │
│  → Vercel (Recommandé) ou Render ou Railway            │
│     • Déploiement automatique depuis GitHub             │
│     • HTTPS inclus                                      │
│     • CDN mondial                                       │
│     • Scaling automatique                               │
│     Coût : 20€/mois (Hobby) → 80€/mois (Pro)           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  BASE DE DONNÉES                                        │
│  → Neon PostgreSQL (Recommandé) ou Supabase            │
│     • PostgreSQL serverless                             │
│     • Backups automatiques                              │
│     • Scaling automatique                               │
│     Coût : Gratuit → 19€/mois (Scale)                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  PAIEMENT                                               │
│  → Stripe                                               │
│     • Paiement CB sécurisé                              │
│     • Gestion abonnements                               │
│     • Conformité PCI-DSS                                │
│     Coût : 1,4% + 0,25€ par transaction                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  EMAIL                                                  │
│  → Resend (Recommandé) ou SendGrid                     │
│     • Emails transactionnels                            │
│     • Templates HTML                                    │
│     • Analytics d'ouverture                             │
│     Coût : Gratuit (100 emails/jour) → 20€/mois (10k)  │
└─────────────────────────────────────────────────────────┘
```

---

## 1️⃣ HÉBERGEMENT WEB (APPLICATION NEXT.JS)

### ⭐ **Option A : Vercel (FORTEMENT RECOMMANDÉE)**

**Pourquoi Vercel ?**
- ✅ Créé par l'équipe de Next.js → Compatibilité parfaite
- ✅ Déploiement en 1 clic depuis GitHub
- ✅ HTTPS automatique (Let's Encrypt)
- ✅ CDN mondial (temps de chargement < 200ms partout)
- ✅ Preview deployments (tester avant de publier)
- ✅ Rollback en 1 clic si problème

**Tarifs Vercel** :
- **Hobby** : Gratuit (limité, OK pour beta/test)
- **Pro** : **20$/mois** (~18€) - **Recommandé pour production**
- **Enterprise** : Sur devis

**Ce que le client doit faire** :
1. Créer un compte sur [vercel.com](https://vercel.com)
2. Connecter le repo GitHub `LeadAssuranceSaas`
3. Vous fournir l'accès (email ou invitation)

---

### 🔄 **Option B : Render**

**Pourquoi Render ?**
- ✅ Alternative solide à Vercel
- ✅ Support PostgreSQL intégré
- ✅ Prix compétitifs
- ✅ Facile à configurer

**Tarifs Render** :
- **Web Service** : **7$/mois** (~6,50€) pour instance basique
- **PostgreSQL** : **7$/mois** inclus
- **Total** : ~15€/mois

**Ce que le client doit faire** :
1. Créer un compte sur [render.com](https://render.com)
2. Connecter GitHub
3. Vous fournir l'accès

---

### 🚂 **Option C : Railway**

**Pourquoi Railway ?**
- ✅ Plateforme tout-en-un (app + DB)
- ✅ Interface moderne
- ✅ Pricing à l'usage

**Tarifs Railway** :
- **Starter** : 5$/mois de crédit gratuit
- **Pro** : ~20$/mois pour projet moyen

**Ce que le client doit faire** :
1. Créer un compte sur [railway.app](https://railway.app)
2. Connecter GitHub

---

### ❌ **Alternatives NON recommandées pour cette stack**

- **Hostinger / OVH mutualisé** : Pas compatible Next.js
- **Firebase Hosting** : Nécessite refonte (Firebase Functions)
- **Netlify** : Bon pour statique, moins optimal pour Next.js 14

---

## 2️⃣ BASE DE DONNÉES (POSTGRESQL)

**⚠️ Important** : Vous utilisez actuellement **SQLite** en développement. Pour la production, il faut migrer vers **PostgreSQL** (plus robuste, scalable, et supporté par tous les hébergeurs).

### ⭐ **Option A : Neon PostgreSQL (RECOMMANDÉE)**

**Pourquoi Neon ?**
- ✅ PostgreSQL serverless (pas de serveur à gérer)
- ✅ Scaling automatique
- ✅ Backups quotidiens automatiques
- ✅ Connexions illimitées
- ✅ Compatible Prisma

**Tarifs Neon** :
- **Free** : Gratuit (OK pour beta, 512 MB)
- **Scale** : **19$/mois** (~17€) - **Recommandé pour production**
- **Business** : 69$/mois (pour forte charge)

**Ce que le client doit faire** :
1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer une base de données `leadsassurance_prod`
3. Copier la `DATABASE_URL` (chaîne de connexion PostgreSQL)
4. Vous la fournir (à mettre dans `.env.production`)

**Exemple de DATABASE_URL** :
```
postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/leadsassurance?sslmode=require
```

---

### 🔄 **Option B : Supabase PostgreSQL**

**Pourquoi Supabase ?**
- ✅ PostgreSQL + interface admin incluse
- ✅ Auth intégrée (peut remplacer NextAuth)
- ✅ Storage pour fichiers
- ✅ Gratuit jusqu'à 500 MB

**Tarifs Supabase** :
- **Free** : Gratuit (OK pour beta)
- **Pro** : **25$/mois** (~23€)

**Ce que le client doit faire** :
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un projet
3. Copier la `DATABASE_URL`

---

### 🔄 **Option C : Render PostgreSQL**

**Si vous choisissez Render pour l'hébergement**, vous pouvez utiliser leur PostgreSQL intégré :

**Tarifs** :
- **Starter** : **7$/mois** (~6,50€)

**Avantage** : Tout au même endroit (app + DB)

---

### 🔧 **Migration SQLite → PostgreSQL**

**Ce que VOUS devrez faire (développeur)** :

1. Modifier `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "postgresql"  // au lieu de "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Ajuster les types incompatibles :
```prisma
// SQLite → PostgreSQL
String @db.Text   // Pour textes longs
DateTime          // Reste identique
Boolean           // Reste identique
```

3. Recréer les migrations :
```bash
npx prisma migrate dev --name init_postgresql
npx prisma db push
```

**Temps estimé** : 1-2 heures (je peux le faire pour vous)

---

## 3️⃣ STRIPE (PAIEMENT CB + GESTION CRÉDITS)

### ⭐ **Stripe (OBLIGATOIRE)**

**Pourquoi Stripe ?**
- ✅ Référence mondiale du paiement en ligne
- ✅ Conformité PCI-DSS (sécurité maximale)
- ✅ Support CB, Apple Pay, Google Pay
- ✅ Webhooks pour automatiser (lead acheté → update DB)
- ✅ Dashboard analytics

**Tarifs Stripe** :
- **Pas d'abonnement** : 0€/mois
- **Commission par transaction** : **1,4% + 0,25€** (cartes EU)
  - Exemple : Achat lead 25€ → Commission 0,60€

**Ce que le client doit faire** :

1. **Créer un compte Stripe** :
   - Aller sur [stripe.com/fr](https://stripe.com/fr)
   - S'inscrire (email pro recommandé)
   - Activer le compte (vérification identité + coordonnées bancaires)

2. **Fournir les clés API** :
   - Mode **TEST** (pour vos tests) :
     - `STRIPE_PUBLISHABLE_KEY_TEST` (commence par `pk_test_...`)
     - `STRIPE_SECRET_KEY_TEST` (commence par `sk_test_...`)
   
   - Mode **PRODUCTION** (pour vrais paiements) :
     - `STRIPE_PUBLISHABLE_KEY` (commence par `pk_live_...`)
     - `STRIPE_SECRET_KEY` (commence par `sk_live_...`)

3. **Configurer le Webhook** (je le fais pour vous) :
   - URL webhook : `https://leadsassurance.com/api/webhooks/stripe`
   - Événements à écouter : `payment_intent.succeeded`, `checkout.session.completed`
   - Récupérer `STRIPE_WEBHOOK_SECRET` (commence par `whsec_...`)

**Documents requis pour activer Stripe** :
- ✅ Carte d'identité du gérant
- ✅ Justificatif de domicile (< 3 mois)
- ✅ IBAN de l'entreprise (pour recevoir les paiements)
- ✅ Kbis de la société (si SAS/SARL)

**Délai d'activation** : 24-48h après soumission des documents

---

## 4️⃣ SERVICE EMAIL (ENVOI AUTOMATIQUE)

### ⭐ **Option A : Resend (RECOMMANDÉE)**

**Pourquoi Resend ?**
- ✅ Simple à intégrer (déjà dans le code)
- ✅ Interface moderne
- ✅ Templates HTML drag & drop
- ✅ Analytics (taux d'ouverture)
- ✅ Pricing transparent

**Tarifs Resend** :
- **Free** : Gratuit (100 emails/jour) - OK pour début
- **Pro** : **20$/mois** (10 000 emails/mois)

**Ce que le client doit faire** :
1. Créer un compte sur [resend.com](https://resend.com)
2. Créer une clé API
3. Fournir `RESEND_API_KEY` (commence par `re_...`)
4. Configurer le domaine email (ex: `notifications@leadsassurance.com`)

**Configuration DNS requise** :
Le client devra ajouter 2 enregistrements DNS (je fournis les valeurs exactes) :
```
Type  Nom               Valeur
TXT   _resend          resend-verification=xyz123...
CNAME resend._domainkey xyz.resend.com
```

---

### 🔄 **Option B : SendGrid**

**Tarifs SendGrid** :
- **Free** : 100 emails/jour
- **Essentials** : **15$/mois** (40 000 emails/mois)

**Ce que le client doit faire** :
1. Créer un compte sur [sendgrid.com](https://sendgrid.com)
2. Créer une clé API
3. Fournir `SENDGRID_API_KEY`

---

### 🔄 **Option C : Gmail SMTP (Pour très petit volume)**

**Gratuit mais NON recommandé** :
- ⚠️ Limite : 500 emails/jour
- ⚠️ Risque de spam
- ⚠️ Pas professionnel

**Uniquement si** : Budget très serré ET < 50 utilisateurs

---

## 5️⃣ NOM DE DOMAINE

### **Nom de Domaine** : leadsassurance.com (ou .fr)

**Où acheter ?**
- **OVH** : ~10€/an (.com) - Français
- **Gandi** : ~15€/an (.com) - Français, éthique
- **Namecheap** : ~12$/an (.com) - International

**Ce que le client doit faire** :
1. Acheter le domaine `leadsassurance.com` (ou `.fr`)
2. Configurer les DNS pour pointer vers Vercel/Render :
   ```
   Type   Nom    Valeur
   A      @      76.76.21.21 (IP Vercel)
   CNAME  www    cname.vercel-dns.com
   ```
3. Si domaine déjà acheté : me fournir accès DNS

**Délai de propagation DNS** : 24-48h

---

## 6️⃣ SSL/HTTPS (SÉCURITÉ)

### ✅ **Inclus Gratuitement**

Avec **Vercel/Render/Railway**, le certificat SSL (HTTPS) est **automatiquement généré et renouvelé** via Let's Encrypt.

**Le client n'a RIEN à faire** (c'est géré automatiquement).

**Résultat** : Site accessible en `https://leadsassurance.com` 🔒

---

## 7️⃣ MONITORING & LOGS (OPTIONNEL MAIS RECOMMANDÉ)

### ⭐ **Option A : Sentry (Monitoring Erreurs)**

**Pourquoi Sentry ?**
- ✅ Détecte les erreurs en temps réel
- ✅ Stack traces complètes
- ✅ Alertes par email

**Tarifs** :
- **Free** : 5 000 erreurs/mois (OK pour début)
- **Team** : **26$/mois**

**Ce que le client doit faire** :
1. Créer un compte sur [sentry.io](https://sentry.io)
2. Créer un projet "Next.js"
3. Fournir `SENTRY_DSN` (commence par `https://...@sentry.io/...`)

---

### 🔄 **Option B : Vercel Analytics (Inclus)**

Si vous utilisez Vercel, les analytics de base sont **incluses gratuitement** :
- ✅ Pages vues
- ✅ Temps de chargement
- ✅ Taux de conversion

**Rien à configurer**, c'est automatique.

---

## 8️⃣ BONUS : SERVICES ADDITIONNELS (POST-MVP)

### **👤 SMS (Pour confirmation RDV)** - Optionnel

Pour envoyer des SMS de confirmation de RDV :

**Twilio** :
- **Tarif** : 0,06€/SMS (France)
- **Ce que le client doit faire** :
  1. Créer un compte [twilio.com](https://twilio.com)
  2. Acheter un numéro français (~1€/mois)
  3. Fournir `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

**Alternative** : **Vonage** (ex-Nexmo) - Prix similaires

---

### **📊 Analytics Avancées** - Optionnel

Pour tracker le comportement utilisateur :

**Google Analytics 4** :
- **Gratuit**
- **Ce que le client doit faire** :
  1. Créer un compte Google Analytics
  2. Créer une propriété "LeadsAssurance"
  3. Fournir `GA_MEASUREMENT_ID` (commence par `G-...`)

---

## 📝 RÉCAPITULATIF : CHECKLIST CLIENT

Voici le **document à envoyer au client** avec les actions à réaliser :

### ✅ **PRÉREQUIS OBLIGATOIRES (SANS EUX, PAS DE PRODUCTION)**

| Service | Action Client | Coût | Délai |
|---------|--------------|------|-------|
| **1. Hébergement** | Créer compte Vercel/Render | 20€/mois | 10 min |
| **2. Base de données** | Créer compte Neon PostgreSQL | 0-19€/mois | 10 min |
| **3. Stripe** | Créer compte + activer + fournir clés | 0€ + commission | 48h (activation) |
| **4. Email** | Créer compte Resend + clé API | 0-20€/mois | 10 min |
| **5. Domaine** | Acheter leadsassurance.com | 10-15€/an | 5 min |

**Budget total** : **50-80€/mois** + commission Stripe

---

### 🟡 **PRÉREQUIS RECOMMANDÉS (AMÉLIORE L'EXPÉRIENCE)**

| Service | Action Client | Coût | Bénéfice |
|---------|--------------|------|----------|
| **6. Monitoring (Sentry)** | Créer compte + fournir DSN | 0-26€/mois | Détection erreurs instantanée |
| **7. SMS (Twilio)** | Créer compte + acheter numéro | 1€/mois + 0,06€/SMS | Confirmation RDV par SMS |
| **8. Analytics (GA4)** | Créer compte Google Analytics | Gratuit | Statistiques détaillées |

---

## 🔑 VARIABLES D'ENVIRONNEMENT À FOURNIR

Une fois tous les comptes créés, le client devra vous fournir ces **clés secrètes** (à mettre dans `.env.production`) :

```bash
# DATABASE
DATABASE_URL="postgresql://user:pass@neon.tech/leadsassurance?sslmode=require"

# NEXTAUTH (Je génère une clé aléatoire sécurisée)
NEXTAUTH_SECRET="[je génère]"
NEXTAUTH_URL="https://leadsassurance.com"

# STRIPE (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# EMAIL
RESEND_API_KEY="re_..."
EMAIL_FROM="notifications@leadsassurance.com"

# OPTIONNEL : Monitoring
SENTRY_DSN="https://...@sentry.io/..."

# OPTIONNEL : SMS
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+33..."
```

---

## 📞 QUESTIONS FRÉQUENTES DU CLIENT

### **Q1 : Pourquoi PostgreSQL et pas rester sur SQLite ?**
**R** : SQLite est excellent en développement mais **ne supporte pas** :
- Connexions concurrentes (plusieurs utilisateurs simultanés)
- Scaling (croissance du nombre d'utilisateurs)
- Backups automatiques
- Haute disponibilité

PostgreSQL est **standard de l'industrie** pour les applications SaaS.

---

### **Q2 : Firebase ne serait pas mieux ?**
**R** : Firebase est excellent pour certains projets, mais **pas optimal ici** :
- ❌ Nécessite refonte (Firebase Functions au lieu de Next.js API Routes)
- ❌ Coûts imprévisibles (facturation à l'usage)
- ❌ Lock-in (difficile de migrer après)
- ✅ PostgreSQL + Vercel = **stack standard**, facilement transférable

---

### **Q3 : Peut-on commencer gratuit puis upgrader ?**
**R** : **Oui, absolument** :
- **Phase Beta (0-100 users)** : Gratuit (Vercel Hobby + Neon Free + Resend Free)
- **Phase Production (100-1000 users)** : ~50€/mois
- **Phase Scale (1000+ users)** : ~150€/mois

Vous payez **seulement ce que vous utilisez**.

---

### **Q4 : Qui gère les mises à jour et la maintenance ?**
**R** : 
- **Hébergement (Vercel/Render)** : Automatique (0 action requise)
- **Base de données (Neon)** : Automatique (mises à jour PostgreSQL gérées)
- **Code de l'application** : Vous (développeur) - 1-2h/mois recommandées

---

## 🎯 PROCHAINES ÉTAPES

### **Pour le client** :
1. ✅ Lire ce document
2. ✅ Choisir la stack (je recommande Vercel + Neon + Stripe + Resend)
3. ✅ Créer les comptes listés
4. ✅ Me fournir toutes les clés API
5. ✅ Valider le budget mensuel (~50-80€)

### **Pour vous (développeur)** :
1. ✅ Recevoir les clés du client
2. ✅ Migrer SQLite → PostgreSQL (1-2h)
3. ✅ Configurer les variables d'environnement
4. ✅ Déployer sur Vercel/Render
5. ✅ Configurer le webhook Stripe
6. ✅ Tester en production
7. ✅ Former le client à l'admin dashboard

**Temps de déploiement total** : **4-6 heures** (après réception des clés)

---

## 💰 ESTIMATION BUDGÉTAIRE FINALE

### **Scénario 1 : Lancement Minimal (0-100 utilisateurs/mois)**
```
Vercel Hobby       : 0€/mois
Neon Free          : 0€/mois
Stripe             : 0€ + commission (1,4% + 0,25€/transaction)
Resend Free        : 0€/mois (100 emails/jour)
Domaine .com       : 1€/mois (12€/an)
──────────────────────────
TOTAL              : ~1€/mois + commissions Stripe
```

**Idéal pour** : Beta fermée, premiers clients

---

### **Scénario 2 : Production Standard (100-1000 utilisateurs/mois)** ⭐
```
Vercel Pro         : 18€/mois
Neon Scale         : 17€/mois
Stripe             : 0€ + commission (~ 50-200€/mois si 100-500 transactions)
Resend Pro         : 18€/mois
Domaine .com       : 1€/mois
Sentry Team        : 24€/mois (optionnel)
──────────────────────────
TOTAL              : 78-102€/mois (hors commissions Stripe)
```

**Idéal pour** : Lancement commercial

---

### **Scénario 3 : Scaling (1000+ utilisateurs/mois)**
```
Vercel Pro         : 18€/mois
Neon Business      : 63€/mois
Stripe             : 0€ + commission (~ 500-2000€/mois)
Resend Pro         : 18€/mois
Domaine .com       : 1€/mois
Sentry Team        : 24€/mois
Twilio (SMS)       : 50-200€/mois (selon volume RDV)
──────────────────────────
TOTAL              : 174-324€/mois (hors commissions Stripe)
```

**Idéal pour** : Forte croissance

---

## ✅ CONCLUSION

### **Stack Recommandée (Meilleur Rapport Qualité/Prix)** :

```
🏆 HÉBERGEMENT   : Vercel Pro (18€/mois)
🏆 DATABASE      : Neon Scale (17€/mois)
🏆 PAIEMENT      : Stripe (commission uniquement)
🏆 EMAIL         : Resend Pro (18€/mois)
🏆 DOMAINE       : OVH/Gandi (10-15€/an)
🏆 MONITORING    : Sentry Free → Team si budget

TOTAL : 50-80€/mois (+ commissions Stripe)
```

### **Ce document contient TOUT ce qu'il faut demander au client.**

Le client doit :
1. Lire ce document
2. Valider la stack
3. Créer les comptes
4. Vous fournir les clés API

Une fois reçu → Déploiement en 4-6h → **Plateforme en ligne !** 🚀

---

**Contact développeur** : [Votre email]  
**Support technique** : [Votre email/téléphone]  
**Date de livraison estimée** : J+5 après réception des clés
