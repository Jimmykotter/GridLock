import { Profile } from '../models/index.js';
import profileSeeds from './profileData.json' with { type: "json" };
import cleanDB from './cleanDB.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const seedDatabase = async () => {
    try {
        // No need to call db() here
        await cleanDB();
        await Profile.insertMany(profileSeeds);
        console.log('Seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error seeding database:', error.message);
        }
        else {
            console.error('Unknown error seeding database');
        }
        process.exit(1);
    }
};
seedDatabase();
