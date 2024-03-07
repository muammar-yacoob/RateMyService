const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    workplace: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    signup_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", usersSchema);
