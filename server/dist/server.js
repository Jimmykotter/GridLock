import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../src/schemas/typeDefs';
import resolvers from '../src/schemas/resolvers';
import { connectDB } from '../src/config/connection.js';
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function startServer() {
    // 1. Connect to MongoDB Atlas (with ping verification)
    const mongoClient = await connectDB();
    // 2. Initialize Apollo GraphQL server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req, mongoClient })
    });
    await server.start();
    // 3. Create Express application and apply GraphQL middleware
    const app = express();
    server.applyMiddleware({ app });
    // 4. Start listening
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}`));
}
// Start the server
startServer().catch(error => {
    console.error('❌  Server failed to start:', error);
    process.exit(1);
});
