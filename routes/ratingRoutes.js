const express = require('express');
const router = express.Router();
const { serveForm, getRatingByUserId, postRating, updateRating } = require('../controllers/ratingController');

// Route for serving the form with userId
router.get('/:userId/form', serveForm);

// Routes for user ratings
// router.route('/:userId')
//     .get(getRatingByUserId)
//     .post(postRating)
//     .put(updateRating);

module.exports = router;