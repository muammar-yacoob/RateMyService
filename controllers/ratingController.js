const asyncHandler = require('express-async-handler');
const Ratings = require('../models/ratingModel');
const User = require('../models/userModel');

//@desc Serve the rating form
//@route GET /api/rate/:userId/form
//@access Public
const serveForm = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        res.render('rating-form', { userId: userId, userName: user.name });
    } catch (err) {
        next(err); // Pass the error to the error handler
    }
});

//@desc Get a rating by userId
//@route GET /api/rate/:userId
//@access Public
const getRatingByUserId = asyncHandler(async (req, res, next) => {
    try {
        const ratings = await Ratings.findOne({ userId: req.params.userId });
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
        res.status(201).json(newRating);
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
    } catch (err) {
        next(err);
    }
});

module.exports = { serveForm, getRatingByUserId, postRating, updateRating };