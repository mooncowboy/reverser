# GitHub Secrets Template

Copy this template and fill in your Azure resource details.

## Required Secrets for GitHub Actions

```bash
# Azure Container Registry
AZURE_CONTAINER_REGISTRY=myregistry.azurecr.io
AZURE_CONTAINER_REGISTRY_USERNAME=myregistry
AZURE_CONTAINER_REGISTRY_PASSWORD=<acr-password-or-token>

# Azure Service Principal (Full JSON from az ad sp create-for-rbac command)
AZURE_CREDENTIALS={
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}

# Azure Resource Details
AZURE_RESOURCE_GROUP=reverser-rg
AZURE_CONTAINER_APP_ENVIRONMENT=reverser-env
FRONTEND_CONTAINER_APP_NAME=reverser-frontend
BACKEND_CONTAINER_APP_NAME=reverser-backend

# Container App URLs (for health checks)
FRONTEND_CONTAINER_APP_URL=https://reverser-frontend.proudpond-12345678.eastus.azurecontainerapps.io
BACKEND_CONTAINER_APP_URL=https://reverser-backend.proudpond-12345678.eastus.azurecontainerapps.io
```

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the exact name and value from above

## Quick Setup Commands

```bash
# 1. Create resource group
az group create --name reverser-rg --location eastus

# 2. Create container registry
az acr create --resource-group reverser-rg --name <unique-registry-name> --sku Basic --admin-enabled true

# 3. Get ACR credentials
az acr credential show --name <registry-name>

# 4. Create service principal
az ad sp create-for-rbac --name "reverser-github-actions" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/reverser-rg \
  --sdk-auth

# 5. Create container apps environment
az containerapp env create \
  --name reverser-env \
  --resource-group reverser-rg \
  --location eastus
```