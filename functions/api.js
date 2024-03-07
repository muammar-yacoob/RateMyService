﻿require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const connectDb = require('../config/dbConnection');
const appSetup = require('../config/appSetup');
const userRoutes = require('../routes/userRoutes');
const ratingRoutes = require('../routes/ratingRoutes');
const homeExapmleRoute = require('../routes/homeExampleRoute');
const errorHandler = require('../middleware/errorHandler');

const app = express();
appSetup(app);

connectDb();

//Routes
app.use("/", userRoutes);
app.use("/", ratingRoutes);
app.use("/", homeExapmleRoute);


app.use(errorHandler);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports.handler = serverless(app);