const asyncHandler = require('express-async-handler');
const Ratings = require('../models/ratingModel');

//@desc Get user ratings
//@route GET /api/rate/:userId
//@access Public
const getAllRatings = asyncHandler(async (req, res) => {
    try{
        const ratings = await Ratings.findOne({userId: req.params.userId});
        res.status(200).json(ratings);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

//@desc Post a rating
//@route POST /rate/:userId
//@access Public
const postRating = asyncHandler(async (req, res) => {
    console.log(req.body);
    const userId = req.params.userId;
    const { customerName, rating, geoLocation, comments} = req.body;

    if (!userId || !customerName || !rating) {
        res.status(400);
        throw new Error("Missing data!");
    }
    try {
        //Post rating for user by userId
        const ratingData = { userId: userId, customerName: customerName, rating: rating, geoLocation: geoLocation, comments: comments };
        const ratings = await Ratings.create(ratingData);
        res.status(201).json(ratings);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

//@desc Update a user rating
//@route PUT /api/rate/:userId
//@access Public
const updateRating = asyncHandler(async (req, res) => {
    try{
        const rating = await Ratings.findOneAndUpdate({userId: req.params.userId}, req.body, {new: true});
        res.status(200).json(rating);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = {getAllRatings, postRating, updateRating};