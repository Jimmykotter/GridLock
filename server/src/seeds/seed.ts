// server/src/seeds/seed.ts

import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import profileSeeds from './profileData.json' with { type: 'json' };
import statsSeeds from './statsData.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDatabase = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/GridLock';
  const client = new MongoClient(uri);

  try {
    console.log(`📡 Connecting to MongoDB at: ${uri}`);
    await client.connect();
    console.log('✅ Connected to MongoDB.');

    const dbName = 'GridLock'; // Replace with your database name if different
    const db = client.db(dbName);

    console.log(`📂 Using database: ${dbName}`);
    console.log(`📂 Writing to collections: 'users' and 'stats'`);

    // Ensure all entries in `profileSeeds` have a unique `_id`
    const formattedProfiles = profileSeeds.map((profile) => {
      const { _id, ...rest } = profile;

      // Generate a new ObjectId if `_id` is missing or invalid
      if (!_id || !_id.match(/^[a-fA-F0-9]{24}$/)) {
        return { ...rest, _id: new ObjectId() };
      }

      // Convert valid `_id` strings to ObjectId
      return { ...rest, _id: new ObjectId(_id) };
    });

    // Ensure all entries in `statsSeeds` have a unique `_id`
    const formattedStats = statsSeeds.map((stat) => {
      const { _id, ...rest } = stat;

      // Generate a new ObjectId if `_id` is missing or invalid
      if (!_id || !_id.match(/^[a-fA-F0-9]{24}$/)) {
        return { ...rest, _id: new ObjectId() };
      }

      // Convert valid `_id` strings to ObjectId
      return { ...rest, _id: new ObjectId(_id) };
    });

    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    const usersResult = await db.collection('users').deleteMany({});
    const statsResult = await db.collection('stats').deleteMany({});
    console.log(`🗑️ Deleted ${usersResult.deletedCount} documents from the 'users' collection.`);
    console.log(`🗑️ Deleted ${statsResult.deletedCount} documents from the 'stats' collection.`);

    // Insert seed profiles into `users` collection
    const insertedProfiles = await db.collection('users').insertMany(formattedProfiles);
    console.log(`🌱 Inserted ${insertedProfiles.insertedCount} profiles into the 'users' collection.`);

    // Insert seed stats into `stats` collection
    const insertedStats = await db.collection('stats').insertMany(formattedStats);
    console.log(`🌱 Inserted ${insertedStats.insertedCount} stats into the 'stats' collection.`);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error seeding database: ${error.message}`);
    } else {
      console.error('❌ Error seeding database: An unknown error occurred.');
    }
  } finally {
    await client.close();
    console.log('🔒 Connection to MongoDB closed.');
  }
};

seedDatabase();