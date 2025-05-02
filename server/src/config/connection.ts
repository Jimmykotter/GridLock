import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/GridLock';

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected.');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed.');
  }
};

export default db;

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techquiz');

// export default mongoose.connection;

// // mongodb+srv://jimmykotter:n3uLqumcvvaorrjh@cluster0.agmqava.mongodb.net/Automerge?retryWrites=true&w=majority&appName=Cluster0

// 'mongodb+srv://gameAdmin:rootroot@gridlock.iajzdqi.mongodb.net/'


// import dotenv from 'dotenv';
// dotenv.config();

// import mongoose from 'mongoose';

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techquiz');

// export default mongoose.connection;

// // mongodb+srv://jimmykotter:n3uLqumcvvaorrjh@cluster0.agmqava.mongodb.net/Automerge?retryWrites=true&w=majority&appName=Cluster0

// mongodb+srv://gameAdmin:rootroot@gridlock.iajzdqi.mongodb.net/mongodb+srv://gameAdmin:rootroot@gridlock.iajzdqi.mongodb.net/GridLock

