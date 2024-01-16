﻿const express = require('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();


connectDb();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/user", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(PORT, () =>  console.log(`Server listening on port ${PORT}`));
