const fs = require('fs');
const path = require('path');

// Get the backend URL from environment variable or use default
const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';

console.log(`Building frontend with BACKEND_URL: ${backendUrl}`);

// Read the app.js file
const appJsPath = path.join(__dirname, 'public', 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Replace the hardcoded URL with the environment variable value
appJsContent = appJsContent.replace(
    "const BACKEND_URL = 'http://localhost:4000';",
    `const BACKEND_URL = '${backendUrl}';`
);

// Write the modified content back to the file
fs.writeFileSync(appJsPath, appJsContent);

console.log(`Successfully updated BACKEND_URL to: ${backendUrl}`);