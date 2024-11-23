const express = require('express');
// import express from "express";
// import appService from './appService.js'; // Add .js extension if necessary
 const appService = require('./appService');

const router = express.Router();


// ----------------------------------------------------------
// API endpoints

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

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/find-restaurants", async (req, res) => {
    console.log("entered endpoint")
    const restaurantName = req.query.restaurantName;
    const initiateResult = await appService.findRestaurant(restaurantName);
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-review-content", async (req, res) => {
    const { oldContent, newContent, userName, restLong, restLat} = req.body;
    const updateResult = await appService.updateReviewContent(oldContent, newContent, userName, restLong, restLat);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/add-to-dietary-profile", async (req, res) => {
    const {foodType, userName, profileName} = req.body;
    const updateResult = await appService.addItemToDietaryProfile(foodType, userName, profileName)
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/remove-from-dietary-profile", async (req, res) => {
    const {foodType, userName, profileName} = req.body;
    const updateResult = await appService.removeItemFromDietaryProfile(foodType, userName, profileName)
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/remove-review-content", async (req, res) => {
    const {content, userName, restLong, restLat} = req.body;
    const updateResult = await appService.deleteReviewContent(content, userName, restLong, restLat);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});





module.exports = router;