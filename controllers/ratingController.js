const asyncHandler = require('express-async-handler');
const Ratings = require('../models/ratingModel');
const User = require('../models/userModel');
const getThankyouImage = require('../utils/thankYouImageHelper.js');
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

        res.render('rating-form', { userId: userId, userName: user.name });
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

    //ipAddress = await randIP();
    const ratingData = { userId, customerName, rating, ipAddress, comments };

    if (!userId || !customerName || !rating) {
        throw new Error("Missing data!");
    }

    let hasRated = false;
    let updatedRating;

    try {
        if (firstTimePosting) {
            firstTimePosting = false;
            ipAddress
            const existingRating = await Ratings.findOne({ userId, ipAddress });
            hasRated = !!existingRating;

            console.log("Posting Rating...");
            updatedRating = await Ratings.findOneAndUpdate(
                { userId, ipAddress },
                ratingData,
                { new: true, upsert: true }
            );
        }

        const ratingScore = updatedRating ? updatedRating.rating : 'N/A';
        const again = hasRated ? ' again' : '';
        const thankYouImage = await getThankyouImage();

        console.log("Rendering thank-you with:", { ratingScore, again });
        res.render('thank-you', { ratingScore, again, thankYouImage});

    } catch (err) {
        next(err);
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