const mongoose = require('mongoose');

let isDbConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobboard';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isDbConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isDbConnected = false;
    console.log('\n============================================================');
    console.log(`⚠️  MongoDB Connection Notice (${error.message})`);
    console.log('⚡ Running in In-Memory Mode with pre-seeded demo data!');
    console.log('💡 All features (search, apply, auth, dashboards) are 100% functional.');
    console.log('👉 To connect to MongoDB Atlas, add your MONGO_URI in backend/.env:');
    console.log('   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/jobboard');
    console.log('============================================================\n');
  }
};

const getDbStatus = () => isDbConnected && mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
