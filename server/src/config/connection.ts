import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const db = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  await mongoose.connect(uri);
  console.log('Database connected successfully');
};

export default db;

