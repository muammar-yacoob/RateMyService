require('dotenv').config();
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

connectDb(process.env.CONNECTION_STRING);

//Routes
app.use("/", userRoutes);
app.use("/", ratingRoutes);
app.use("/", homeExapmleRoute);


app.use(errorHandler);

if (process.env.MODE === 'server') {
    // Express Server mode
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
} else {
    // Serverless mode
    module.exports.handler = serverless(app);
}