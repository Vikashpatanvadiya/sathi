#!/bin/bash

echo "🚀 Premium Diary App - Vercel Deployment"
echo "========================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set!"
    echo ""
    echo "Please set up your database first:"
    echo "1. Go to https://neon.tech"
    echo "2. Create a free PostgreSQL database"
    echo "3. Copy the connection string"
    echo "4. Run: export DATABASE_URL='your_connection_string'"
    echo ""
    read -p "Have you set up your database? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    
    echo ""
    read -p "Enter your DATABASE_URL: " db_url
    export DATABASE_URL="$db_url"
fi

echo "✅ Database URL configured"
echo ""

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Database schema push failed!"
    echo "Please check your DATABASE_URL and try again."
    exit 1
fi

echo "✅ Database schema updated"
echo ""

# Add environment variable to Vercel
echo "🔐 Adding DATABASE_URL to Vercel..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL production

echo "✅ Environment variable added"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "Your app is now live on Vercel!"
echo "Check the URL above to access your app."
echo ""
