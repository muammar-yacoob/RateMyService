const asyncHandler = require('express-async-handler');
const Ratings = require('../models/ratingModel');


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

module.exports = {  getRatingsByUserId};