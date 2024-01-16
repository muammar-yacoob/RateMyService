const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        // console.log('connecting to MongoDB... ',process.env.CONNECTION_STRING);
        const conn = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('connected to: ', conn.connection.name);
        console.log('Active connections: ', conn.connection.listenerCount.length);
    } catch (error) {
        console.log(`Error: ${error.message}`.red);
        process.exit(1);
    }
};
module.exports = connectDb;