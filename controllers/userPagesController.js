const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Ratings = require('../models/ratingModel');
const CowSay = require('cowsay');

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

//@desc Post a rating
//@route POST /rate/:userId
//@access Public
const postRating = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { customerName, rating = 5, comments } = req.body; // Renamed `rating` to `ratingValue`
    const ipAddress = req.ip || req.socket.remoteAddress;
    const ratingData = { userId, customerName, rating: rating, ipAddress, comments };

    if (!userId || !customerName || !rating) {
        throw new Error("Missing data!");
    }

    try {
        const existingRating = await Ratings.findOne({ userId: userId, ipAddress: ipAddress });
        let hasRated = !!existingRating;

        const updatedRating = await Ratings.findOneAndUpdate(
            { userId: userId, ipAddress: ipAddress },
            ratingData,
            { new: true, upsert: true }
        );

        const ratingScore= updatedRating.rating;
        const again = hasRated ? ' again' : '';
        console.log("Rendering thank-you with:", { ratingScore, again });
        res.render('thank-you2', { ratingScore, again });

    } catch (err) {
        next(err);
    }
});

module.exports = { serveUserRatingPage, serveUserProfilePage, postRating };