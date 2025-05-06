import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import connection from './config/connection.js';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { authenticateToken } from './utils/auth.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

async function startServer() {
  try {
    // Initialize database connection
    await connection();
    console.log('✅ Database connected successfully');

    // Initialize Express app
    const app = express();
    app.use(express.json());

    // Mount routes
    app.use('/api/auth', authRoutes);

    // Initialize Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const user = token ? await authenticateToken(token) : null;
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
