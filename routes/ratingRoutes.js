const express = require('express');
const router = express.Router();
const {
    serveUserRatingPage,
    getRatingsByUserId,
    postRating
} = require('../controllers/ratingController');

router.get('/api/ratings/:userId', getRatingsByUserId);
router.post('/rate/:userId', postRating);


router.get('/rate/:userId', serveUserRatingPage);

module.exports = router;