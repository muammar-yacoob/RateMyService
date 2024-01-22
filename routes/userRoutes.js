const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    serveUserProfilePage
} = require('../controllers/userController');

router.route('/api')
    .get(getAllUsers)
    .post(createUser);

router.route('/api/:email')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

router.get('/profile/:email', serveUserProfilePage);

module.exports = router;