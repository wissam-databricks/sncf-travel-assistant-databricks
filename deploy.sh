#!/bin/bash

# Script de déploiement pour SNCF Travel Assistant sur Databricks
# Usage: ./deploy.sh [dev|staging|prod]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default target
TARGET="${1:-dev}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  SNCF Travel Assistant - Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Target environment: ${GREEN}${TARGET}${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/6] Checking prerequisites...${NC}"

# Check if databricks CLI is installed
if ! command -v databricks &> /dev/null; then
    echo -e "${RED}❌ Databricks CLI not found${NC}"
    echo "Install it with: pip install databricks-cli"
    exit 1
fi
echo -e "${GREEN}✓ Databricks CLI installed${NC}"

# Check if frontend is built
if [ ! -f "frontend/out/index.html" ]; then
    echo -e "${RED}❌ Frontend not built${NC}"
    echo "Building frontend..."
    cd frontend
    npm run build
    cd ..
    echo -e "${GREEN}✓ Frontend built${NC}"
else
    echo -e "${GREEN}✓ Frontend already built${NC}"
fi

# Check if backend dependencies are installed
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found${NC}"
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r backend/requirements.txt
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment exists${NC}"
fi

echo ""

# Step 2: Validate bundle configuration
echo -e "${YELLOW}[2/6] Validating Databricks bundle...${NC}"
if databricks bundle validate -t "${TARGET}"; then
    echo -e "${GREEN}✓ Bundle configuration is valid${NC}"
else
    echo -e "${RED}❌ Bundle validation failed${NC}"
    exit 1
fi

echo ""

# Step 3: Show what will be deployed
echo -e "${YELLOW}[3/6] Deployment summary:${NC}"
echo "  - Backend: backend/server.py"
echo "  - Frontend: frontend/out/ (static files)"
echo "  - Configuration: databricks.yml (target: ${TARGET})"
echo "  - App name: sncf-travel-assistant-${TARGET}"
echo ""

# Step 4: Confirm deployment
if [ "${TARGET}" == "prod" ]; then
    echo -e "${RED}⚠️  WARNING: You are about to deploy to PRODUCTION${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Deployment cancelled"
        exit 0
    fi
else
    read -p "Deploy to ${TARGET}? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "Deployment cancelled"
        exit 0
    fi
fi

echo ""

# Step 5: Deploy to Databricks
echo -e "${YELLOW}[4/6] Deploying to Databricks...${NC}"
if databricks bundle deploy -t "${TARGET}"; then
    echo -e "${GREEN}✓ Deployment successful${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo ""

# Step 6: Get app details
echo -e "${YELLOW}[5/6] Getting app details...${NC}"
APP_NAME="sncf-travel-assistant-${TARGET}"
if [ "${TARGET}" == "prod" ]; then
    APP_NAME="sncf-travel-assistant"
fi

databricks apps get "${APP_NAME}" || echo -e "${YELLOW}⚠️  Could not get app details (might take a few seconds to start)${NC}"

echo ""

# Step 7: Show access information
echo -e "${YELLOW}[6/6] Deployment complete!${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Application Deployed Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "App name: ${APP_NAME}"
echo ""
echo "Access your application:"
echo "  - Frontend: https://adb-984752964297111.11.azuredatabricks.net/apps/${APP_NAME}/"
echo "  - API Docs: https://adb-984752964297111.11.azuredatabricks.net/apps/${APP_NAME}/docs"
echo "  - Health Check: https://adb-984752964297111.11.azuredatabricks.net/apps/${APP_NAME}/health"
echo ""
echo "Useful commands:"
echo "  - View logs: databricks apps logs ${APP_NAME} --follow"
echo "  - Check status: databricks apps get ${APP_NAME}"
echo "  - Restart app: databricks apps restart ${APP_NAME}"
echo ""
echo -e "${BLUE}Happy coding! 🚀${NC}"
