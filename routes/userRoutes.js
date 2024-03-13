const express = require('express');
const router = express.Router();
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

module.exports = router;