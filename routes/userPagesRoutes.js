const express = require('express');
const router = express.Router();
const {
    serveUserProfilePage,
    serveUserRatingPage
} = require('../controllers/userPagesController');

// router.get('/:userId', (req, res) => res.send(`Welcome to ${req.params.userId}'s profile page`));
router.route('/:email').get(serveUserProfilePage);
// router.get('/rate/:userId', (req, res) => res.send(`Welcome to ${req.params.userId}'s rating page`));
router.route('/rate/:userId').get(serveUserRatingPage);

module.exports = router;