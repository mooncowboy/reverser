# Azure Container Apps Deployment

This document describes the deployment process for the Reverser application to Azure Container Apps using GitHub Actions.

## Required GitHub Secrets

Before running the deployment workflows, you need to configure the following secrets in your GitHub repository:

### Azure Container Registry Secrets
```
AZURE_CONTAINER_REGISTRY              # ACR login server (e.g., myregistry.azurecr.io)
AZURE_CONTAINER_REGISTRY_USERNAME     # ACR username
AZURE_CONTAINER_REGISTRY_PASSWORD     # ACR password or access token
```

### Azure Container Apps Secrets
```
AZURE_CREDENTIALS                     # Azure service principal credentials (JSON)
AZURE_RESOURCE_GROUP                  # Azure resource group name
AZURE_CONTAINER_APP_ENVIRONMENT       # Container Apps environment name
FRONTEND_CONTAINER_APP_NAME           # Frontend container app name
BACKEND_CONTAINER_APP_NAME            # Backend container app name
```

## Quick Setup with Script

For a quick automated setup, use the provided script:

```bash
# Make sure you're logged in to Azure CLI
az login

# Run the setup script
./.github/setup-azure.sh
```

The script will:
1. Create all required Azure resources
2. Generate a service principal for GitHub Actions
3. Output all the secrets you need to configure in GitHub

## Manual Setup

If you prefer to set up resources manually, follow these steps:

### 1. Create a Service Principal

```bash
# Create service principal with contributor role
az ad sp create-for-rbac --name "reverser-github-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group-name} \
  --sdk-auth
```

The output should look like:
```json
{
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
```

Use this entire JSON output as the value for the `AZURE_CREDENTIALS` secret.

### 2. Create Azure Container Registry

```bash
# Create ACR
az acr create \
  --resource-group {resource-group-name} \
  --name {registry-name} \
  --sku Basic \
  --admin-enabled true

# Get ACR credentials
az acr credential show --name {registry-name}
```

### 3. Create Container Apps Environment

```bash
# Create Container Apps environment
az containerapp env create \
  --name {environment-name} \
  --resource-group {resource-group-name} \
  --location {location}
```

### 4. Create Container Apps (Optional - can be created by workflow)

```bash
# Create backend container app
az containerapp create \
  --name {backend-container-app-name} \
  --resource-group {resource-group-name} \
  --environment {environment-name} \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 4000 \
  --ingress external \
  --query properties.configuration.ingress.fqdn

# Create frontend container app
az containerapp create \
  --name {frontend-container-app-name} \
  --resource-group {resource-group-name} \
  --environment {environment-name} \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 3000 \
  --ingress external \
  --query properties.configuration.ingress.fqdn
```

## Workflow Triggers

### Frontend Deployment (`deploy-frontend.yml`)
- **Automatic**: Triggers when files in the `frontend/` directory are modified
- **Manual**: Can be triggered manually via GitHub Actions UI
- **Branches**: Runs on `main` and `devops` branches for pushes, `main` for PRs

### Backend Deployment (`deploy-backend.yml`)
- **Automatic**: Triggers when files in the `backend/` directory are modified
- **Manual**: Can be triggered manually via GitHub Actions UI
- **Branches**: Runs on `main` and `devops` branches for pushes, `main` for PRs

## Deployment Process

Each workflow performs the following steps:

1. **Checkout code**: Downloads the repository code
2. **Set up Docker Buildx**: Configures advanced Docker build features
3. **Login to ACR**: Authenticates with Azure Container Registry
4. **Build and push image**: Builds Docker image and pushes to ACR with caching
5. **Login to Azure**: Authenticates with Azure using service principal
6. **Deploy to Container Apps**: Deploys the new image to Azure Container Apps
7. **Logout**: Cleans up Azure authentication

## Environment Variables

### Frontend Container App
- `PORT=3000`
- `NODE_ENV=production`

### Backend Container App
- `PORT=4000`
- `NODE_ENV=production`

## Monitoring and Troubleshooting

### View Container App Logs
```bash
# Backend logs
az containerapp logs show \
  --name {backend-container-app-name} \
  --resource-group {resource-group-name} \
  --follow

# Frontend logs
az containerapp logs show \
  --name {frontend-container-app-name} \
  --resource-group {resource-group-name} \
  --follow
```

### Check Container App Status
```bash
# Get container app details
az containerapp show \
  --name {container-app-name} \
  --resource-group {resource-group-name} \
  --query properties.configuration.ingress.fqdn
```

### Common Issues

1. **Authentication Failures**: Verify Azure credentials and service principal permissions
2. **Image Not Found**: Check ACR credentials and image push status
3. **Port Conflicts**: Ensure target ports match application ports (3000 for frontend, 4000 for backend)
4. **Environment Variables**: Verify all required secrets are configured in GitHub

## Security Best Practices

1. **Least Privilege**: Service principal has minimal required permissions
2. **Secret Management**: All sensitive data stored as GitHub secrets
3. **Non-Root Containers**: Docker images run with non-root user
4. **Image Scanning**: Consider adding container image vulnerability scanning
5. **HTTPS Only**: Container Apps use HTTPS endpoints by default

## Cost Optimization

1. **Consumption Plan**: Container Apps use consumption-based pricing
2. **Auto-Scaling**: Apps scale to zero when not in use
3. **Shared Environment**: Both apps use the same Container Apps environment
4. **Image Caching**: Docker layer caching reduces build times and costs