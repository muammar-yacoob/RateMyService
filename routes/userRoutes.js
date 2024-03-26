const express = require('express');
const { isAuthenticated, authenticateToken } = require('../middleware/tokenAuth');

const router = express.Router();
const path = require('path');

const {
    getCurrentUser,
    getAllUsers,
    updateUser,

    signUpUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    logout,

    googleSignIn,
} = require('../controllers/userController');


// User management routes
router.get('/api/users/current', authenticateToken, isAuthenticated, getCurrentUser);
router.get('/api/users', authenticateToken, isAuthenticated, getAllUsers);
router.put('/api/users/:email', updateUser);

// Account management routes
router.post('/api/users/signup', signUpUser);
router.get('/api/users/verify-email/:token', verifyEmail);
router.post('/api/users/forgot-password', forgotPassword);
router.post('/api/users/reset-password', resetPassword);

//Authentication routes
router.post('/api/users/login', loginUser);
router.delete('/api/users/logout', logout);

//Social Media Authentication routes
router.post('/api/users/google-signin', googleSignIn);

//Usage page route
router.get('/', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'views', 'usage.html')));

module.exports = router;