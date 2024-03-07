const mongoose = require('mongoose');
let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return cachedDb;
  }

  if (mongoose.connection.readyState === 3) {
    await mongoose.disconnect();
  }

  console.log('Creating new database connection');
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
    cachedDb = null;
  });

  cachedDb = mongoose.connection;
  return cachedDb;
}

module.exports = connectToDatabase;