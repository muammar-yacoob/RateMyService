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

const postRating = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { customerName, rating = 5, comments, ipAddress } = req.body;
    
    // Validate required fields
    if (!userId || !customerName) {
        return res.status(400).json({ message: "Missing required data!" });
    }

    try {
        // Always update or insert the rating for given userId and ipAddress
        console.log("Creating or Updating Rating...");
        const updatedRating = await Ratings.findOneAndUpdate(
            { userId, ipAddress },
            { userId, customerName, rating, comments, ipAddress },
            { new: true, upsert: true } // Upsert to create a new document if one doesn't exist
        );

        // Fetch user details for redirection URL
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        const encodedUserId = encodeURIComponent(userId);
        const encodedUserName = encodeURIComponent(user.name);

        // Redirect after the database operations complete
        const redirectUrl = `/views/thank-you.html?userId=${encodedUserId}&userName=${encodedUserName}`;
        return res.redirect(redirectUrl);

    } catch (err) {
        console.error("Error processing rating:", err);
        return next(err);
    }
});


//@desc Get all ratings by userId
//@route GET /api/ratings/:userId
//@access Private
const getRatingsByUserId = asyncHandler(async (req, res, next) => {
    try {
        const ratings = await Ratings.find({ userId: req.params.userId }).sort({ ratingDate: -1 }); 
        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: 'No ratings found for this user' });
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