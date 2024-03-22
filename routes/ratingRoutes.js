const express = require('express');
const { isAuthenticated, authenticateToken } = require('../middleware/tokenAuth');

const router = express.Router();
const {
    serveUserRatingPage,
    postRating,
    getRatingsForCurrentUser
} = require('../controllers/ratingController');

router.get('/rate/:userId', serveUserRatingPage);
router.post('/rate/:userId', postRating);
router.get('/api/users/ratings',  authenticateToken, isAuthenticated, getRatingsForCurrentUser);


module.exports = router;