// server/server.ts

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefs, resolvers } from './schemas/index.js';   // your GraphQL schema + resolvers
import { authenticateToken } from './utils/auth.js';         // your JWT helper

// 2️⃣  Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1️⃣  Load .env (adjust path if your .env lives elsewhere)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function startServer() {
  // ─── Connect to MongoDB ───────────────────────────────────
  const mongoURI =
    process.env.MONGODB_URI ||                            // preferred env var
    process.env.MONGO_URI ||                              // fall back if you still use MONGO_URI
    'mongodb://127.0.0.1:27017/GridLock';                 // local default

  try {
    await mongoose.connect(mongoURI, {
      // these two options are no-ops in Mongoose ≥6, but harmless if present
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log(`✅  Connected to MongoDB at ${mongoURI}`);
  } catch (err) {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  }

  // ─── Set up Apollo Server ─────────────────────────────────
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  // ─── Set up Express ──────────────────────────────────────
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ─── Apply GraphQL middleware ────────────────────────────
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // authenticateToken reads the header or body, attaches req.user
        const contextReq = await authenticateToken({ req });
        return { user: contextReq.user };
      },
    })
  );

  // ─── Serve client in production ───────────────────────────
  if (process.env.NODE_ENV === 'production') {
    const clientDist = path.join(__dirname, '../client/dist');
    app.use(express.static(clientDist));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // ─── Start HTTP listener ──────────────────────────────────
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀  Server ready at http://localhost:${PORT}/graphql`)
  );
}

startServer().catch(err => {
  console.error('❌  Server failed to start:', err);
  process.exit(1);
});
