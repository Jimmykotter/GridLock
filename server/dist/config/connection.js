import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/GridLock';
mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
export default mongoose.connection;
