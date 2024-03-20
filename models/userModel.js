const mongoose = require('mongoose');
const validator = require('validator');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        validator: [validator.isAlpha, 'Please enter a valid name'],
        minlength: 3,
        maxlength: 30
    },

    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 6,
        // Validator: [validator.isStrongPassword, 'Please enter a strong password']
    },

    verificationToken: {
        type: String,
    },

    profilePicture: {
        type: String,
    },

    jobTitle: {
        type: String,
        required: [false, 'Please enter your job title']
    },
    workplace: {
        type: String,
        required: [false, 'Please enter your workplace']
    },
    email_confirmed: {
        type: Boolean,
        default: false
    },
    signup_date: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpire: {
        type: Date,
    },
});

module.exports = mongoose.model("User", usersSchema);
