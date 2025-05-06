// server/src/config/connection.ts
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const db = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(uri, {
    dbName: 'GridLock',   // explicitly target your GridLock database
  });

  console.log('✅ Database connected successfully to GridLock');
};

export default db;
