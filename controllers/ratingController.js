const asyncHandler = require('express-async-handler');
const Ratings = require('../models/ratingModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../public/res/imgs/thankyou');

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
const serveUserProfile = asyncHandler(async (req, res, next) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User not found');
        }
        res.render('user-profile', { user: user });

    } catch (err) {
        next(err); // Pass the error to the error handler
    }
});

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
        // console.log(newRating);
        // res.status(201).json(newRating);
        console.log("redirect to thank you page...");

        let thankYouImages = fs.readdirSync(directoryPath);
        const randomIndex = Math.floor(Math.random() * thankYouImages.length);
        const selectedImage = thankYouImages[randomIndex];
        res.render('thank-you', { selectedImage: `/res/imgs/thankyou/${selectedImage}` });

        // res.render('thank-you');
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

module.exports = { serveForm, getRatingsByUserId, postRating, updateRating , serveUserProfile};