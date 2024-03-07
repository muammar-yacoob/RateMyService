const mongoose = require('mongoose');
let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
      console.log('Using existing database connection');
      return cachedDb;
    }
    console.log('Creating new database connection');
    const db = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    cachedDb = db;
    return db;
  }

module.exports = connectToDatabase;