const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const emailjsService = require('../utils/emailjsService');
const emailService = new emailjsService;

//#region Authentication and account management routes
/**
 * Signs up a new user, hashes their password, and sends a verification email.
 */
const signUpUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).send('Please provide a name, email, and password');
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = await User.create({
        name, 
        email, 
        password: hashedPassword,
        verificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex')
    });

    const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/users/verify-email/${verificationToken}`;

    print(verifyEmailUrl);
    await emailService.sendEmail({
        to: user.email,
        subject: "Verify Your Email Address",
        text: `Hello ${user.name},\n\nPlease verify your email address by clicking on the link below:\n${verifyEmailUrl}\n\nIf you did not create an account, no further action is required.`
    });

    res.status(201).json({ _id: user.id, name: user.name, email: user.email });
});

/**
 * Verifies a user's email address using a token.
 */
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        verificationToken: hashedToken
    });

    if (!user) {
        res.status(400).send('Invalid token');
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
});

/**
 * Logs in a user and returns a token.
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).send('Invalid email or password');
    }
});

/**
 * Sends a password reset email to a user.
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        // res.status(404).throw Error('User not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process within 10 minutes of receiving it:\n\n
               ${resetLink}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.`
    });

    res.status(200).json({ success: true, message: 'Email sent' });
});

/**
 * Resets a user's password using a token.
 */
const resetPassword = asyncHandler(async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400).send('Invalid token');
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
});

/**
 * Allows a user to sign in with Google.
 */
const googleSignIn = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const { name, email, picture } = ticket.getPayload();
    const user = await User.findOneAndUpdate({ email }, { name, email, picture }, { upsert: true, new: true });
    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user._id),
    });
});

/**
 * Generates a JWT token for a user.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

//#endregion


//#region User management routes
/// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

/// Get a user by id
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.status(200).json(user);
});

/// Update a user by id
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    res.status(200).json(user);
});

/// Delete a user by id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.status(200).json({ message: `${user.name} deleted successfully` });
});
//#endregion

module.exports = {
    signUpUser, verifyEmail,
    loginUser, googleSignIn, forgotPassword, resetPassword,
    getAllUsers, getUser, updateUser, deleteUser,
};
