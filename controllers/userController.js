const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const mailService = require('../utils/gmailService');
// const mailService = require('../utils/zohoService');
const mailService = require('../utils/mockMail');
const cowsay = require('cowsay');


//#region Authentication and account management routes

/**
 * Generates a JWT token for a user.
 */
const generateToken = (_id) => jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '30d'});

//@desc Get current user
//@route GET /api/users/current
//@access Private
const currentUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json(user);
});

/**
 * Signs up a new user, hashes their password, and sends a verification email.
 */
const signUpUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = new Error('Missing name, email, or password');
        error.statusCode = 400;
        return next(error);
    }

    let user = await User.findOne({ email });

    // If user exists but hasn't verified their email, resend the verification email
    if (user && !user.email_confirmed) {
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        user.verificationToken = hashedToken;
        await user.save();

        // Resend the verification email
        const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/users/verify-email/${verificationToken}`;
        await mailService.sendEmail({
            to: user.email,
            subject: "Verify Your Email Address",
            text: `Hello ${user.name},\n\nPlease verify your email address by clicking on the link below:\n${verifyEmailUrl}\n\nIf you did not create an account, no further action is required.`
        });

        return res.status(200).send(`Verification email resent to ${user.email}. Please check your inbox.`);
    } else if (user) {
        // If user exists and has verified their email, return an error
        const error = new Error('User already exists and email is verified');
        error.statusCode = 400;
        return next(error);
    }

    // If new user, proceed with creation and send verification email
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    try {
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken: hashedToken,
            email_confirmed: false // Ensure this is set to false initially
        });

        const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/users/verify-email/${verificationToken}`;
        await mailService.sendEmail({
            to: user.email,
            subject: "Verify Your Email Address",
            text: `Hello ${user.name},\n\nPlease verify your email address by clicking on the link below:\n${verifyEmailUrl}\n\nIf you did not create an account, no further action is required.`
        });

        res.status(201).send(`${user.name} created. Confirm email: ${verifyEmailUrl}`);
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
});



/**
 * Verifies a user's email address using a token.
 */
const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // It's generally safe to log non-sensitive data; adjust logging as per your privacy policy
    console.log(`Verifying token (hashed): ${hashedToken}`);

    try {
        const user = await User.findOne({
            verificationToken: hashedToken,
        });

        if (!user) {
            // const cowMessage = cowsay.say({ text: `Email verification failed!` });
            const cowMessage = cowsay.say({ text: `Your token's so expired, even I wouldn't eat it. And I eat grass. Time for a new one!` });
            return res.status(400).send(`<pre>${cowMessage}</pre>`);
        }

        user.email_confirmed = true;
        user.verificationToken = undefined;
        await user.save();

        const cowMessage = cowsay.say({ text: `Email verified successfully!` });
        res.status(200).send(`<pre>${cowMessage}</pre>`);

    } catch (error) {
        next(error);
    }
});

/**
 * Logs in a user and returns a token.
 */
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id);
        const { _id, name, email } = user;
        return res.status(200).json({ _id, name, email, token });
    } else {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        next(error);
    }
});

/**
 * Sends a password reset email to a user.
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    await user.save(); // Save the updated user information

    const resetLink = `${req.protocol}://${req.get('host')}/views/reset-password-page.html?token=${resetToken}`;

    // For resetPassword, ensure you're hashing the token from the request the same way as when saving.



    await mailService.sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste it into your browser to complete the process within 10 minutes of receiving it:\n\n${resetLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`
    });

    res.status(200).json({ message: `Password reset link sent to ${user.email}.` });
});



/**
 * Resets a user's password using a token.
 */
const PASSWORD_HASH_COST = 10;
const resetPassword = asyncHandler(async (req, res, next) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return next(new Error('Missing token or password', 400));
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new Error('Invalid or expired token', 401));
    }

    user.password = await bcrypt.hash(password, PASSWORD_HASH_COST);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const cowMessage = cowsay.say({ text: `Password updated successfully!` });
    res.status(200).send(`<pre>${cowMessage}</pre>`);
});


/**
 * Allows a user to sign in with Google.
 */
const googleSignIn = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        const error = new Error('Missing token');
        error.statusCode = 400;
        return next(error);
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, picture } = ticket.getPayload();
        const user = await User.findOneAndUpdate({ email }, { name, email, picture }, { upsert: true, new: true });
        const token = generateToken(user._id);
        res.status(200).json({ _id, name, email, picture, token });
    }
    catch (error) {
        error.statusCode = 500;
        next(error);
    }
});


/**
 * Logs out a user.
 */
const logout = asyncHandler(async (req, res, next) => {
    if (req.cookies && req.cookies['auth_cookie']) {
        //clearing the cookie
        res.cookie('auth_cookie', '', { expires: new Date(0), httpOnly: true, path: '/' });
        return res.status(200).json({ message: 'Logout successful' });
    } else {
        return res.status(400).json({ title: "Logout Failed", message: "No active session to terminate" });
    }
});
//#endregion


//#region User management routes
/// Get all users
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    if (!users) {
        const error = new Error('No users found');
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json(users);
});

/// Get a user by id
const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) {
        const error = new Error(`User ${req.params.userId} not found`);
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json(user);
});

/// Update a user by email
const updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    if (!user) {
        const error = new Error(`User ${req.params.email} not found`);
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json(`User ${user.name} updated successfully\n${user}`);
});

/// Delete a user by email
const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) {
        const error = new Error(`User ${req.params.email} not found`);
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json({ message: `${user.name} deleted successfully` });
});
//#endregion

module.exports = {
    currentUser,
    signUpUser, verifyEmail,
    loginUser, googleSignIn, forgotPassword, resetPassword,logout,
    getAllUsers, getUser, updateUser, deleteUser,
};
