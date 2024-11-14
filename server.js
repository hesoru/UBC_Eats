const express = require('express');
const appController = require('./appController');

// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const loadEnvFile = require('./utils/envUtil');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// import express from 'express';
// import loadEnvFile from './utils/envUtil.js';
// import appController from './appController.js'; 
const envVariables = loadEnvFile('./.env');
const app = express();
const localFilePath = path.join(__dirname, 'CPSC304_Node_Project-main/UBCEats Database.xlsx');
const serverFilePath = path.join(__dirname, 'uploads', 'UBCEats Database.xlsx');

// Function to copy our ubcEats excel sheet onto the server
function copyFileOnServerStart() {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("wrote to file")

    fs.promises.copyFile(localFilePath, serverFilePath)
        .then(() => {
            console.log("File copied successfully");
        })
        .catch((err) => {
            console.error("Error writing to file", err);
        });
   
}

// vs

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.toString('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    console.log("File uploaded successfully:", req.file);
    res.send("File uploaded and saved!");
});



const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)

// Middleware setup
app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());             // Parse incoming JSON payloads

// If you prefer some other file as default page other than 'index.html',
//      you can adjust and use the bellow line of code to
//      route to send 'DEFAULT_FILE_NAME.html' as default for root URL
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/DEFAULT_FILE_NAME.html');
// });


// mount the router
app.use('/', appController);


// ----------------------------------------------------------
// Starting the server
app.listen(PORT, async () => {
    await copyFileOnServerStart();
    
    console.log(`Server running at http://localhost:${PORT}/`);
});



