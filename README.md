# String Reverser

[![Deploy Frontend](https://github.com/mooncowboy/reverser/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/mooncowboy/reverser/actions/workflows/deploy-frontend.yml)
[![Deploy Backend](https://github.com/mooncowboy/reverser/actions/workflows/deploy-backend.yml/badge.svg)](https://github.com/mooncowboy/reverser/actions/workflows/deploy-backend.yml)
[![Health Check](https://github.com/mooncowboy/reverser/actions/workflows/health-check.yml/badge.svg)](https://github.com/mooncowboy/reverser/actions/workflows/health-check.yml)

A simple web application that reverses strings, consisting of a frontend and backend built with Node.js and Express.

## Features

- **Frontend**: Clean, responsive web interface using HTML, jQuery, and Bootstrap
- **Backend**: RESTful API that reverses text strings
- **No Authentication**: Simple, straightforward usage
- **No Database**: Stateless operation

## Architecture

- **Frontend**: Express server serving static files (Port 3000)
- **Backend**: Express API server with string reversal endpoint (Port 4000)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reverser
```

2. Install dependencies for both applications:
```bash
npm run install-all
```

## Usage

### Option 1: Using Docker (Recommended)

**Run both services with docker-compose:**
```bash
docker-compose up
```

**Run in detached mode:**
```bash
docker-compose up -d
```

**Stop services:**
```bash
docker-compose down
```

### Option 2: Using Node.js directly

**Run both services together:**
```bash
npm run dev
```

**Run services separately:**

**Start Backend (Port 4000):**
```bash
npm run start-backend
```

**Start Frontend (Port 3000):**
```bash
npm run start-frontend
```

## Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Backend API (Port 4000)

#### POST /reverse
Reverses a text string sent in the request body.

**Request:**
```json
{
  "text": "Hello World"
}
```

**Response:**
```json
{
  "original": "Hello World",
  "reversed": "dlroW olleH"
}
```

#### GET /reverse/:text
Alternative endpoint to reverse text via URL parameter.

**Example:**
```
GET http://localhost:4000/reverse/Hello%20World
```

#### GET /
Health check endpoint.

## Environment Variables

Both applications support custom ports via the `PORT` environment variable:

- **Frontend**: `PORT=3000` (default)
- **Backend**: `PORT=4000` (default)

## Project Structure

```
reverser/
├── .github/
│   ├── workflows/
│   │   ├── deploy-backend.yml      # Backend deployment workflow
│   │   ├── deploy-frontend.yml     # Frontend deployment workflow
│   │   └── health-check.yml        # Health monitoring workflow
│   ├── DEPLOYMENT.md              # Detailed deployment guide
│   ├── secrets-template.md        # GitHub secrets template
│   └── setup-azure.sh             # Azure infrastructure setup script
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── package.json
│   ├── server.js
│   ├── Dockerfile
│   ├── .dockerignore
│   └── public/
│       ├── index.html
│       └── app.js
├── docker-compose.yml
├── package.json
└── README.md
```

## Docker Deployment

### Individual Services

**Build backend image:**
```bash
docker build -t reverser-backend backend/
```

**Build frontend image:**
```bash
docker build -t reverser-frontend frontend/
```

**Run backend container:**
```bash
docker run -p 4000:4000 reverser-backend
```

**Run frontend container:**
```bash
docker run -p 3000:3000 reverser-frontend
```

### Using Docker Compose (Recommended)

**Build all images:**
```bash
docker-compose build
```

**Run all services:**
```bash
docker-compose up
```

**Run in background:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs
```

**Stop all services:**
```bash
docker-compose down
```

## CI/CD Deployment

The project includes automated deployment to Azure Container Apps using GitHub Actions:

- **Frontend**: Deploys automatically when files in `frontend/` directory change
- **Backend**: Deploys automatically when files in `backend/` directory change

### Required GitHub Secrets

For Azure Container Apps deployment, configure these secrets in your GitHub repository:

```
AZURE_CONTAINER_REGISTRY              # ACR login server
AZURE_CONTAINER_REGISTRY_USERNAME     # ACR username  
AZURE_CONTAINER_REGISTRY_PASSWORD     # ACR password
AZURE_CREDENTIALS                     # Azure service principal (JSON)
AZURE_RESOURCE_GROUP                  # Resource group name
AZURE_CONTAINER_APP_ENVIRONMENT       # Container Apps environment
FRONTEND_CONTAINER_APP_NAME           # Frontend app name
BACKEND_CONTAINER_APP_NAME            # Backend app name
```

See [Deployment Documentation](.github/DEPLOYMENT.md) for detailed setup instructions.