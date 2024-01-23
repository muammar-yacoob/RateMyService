const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    forgotPassword,
    currentUser,
} = require('../controllers/authController');

router.route('/:email')
    .post(loginUser);

module.exports = router;