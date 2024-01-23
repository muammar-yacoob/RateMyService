const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const loginUser = asyncHandler(async (req, res) => {
    try{
    const email = req.params.email;
    const user = await User.findOne({ email: email });
    res.render('user-profile', { username: user.username, email: user.email });
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = { loginUser };