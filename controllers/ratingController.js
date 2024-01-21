const asyncHandler = require('express-async-handler');
const Ratings = require('../models/ratingModel');

const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, '../public/res/imgs/thankyou');


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


const getThankyouImage = asyncHandler(async (req, res) => {
        try {
            fs.readdir(directoryPath, (err, files) => {
            if (err) {
                res.status(500).send('Error reading images');
                return;
            }
            const randomIndex = Math.floor(Math.random() * files.length);
            const selectedImage = files[randomIndex];
            res.json({ imageUrl: `/res/imgs/thankyou/${selectedImage}` });
        });}
        catch (err) {
            next(err);
        }   
});

module.exports = {  getRatingsByUserId, getThankyouImage};