const express = require('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();


// Initialize the Express application
const app = express();

// Set up the view engine for EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Connect to the database
connectDb();

// Set the port
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/rate", require("./routes/ratingRoutes"));

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));