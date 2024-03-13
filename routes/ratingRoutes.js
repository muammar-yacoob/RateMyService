const express = require('express');
const router = express.Router();
const {
    serveUserRatingPage,
    getRatingsByUserId,
} = require('../controllers/ratingController');

router.get('/api/ratings/:userId', getRatingsByUserId);
router.get('/rate/:userId', serveUserRatingPage);

module.exports = router;