#!/bin/bash

echo "🚀 Premium Diary App - Deployment Script"
echo "========================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Using default from .env"
    export DATABASE_URL="postgresql://bansi@localhost:5432/premium_diary"
fi

echo "✅ Database URL configured"
echo ""

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Database schema push failed!"
    exit 1
fi

echo "✅ Database schema updated"
echo ""

# Build application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful"
echo ""

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. For Replit: Click the 'Deploy' button"
echo "2. For other platforms: Upload the 'dist' folder"
echo "3. Set DATABASE_URL environment variable"
echo "4. Run: node dist/index.cjs"
echo ""
echo "Your app is ready to go live! 🚀"
