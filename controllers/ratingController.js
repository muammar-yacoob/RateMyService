const asyncHandler = require('express-async-handler');
const Ratings = require('../models/ratingModel');
const User = require('../models/userModel');

//@desc Get all ratings by userId
//@route GET /api/rate/:userId
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

//@desc Post a rating
//@route POST /api/rate/:userId
//@access Public
const postRating = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { customerName, rating, comments } = req.body;

    if (!userId || !customerName || !rating) {
        throw new Error("Missing data!");
    }
    try {
        const ipAddress = req.ip || req.socket.remoteAddress;
        const ratingData = { userId, customerName, rating, ipAddress, comments };
        const newRating = await Ratings.create(ratingData);
        console.log("redirect to thank you page...");
        res.redirect('thank-you');
    } catch (err) {
        next(err);
    }
});

//@desc Update a rating
//@route PUT /api/rate/:userId
//@access Public
const updateRating = asyncHandler(async (req, res, next) => {
    try {
        const rating = await Ratings.findOneAndUpdate({ userId: req.params.userId }, req.body, { new: true });
        if (!rating) {
            throw new Error('Rating not found');
        }
        res.status(200).json(rating);
        res.redirect('thank-you');
    } catch (err) {
        next(err);
    }
});

module.exports = {  getRatingsByUserId, postRating, updateRating};