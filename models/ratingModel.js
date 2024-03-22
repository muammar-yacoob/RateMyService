const mongoose = require('mongoose');
const ratingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    customerName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20

    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        required: false,
        max_length: 200
    },
    ipAddress: {
        type: String,
        required: false
        //trim: true,
    },
    ratingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Ratings", ratingsSchema);