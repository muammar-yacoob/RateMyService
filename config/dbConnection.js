const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('Connected to:', conn.connection.name);
        // If you want to log more details about the connection, do it here
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDb;