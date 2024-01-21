const express = require('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();

const app = express();

// Set up the view engine for EJS
app.set('view engine', 'ejs');
app.set('views', './views');

connectDb();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use("/api/user", require("./routes/userApiRoutes"));
app.use("/api/rate", require("./routes/ratingRoutes"));
app.use("/user", require("./routes/userPagesRoutes")); // User pages

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));