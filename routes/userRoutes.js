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
} = require('../controllers/userController');

// User management routes
router.get('/api/users', getAllUsers);

router.get('/api/users/:userId', getUser);
router.put('/api/users/:userId', updateUser);
router.delete('/api/users/:userId', deleteUser);

// Authentication and account management routes
router.post('/api/users/signup', signUpUser);
router.get('/api/users/verify-email/:token', verifyEmail); 
router.post('/api/users/login', loginUser);
router.post('/api/users/forgot-password', forgotPassword);
router.post('/api/users/reset-password/:token', resetPassword);

//Usage route
router.get('/', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'views', 'usage.html')));

module.exports = router;