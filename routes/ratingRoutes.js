const express = require('express');
const router = express.Router();
const {
    getAllRatings,
    postRating,
    updateRating
} = require('../controllers/ratingController');

router.route('/:userId')
    .get(getAllRatings)
    .post(postRating)
    .put(updateRating);

module.exports = router;