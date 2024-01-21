const express = require('express');
const router = express.Router();
const { serveForm, getRatingsByUserId, postRating, updateRating ,deleteRatings} = 
require('../controllers/ratingController');

// Route for serving the form with userId
// router.get('/rate/:userId', serveForm);

// Routes for user ratings
router.route('/:userId')
    .get(getRatingsByUserId)
    .delete(deleteRatings);
    // .post(postRating)
    // .put(updateRating);
   
module.exports = router;