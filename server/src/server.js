import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
// **Your existing connection helper lives here:**
import connection from './config/connection.js';
// **Point at your GraphQL files under src/graphql:**
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
// Import the authenticate function
import { authenticateToken } from './utils/auth.js';
dotenv.config();
connection();
async function start() {
    const app = express();
    app.use(express.json());
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
    server.applyMiddleware({ app: app, path: '/graphql' });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 GraphQL at http://localhost:${PORT}${server.graphqlPath}`));
}
start();
