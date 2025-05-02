// server/connection.ts
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
// 1. Load env vars (works whether your .env lives in /server or one folder up)
dotenv.config({
    path: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? './.env' : '../.env')
});
const uri = process.env.MONGODB_URI ||
    'mongodb+srv://<db_username>:<db_password>@gridlock.iajzdqi.mongodb.net/?retryWrites=true&w=majority&appName=GridLock';
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
/**
 * Connects to MongoDB Atlas, pings the "admin" DB to verify
 * the connection, and returns the client.
 */
export async function connectDB() {
    try {
        console.log('📡  Connecting to MongoDB at:', uri);
        await client.connect(); // (optional in v4.7+)
        await client.db('admin').command({ ping: 1 }); // verify
        console.log('✅  Successfully pinged your deployment.');
        return client;
    }
    catch (error) {
        console.error('❌  MongoDB connection failed:', error);
        process.exit(1);
    }
}
