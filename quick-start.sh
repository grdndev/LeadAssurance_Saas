#!/bin/bash

# Script de démarrage rapide - LeadsAssurance.com
# Usage: ./quick-start.sh

echo "🚀 Démarrage de LeadsAssurance.com..."
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo "✅ Dépendances installées"
else
    echo "✅ Dépendances déjà installées"
fi

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env manquant"
    echo "📝 Création d'un .env de développement..."
    cat > .env << EOL
# Base de données (à configurer)
DATABASE_URL="postgresql://user:password@localhost:5432/leadsassurance?schema=public"

# Secrets (générer de vraies valeurs en production)
NEXTAUTH_SECRET="dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (à configurer)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Cron
CRON_SECRET="dev-cron-secret"
EOL
    echo "⚠️  ATTENTION: Vous devez configurer DATABASE_URL dans .env"
fi

echo ""
echo "🎯 Options de démarrage:"
echo ""
echo "  1. Mode démo (sans BDD) - RECOMMANDÉ pour découvrir"
echo "  2. Mode complet (avec BDD configurée)"
echo ""
read -p "Votre choix (1 ou 2): " choice

case $choice in
    1)
        echo ""
        echo "🎬 Lancement en MODE DÉMO..."
        echo "⚠️  Les données sont en mémoire (mock data)"
        echo ""
        echo "📌 URLs à tester:"
        echo "   - http://localhost:3000 (Accueil)"
        echo "   - http://localhost:3000/dashboard/marketplace (Salle de marché)"
        echo "   - http://localhost:3000/dashboard/leads (Mes leads)"
        echo "   - http://localhost:3000/dashboard/billing (Billing)"
        echo "   - http://localhost:3000/admin (Admin)"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "🔍 Vérification de la configuration BDD..."
        
        if grep -q "postgresql://johndoe:randompassword@localhost:5432/mydb" .env; then
            echo "❌ DATABASE_URL n'est pas configuré dans .env"
            echo ""
            echo "📖 Configuration requise:"
            echo "   1. Créez une base PostgreSQL"
            echo "   2. Modifiez DATABASE_URL dans .env"
            echo "   3. Exécutez: npx prisma migrate dev"
            echo "   4. Exécutez: npx prisma db seed"
            echo "   5. Relancez ce script"
            exit 1
        fi
        
        echo "✅ DATABASE_URL configuré"
        echo ""
        
        # Vérifier si Prisma est migré
        if [ ! -d "prisma/migrations" ]; then
            echo "📊 Migration de la base de données..."
            npx prisma migrate dev --name init
            echo "✅ Base migrée"
        else
            echo "✅ Base déjà migrée"
        fi
        
        # Seeding
        read -p "Voulez-vous insérer les données de test? (y/n): " seed_choice
        if [ "$seed_choice" = "y" ]; then
            echo "🌱 Insertion des données de test..."
            npx prisma db seed
            echo "✅ Données insérées"
            echo ""
            echo "📝 Comptes créés:"
            echo "   Admin:     admin@leadsassurance.com / admin123"
            echo "   Courtier:  courtier@test.com / broker123"
            echo "   Apporteur: apporteur@test.com / provider123"
        fi
        
        echo ""
        echo "🎬 Lancement en MODE COMPLET..."
        npm run dev
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac
