const express = require('express');
// import express from "express";
// import appService from './appService.js'; // Add .js extension if necessary

const appService = require('./appService');

const router = express.Router();



// ----------------------------------------------------------
// API endpoints

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    console.log(isConnect)
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});


router.post('/addUserProfile', async (req, res) => {
    try {
        const { username, first_name, last_name, email, location } = req.body;
        console.log("username:", username);
        const updateResult = await appService.addUserProfile(username, first_name, last_name, email, location);
        if (updateResult) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false , message: "Username or email already exists"});
        }
    } catch (error) {
        next(error);
    }

});

router.post('/addUserLocation', async (req, res) => {
    const { location } = req.body;
    const updateResult = await appService.addUserLocation( location);
    if (updateResult) {
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
router.get("/fetch-user-review/:reviewID", async (req, res) => {
    const reviewID = req.params.reviewID;
    console.log(reviewID)
    const initiateResult = await appService.fetchAUserReview(reviewID);
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/fetch-user-reviews/:userName", async (req, res) => {
    const userName  = req.params.userName;
    console.log(userName)
    const initiateResult = await appService.fetchAllReviewsFromUser(userName);
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/fetch-all-restaurants", async (req, res) => {

    const initiateResult = await appService.fetchAllRestaurantsFromDb();
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/top-rated-by-cuisine", async (req, res) => {

    const initiateResult = await appService.fetchTopRatedByCuisineFromDb();
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/serving-all-diets", async (req, res) => {

    const initiateResult = await appService.fetchRestaurantsServingAllDietsFromDb();
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/update-user-review", async (req, res) => {
    const {newContent, columnName, reviewID} = req.body;
    console.log("Req Body: " , req.body)
    console.log(columnName)
    const updateResult = await appService.updateReviewContent(newContent, columnName, reviewID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-review/:reviewID", async (req, res) => {
    const reviewID = req.params.reviewID;
    console.log(reviewID)
    const updateResult = await appService.deleteReviewContent(reviewID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.get("/menu/:location_name/:lat/:lon", async (req, res) => {
    const menu = await appService.fetchRestaurantMenuFromDb(req.params.lat, req.params.lon);
    console.log(menu);
    if (menu) {
        res.json({ success: true, result: menu});
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/filter-food", async (req, res) => {
    console.log("entered endpoint")
    const {dietTypes, allergenTypes} = req.body;
   // console.log(dietTypes, allergenTypes);
    const initiateResult = await appService.fetchMenuProfile(dietTypes, allergenTypes);
    //console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});


router.get("/check-username/:userName", async (req, res) => {
    console.log("entered endpoint")

    // console.log(dietTypes, allergenTypes);
    const initiateResult = await appService.checkUserName(req.params.userName)
    //console.log(initiateResult)
    if (initiateResult) {
        console.log("success")
        res.json({ success: true, result: initiateResult});
    } else {
        console.log("fail")
        res.status(500).json({ success: false });
    }
});

router.get("/check-unique/:username/:email", async (req, res) => {
    console.log("entered endpoint")

    const isUnique = await appService.checkUserProfileUnique(req.params.username, req.params.email)
    console.log("unique: " + isUnique);
    console.log("success");
    res.json({ success: true, result: isUnique});
    // if (isUnique) {
    //     console.log("success")
    //     res.json({ success: true, result: isUnique});
    // } else {
    //     console.log("fail")
    //     res.status(500).json({ success: false });
    // }
});


router.get("/fetch-food-having/:description", async (req, res) => {
    console.log("entered endpoint")
    const description = req.params.description;
    const isUnique = await appService.fetchFoodFromDescription(description);
    console.log("unique: " + isUnique);
    console.log("success");
    res.json({ success: true, result: isUnique});

});

module.exports = router;