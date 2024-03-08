const asyncHandler = require('express-async-handler');
const Ratings = require('../models/ratingModel');
const User = require('../models/userModel');
const randIP = require('../utils/generateRandomIpAddress.js');
const cowsay = require('cowsay');


//@desc Serve the rating form
//@route GET /api/rate/:userId
//@access Public
const serveUserRatingPage = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            const cowMessage = `User with id ${userId} not found!`;
            res.status(500).send(`<pre>${cowMessage}</pre>`);
            return;
        }
        const encodedUserId = encodeURIComponent(userId);
        const encodedUserName = encodeURIComponent(user.name);

        const redirectUrl = `/views/rating-form.html?userId=${encodedUserId}&userName=${encodedUserName}`;
        res.redirect(redirectUrl);

        // res.render('rating-form', { userId: userId, userName: user.name });// ejs
    }
        catch (err) {
            const cowMessage = cowsay.say({ text: `Looks like this user has Mooooved!` });
            console.log(err.message);
            res.status(500).send(`<pre>${cowMessage}</pre>`);
        }
        
});

let firstTimePosting = true; 

const postRating = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { customerName, rating = 5, comments } = req.body;
    let ipAddress = req.ip || req.socket.remoteAddress;

    // Assuming randIP() is not required as we are using the real IP address now.
    const ratingData = { userId, customerName, rating, ipAddress, comments };

    if (!userId || !customerName) {
        return res.status(400).json({ message: "Missing required data!" });
    }

    let updatedRating;

    try {
        if (firstTimePosting) {
            firstTimePosting = false;
            const existingRating = await Ratings.findOne({ userId, ipAddress });
            const hasRated = !!existingRating;

            if (!hasRated) {
                console.log("Creating or Updating Rating...");
                updatedRating = await Ratings.findOneAndUpdate(
                    { userId, ipAddress },
                    ratingData,
                    { new: true, upsert: true }
                );
            }
        }

        const encodedUserId = encodeURIComponent(userId);
        const user = await User.findOne({ _id: userId });
        const encodedUserName = encodeURIComponent(user.name);

        // Redirect URL updated to be compliant with serving static HTML and passing parameters for client-side JS to use
        const redirectUrl = `/views/thank-you.html?userId=${encodedUserId}&userName=${encodedUserName}`;
        return res.redirect(redirectUrl);

    } catch (err) {
        console.error("Error processing rating:", err);
        return next(err);
    }
});


//@desc Get all ratings by userId
//@route GET /api/ratings/:userId
//@access Public
const getRatingsByUserId = asyncHandler(async (req, res, next) => {
    try {
        const ratings = await Ratings.find({ userId: req.params.userId });
        if (!ratings) {
            throw new Error('No ratings found for this user');
        }
        res.status(200).json(ratings);
    } catch (err) {
        next(err);
    }
});

//@desc Delete all ratings by userId
//@route DELETE /api/rate/:userId
//@access Public
const deleteRatings = asyncHandler(async (req, res, next) => {
    try {
        // const ratings = await Ratings.deleteMany({ userId: req.params.userId });
        // if (!ratings) {
        //     throw new Error('No ratings found for this user');
        // }
        // res.status(200).json(`${ratings.deletedCount} ratings deleted for user ${req.params.userId}`);
    } catch (err) {
        next(err);
    }
});

module.exports = {serveUserRatingPage, postRating, getRatingsByUserId, deleteRatings};