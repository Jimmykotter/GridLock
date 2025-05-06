import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import connection from './config/connection.js';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { authMiddleware } from './utils/auth.js'; // Make sure this is the Express middleware
import jwt from 'jsonwebtoken';
dotenv.config();

async function startServer() {
  try {
    // Initialize database connection
    await connection();
    console.log('✅ Database connected successfully');

    // Initialize Express app
    const app = express();
    app.use(express.json());

    // Mount authentication middleware for REST endpoints
    app.use('/api/auth', authMiddleware);

    // Initialize Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        // For GraphQL, if you want to set user from token, you can process the token here too,
        // or rely on your authMiddleware (if it's run on GraphQL requests)
        const token = req.headers.authorization?.replace('Bearer ', '');
        let user = null;
        if (token) {
          try {
            // Optionally, re-use token verification logic here
            const { data } = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' }) as { data: any };
            user = data;
          } catch (err) {
            console.log('Invalid token for GraphQL context');
          }
        }
        return { user };
      },
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      const url = `http://localhost:${PORT}${server.graphqlPath}`;
      console.log(`🚀 GraphQL server ready at ${url}`);
      console.log(`🌐 Open your browser and navigate to: ${url}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
}

startServer();
