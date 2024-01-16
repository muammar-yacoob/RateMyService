const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        min_length: [3, 'Name cannot be less than 3 characters'],
        max_length: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        trim: true,
        min_length: [8, 'Email cannot be less than 8 characters'],
        max_length: [50, 'Email cannot be more than 50 characters']
    }
});

module.exports = mongoose.model('Users', usersSchema);