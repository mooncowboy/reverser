# String Reverser

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

### Option 1: Run both services together
```bash
npm run dev
```

### Option 2: Run services separately

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
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── server.js
│   └── public/
│       ├── index.html
│       └── app.js
├── package.json
└── README.md
```