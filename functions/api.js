require('dotenv').config(); // Ensure this is the very first line

const express = require('express');
const serverless = require('serverless-http');
const connectDb = require('../config/dbConnection');
const appSetup = require('../config/appSetup');
const userRoutes = require('../routes/userRoutes');
const ratingRoutes = require('../routes/ratingRoutes');
const errorHandler = require('../middleware/errorHandler');
const passport = require('passport');

const app = express();
appSetup(app);

connectDb(process.env.CONNECTION_STRING);

// Google SignIn routes should be before applying the authenticateToken middleware
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => res.redirect('/'));

app.use("/", userRoutes);
app.use("/", ratingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (process.env.MODE === 'server') {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
} else {
    module.exports.handler = serverless(app);
}
