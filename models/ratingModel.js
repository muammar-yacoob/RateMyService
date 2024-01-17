const mongoose = require('mongoose');
const ratingsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
        //trim: true,
        // min_length: 3,
        // max_length: 50
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        required: false
        //trim: true,
        // min_length: [8, 'Email cannot be less than 8 characters'],
        // max_length: [50, 'Email cannot be more than 50 characters']
    },
    geoLocation: {
        type: String,
        required: false
        //trim: true,
        // min_length: [8, 'Email cannot be less than 8 characters'],
        // max_length: [50, 'Email cannot be more than 50 characters']
    },
    ratingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Ratings", ratingsSchema);