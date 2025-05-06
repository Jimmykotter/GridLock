import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import db from './config/connection.js';
import authRoutes from './routes/authRoutes.js';
import startApollo from './startApollo.js';

const app = express();

// Enable CORS for your front‑end on port 3000
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Mount authentication routes (signup, login, and protected /me)
app.use('/api/auth', authRoutes);

// Mount GraphQL endpoint at /graphql
startApollo(app);

// Start the server after DB connection
const PORT = process.env.PORT || 4000;
db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB:', err);
    process.exit(1);
  });

