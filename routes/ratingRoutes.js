const express = require('express');
const router = express.Router();
const {
    serveUserRatingPage,
    postRating,
    getRatingsByUserId,
    deleteRatings
} = require('../controllers/ratingController');

router.route('/api/ratings/:userId?')
    .get(getRatingsByUserId)
    .post(postRating)
    .delete(deleteRatings);

router.get('/rate/:userId?', serveUserRatingPage);

module.exports = router;