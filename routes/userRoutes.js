const express = require('express');
const { isAuthenticated, authenticateToken } = require('../middleware/tokenAuth');

const router = express.Router();
const path = require('path');

const {
    currentUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,

    signUpUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    logout,
} = require('../controllers/userController');


// User management routes
router.get('/api/users/current', authenticateToken, currentUser);
router.get('/api/users', authenticateToken, isAuthenticated, getAllUsers);
router.get('/api/users/:userId', authenticateToken, isAuthenticated, getUser);
router.put('/api/users/:email', updateUser);
// router.delete('/api/users/:email', deleteUser);

// Account management routes
router.post('/api/users/signup', signUpUser);
router.get('/api/users/verify-email/:token', verifyEmail);
router.post('/api/users/forgot-password', forgotPassword);
router.post('/api/users/reset-password', resetPassword);

//Authentication routes
router.post('/api/users/login', loginUser);
router.delete('/api/users/logout', logout);



//Usage page route
router.get('/', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'views', 'usage.html')));

module.exports = router;