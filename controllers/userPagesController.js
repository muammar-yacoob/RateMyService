const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
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
        const ipAddress = user.ipAddress;
        if(ipAddress == req.ip){
            res.redirect('thank-you');
        }
        else{
            res.render('rating-form', { userId: userId, userName: user.name });
        }

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

module.exports = { serveUserRatingPage, serveUserProfilePage };