const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Ratings = require('../models/ratingModel');
const CowSay = require('cowsay');

const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, '../public/res/imgs/thankyou');
const getThankyouImage = async () => {
    try {
        const files = await fs.readdir(directoryPath);
        const randomIndex = Math.floor(Math.random() * files.length);
        const selectedImage = files[randomIndex];
        return `/res/imgs/thankyou/${selectedImage}`;
    } catch (err) {
        console.error(err);
        return '/res/imgs/sadface.gif'; // Default image
    }
}



//@desc Serve the rating form
//@route GET /api/rate/:userId
//@access Public
const serveUserRatingPage = asyncHandler(async (req, res, next) => {
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
const serveUserProfilePage = asyncHandler(async (req, res, next) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const msg = `User with email ${email} not found`;
            const cowMessage = CowSay.say({ text: msg });
            res.status(404).send(`<pre>${cowMessage}</pre>`);

            return;
        }
        res.render('user-profile', { user: user });

    } catch (err) {
        next(err); // Pass the error to the error handler
    }
});

let firstTimePosting = true; 
const postRating = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { customerName, rating = 5, comments } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const ratingData = { userId, customerName, rating, ipAddress, comments };

    if (!userId || !customerName || !rating) {
        throw new Error("Missing data!");
    }

    let hasRated = false;
    let updatedRating;

    try {
        if (firstTimePosting) {
            firstTimePosting = false;
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
        res.render('thank-you2', { ratingScore, again, thankYouImage});

    } catch (err) {
        next(err);
    }
});

module.exports = { serveUserRatingPage, serveUserProfilePage, postRating };