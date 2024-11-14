const express = require('express');
// import express from "express";
// import appService from './appService.js'; // Add .js extension if necessary
 const appService = require('./appService');

const router = express.Router();
const fs = require('fs');
const FormData = require('form-data');

// ----------------------------------------------------------
// API endpoints
const formData = new FormData
formData.append('file', fs.createReadStream('CPSC304_Node_Project-main/UBCEats Database.xlsx'));

router.post('/upload', formData, {
    headers: formData.getHeaders(),
}).then(response => {
     console.log("File uploaded:", response.data);
}).catch(error => {
    console.error("Error uploading file:", error);
});

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/initiate-all-tables', async (req, res) => {
        const filePath = path.join(__dirname, 'uploads', 'UBCEats Database.xlsx'); // Path to the file on the server
    
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            try {
                // Call your function and pass the file path
                const tableCount = await appService.loadExcelFileToOracle(filePath); 
    
                if (tableCount >= 0) {
                    res.json({ success: true, count: tableCount });
                } else {
                    res.status(500).json({ success: false, message: 'Error processing the file' });
                }
            } catch (error) {
                console.error('Error processing the file:', error);
                res.status(500).json({ success: false, message: 'Error during file processing' });
            }
        } else {
            res.status(404).json({ success: false, message: 'File not found' });
        }
  
    
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

app.post('/upload', (req, res) => {
    const data = req.body.fileData; // Replace with actual data source (e.g., file buffer or JSON content)
    const serverFilePath = path.join(__dirname, 'uploads', 'uploadedFile.txt');

    // Ensure uploads directory exists
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

    // Write data to server file
    fs.writeFile(serverFilePath, data, (err) => {
        if (err) {
            console.error("Error writing to server file", err);
            res.status(500).send("Failed to write file.");
        } else {
            console.log("File saved to server successfully.");
            res.send("File uploaded and saved!");
        }
    });
});

router.get("/find-restaurants/:restaurantName", async (req, res) => {
    const {restaurantName} = req.params;
    const initiateResult = await appService.findRestaurant(restaurantName);
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


module.exports = router;