#!/bin/bash

# Azure Container Apps Setup Script for Reverser Application
# Make sure you're logged in to Azure CLI: az login

set -e

# Configuration - Update these values
RESOURCE_GROUP="reverser-rg"
LOCATION="eastus"
ACR_NAME="reverseracr$(date +%s)"  # Unique name with timestamp
ENVIRONMENT_NAME="reverser-env"
FRONTEND_APP_NAME="reverser-frontend"
BACKEND_APP_NAME="reverser-backend"

echo "🚀 Setting up Azure resources for Reverser application..."
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "ACR Name: $ACR_NAME"

# Create resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Registry
echo "🐳 Creating Azure Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# Get ACR credentials
echo "🔑 Getting ACR credentials..."
ACR_CREDENTIALS=$(az acr credential show --name $ACR_NAME)
ACR_USERNAME=$(echo $ACR_CREDENTIALS | jq -r '.username')
ACR_PASSWORD=$(echo $ACR_CREDENTIALS | jq -r '.passwords[0].value')
ACR_LOGIN_SERVER="$ACR_NAME.azurecr.io"

# Create Container Apps environment
echo "🌟 Creating Container Apps environment..."
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Get subscription ID for service principal
SUBSCRIPTION_ID=$(az account show --query id --output tsv)

# Create service principal for GitHub Actions
echo "👤 Creating service principal for GitHub Actions..."
SP_CREDENTIALS=$(az ad sp create-for-rbac \
  --name "reverser-github-actions-$(date +%s)" \
  --role contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
  --sdk-auth)

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "=================================================="
echo "📋 GITHUB SECRETS CONFIGURATION"
echo "=================================================="
echo ""
echo "Add these secrets to your GitHub repository:"
echo ""
echo "AZURE_CONTAINER_REGISTRY=$ACR_LOGIN_SERVER"
echo "AZURE_CONTAINER_REGISTRY_USERNAME=$ACR_USERNAME"
echo "AZURE_CONTAINER_REGISTRY_PASSWORD=$ACR_PASSWORD"
echo ""
echo "AZURE_CREDENTIALS='$SP_CREDENTIALS'"
echo ""
echo "AZURE_RESOURCE_GROUP=$RESOURCE_GROUP"
echo "AZURE_CONTAINER_APP_ENVIRONMENT=$ENVIRONMENT_NAME"
echo "FRONTEND_CONTAINER_APP_NAME=$FRONTEND_APP_NAME"
echo "BACKEND_CONTAINER_APP_NAME=$BACKEND_APP_NAME"
echo ""
echo "=================================================="
echo "🔗 NEXT STEPS"
echo "=================================================="
echo ""
echo "1. Copy the secrets above to your GitHub repository"
echo "2. Go to: https://github.com/mooncowboy/reverser/settings/secrets/actions"
echo "3. Click 'New repository secret' and add each one"
echo "4. Push changes to trigger the deployment workflows"
echo ""
echo "After deployment, get the app URLs with:"
echo "az containerapp show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn"
echo "az containerapp show --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn"
echo ""
echo "🎉 Happy deploying!"