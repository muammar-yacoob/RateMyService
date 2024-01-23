require('dotenv').config();
const express = require('express');
const connectDb = require('./config/dbConnection');
const appSetup = require('./config/appSetup');
const userRoutes = require('./routes/userRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
appSetup(app);

connectDb();
app.get('/',(req, res)=> res.render('login'));
app.use("/users", userRoutes);
app.use("/ratings", ratingRoutes);
// app.use("/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));