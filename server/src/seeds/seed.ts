import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile.js';
// Import seed data from profileData.json
import profileSeeds from './profileData.json' with { type: 'json' };

dotenv.config();

async function seed() {
  const uri = process.env.MONGODB_URI!;
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  // Hash passwords in seed data
  const hashedSeeds = await Promise.all(
    profileSeeds.map(async (user: { name: string; email: string; password: string; record: string[] }) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  // Clean the collection first
  if (!mongoose.connection.db) {
    throw new Error('Database connection is not initialized');
  }
  await mongoose.connection.db.collection('profiles').deleteMany({});
  console.log('Cleaned DB');

  const result = await Profile.insertMany(hashedSeeds);
  console.log(`Inserted ${result.length} users`);

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
