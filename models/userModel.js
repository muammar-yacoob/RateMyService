const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        //trim: true,
        // min_length: 3,
        // max_length: 50
    },
    email: {
        type: String,
        required: true
        //trim: true,
        // min_length: [8, 'Email cannot be less than 8 characters'],
        // max_length: [50, 'Email cannot be more than 50 characters']
    },
    signup_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", usersSchema);