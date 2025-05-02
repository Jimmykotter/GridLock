import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultdb';
mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
});
mongoose.connection.on('connected', () => {
    console.log('Database connected successfully');
});
mongoose.connection.on('error', (err) => {
    console.error('Database connection error:', err);
});
export default mongoose.connection;
