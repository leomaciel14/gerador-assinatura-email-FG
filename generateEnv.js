const fs = require('fs');
const path = require('path');

// Caminho do arquivo de saída
const outputPath = path.join(__dirname, 'public', 'env.js');

// Certifique-se de que o diretório público existe
const dirPath = path.dirname(outputPath);
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

const envVars = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const content = `window.env = ${JSON.stringify(envVars)};`;

fs.writeFileSync(outputPath, content);
