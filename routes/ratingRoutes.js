const express = require('express');
const router = express.Router();
const { serveForm, serveUserProfile, getRatingsByUserId, postRating, updateRating } = 
require('../controllers/ratingController');

// Route for serving the form with userId
router.get('/:userId/form', serveForm);
router.get('/:email/userProfile', serveUserProfile);

// Routes for user ratings
router.route('/:userId')
    .get(getRatingsByUserId)
    .post(postRating)
    .put(updateRating);

module.exports = router;