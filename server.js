const express = require('express');
const appController = require('./appController');
require('dotenv').config();
const cors = require('cors');
const path = require('path');



// <<<<<<< HEAD:my-app/src/server.js
// // Load environment variables from .env file
// // Ensure your .env file has the required database credentials.
// const loadEnvFile = require('../utils/envUtil');
// // import express from 'express';
// // import loadEnvFile from './utils/envUtil.js';
// // import appController from './appController.js';
// const envVariables = loadEnvFile('../env');
// =======
// >>>>>>> hedie:server.js
const app = express();


const PORT = process.env.PORT || 65534;
//const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)

// Middleware setup
//app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());             // Parse incoming JSON payloads

app.use(cors());


// If you prefer some other file as default page other than 'index.html',
//      you can adjust and use the bellow line of code to
//      route to send 'DEFAULT_FILE_NAME.html' as default for root URL
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from 'public'

// Route for serving your specific HTML file
app.get('/', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'public', 'index.html'); // Resolve the path dynamically
    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            console.error('Error serving the HTML file:', err);
            res.status(500).send('Error serving the file.');
        }
    });
});

// mount the router
app.use('/', appController);


// ----------------------------------------------------------
// Starting the server
app.listen(PORT, async () => {
    
    console.log(`Server running at http://localhost:${PORT}/`);
});



