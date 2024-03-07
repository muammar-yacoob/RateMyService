const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const CowSay = require('cowsay');

//@desc Serve the user profile page
//@route GET /profile/:email
//@access Public
const serveUserProfilePage = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId; 

    if (!userId) {
        return res.status(400).send('userId parameter is required');
    }

    // // console.log(`Serving user with userId: ${userId}`); 
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).send('Invalid userId');
    // }
    
    try {
        const user = await User.findOne({_id: userId});
        if (!user) {
            const msg = `User with id ${userId} not found!`;
            const cowMessage = CowSay.say({ text: msg });
            res.status(404).send(`<pre>${cowMessage}</pre>`);

            return;
        }
        res.render('user-profile', { user: user });

    } catch (err) {
        next(err); 
    }
});

//@desc Get all users
//@route GET /api/users
//@access Public
const getAllUsers = asyncHandler(async (req, res) => {
    console.log('Getting all users');
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

//@desc Get a user
//@route GET /api/users/:userId
//@access Public
const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId; 

    if (!userId) {
        return res.status(400).send('userId parameter is required');
    }

    // console.log(`Getting user with userId: ${userId}`);
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).send('Invalid userId');
    // }


    try {
        // Query based on MongoDB's _id field
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

//@desc Create a user
//@route POST /api/users
//@access Public
const createUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email } = req.body;

    if (!name || !email) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    try {
        // Create a user object to pass to User.create()
        const userData = { name, email };
        const user = await User.create(userData);
        res.status(201).json(`${user.name} created successfully`);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

//@desc Update a user
//@route PUT /api/users/:email
//@access Public
const updateUser = asyncHandler(async (req, res) => {
    try{
        const user = await User.findOneAndUpdate({email: req.params.email}, req.body, {new: true});
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

//@desc Delete a user
//@route DELETE /api/users/:email
//@access Public
const deleteUser = asyncHandler(async(req, res) => {
    try {
        const user = await User.findOneAndDelete({email: req.params.email});
        res.status(200).json(`${user.name} deleted successfully`);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = {serveUserProfilePage, getAllUsers, getUser, createUser, updateUser, deleteUser};