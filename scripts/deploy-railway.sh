#!/bin/bash

# Railway Deployment Script
# This script helps automate Railway deployment

echo "🚂 Railway Deployment Script"
echo "============================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    echo "Please install Railway CLI first:"
    echo "  Windows: iwr https://railway.app/install.sh | iex"
    echo "  Mac/Linux: curl -fsSL https://railway.app/install.sh | sh"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Login to Railway
echo "🔐 Logging in to Railway..."
railway login

# Create new project or use existing
read -p "Create new project? (y/n): " create_new
if [ "$create_new" = "y" ]; then
    railway init
else
    railway link
fi

# Deploy Backend
echo ""
echo "📦 Deploying Backend..."
cd EcommerceApplication
railway up --service backend
cd ..

# Deploy Frontend
echo ""
echo "📦 Deploying Frontend..."
cd Frontend
railway up --service frontend
cd ..

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Railway dashboard"
echo "2. Add MySQL database"
echo "3. Configure CORS settings"
echo ""
echo "See DEPLOY_FREE_STEPS.md for detailed instructions"

