#!/bin/bash
set -x  # Print commands as they execute

cd /Users/wissam.benboubaker/Documents/Workspace/databricks_challenge

echo "=========================================="
echo "  DEPLOYING TO DATABRICKS APPS (DEV)"
echo "=========================================="
echo ""

echo "Step 1: Checking prerequisites..."
echo "- Databricks CLI: $(which databricks || echo 'NOT FOUND')"
echo "- Frontend build: $(ls -la frontend/out/index.html 2>&1 || echo 'NOT FOUND')"
echo ""

echo "Step 2: Validating bundle..."
databricks bundle validate -t dev
VALIDATE_EXIT=$?
echo "Validation exit code: $VALIDATE_EXIT"
echo ""

if [ $VALIDATE_EXIT -eq 0 ]; then
    echo "✓ Validation successful"
    echo ""
    
    echo "Step 3: Deploying to Databricks..."
    databricks bundle deploy -t dev
    DEPLOY_EXIT=$?
    echo "Deployment exit code: $DEPLOY_EXIT"
    echo ""
    
    if [ $DEPLOY_EXIT -eq 0 ]; then
        echo "✓ Deployment successful!"
        echo ""
        echo "Step 4: Getting app details..."
        databricks apps get sncf-travel-assistant-dev
        echo ""
        
        echo "=========================================="
        echo "  DEPLOYMENT COMPLETE!"
        echo "=========================================="
        echo ""
        echo "Access your app:"
        echo "  https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/"
        echo ""
    else
        echo "✗ Deployment failed with exit code $DEPLOY_EXIT"
        exit 1
    fi
else
    echo "✗ Validation failed with exit code $VALIDATE_EXIT"
    exit 1
fi
