const express = require('express');
const router = express.Router();
const path = require('path');

const {
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
const { log } = require('console');

// User management routes
router.get('/api/users', getAllUsers);

router.get('/api/users/:userId', getUser);
router.put('/api/users/:email', updateUser);
// router.delete('/api/users/:email', deleteUser);

// Authentication and account management routes
router.post('/api/users/signup', signUpUser);
router.get('/api/users/verify-email/:token', verifyEmail); 
router.post('/api/users/login', loginUser);
router.post('/api/users/forgot-password', forgotPassword);
router.post('/api/users/reset-password', resetPassword);
router.delete('/api/users/logout', logout);


//Usage route
router.get('/', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'views', 'usage.html')));

module.exports = router;