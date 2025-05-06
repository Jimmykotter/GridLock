import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust the type of 'user' as needed
    }
  }
}

export default async function startApollo(app: any): Promise<void> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.user }), // optionally, attach user from req
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}