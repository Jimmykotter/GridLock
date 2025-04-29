import { Profile, Game } from '../models';
import { AuthenticationError } from '../utils/auth.js';

// Define types for context and arguments
interface Context {
  user?: { _id: string }; // Adjust based on your actual user structure
}

interface AuthenticatedContext extends Context {
  user: { _id: string }; // Make 'user' required
}

interface CreateGameInput {
  input: {
    opponentId: string;
    moves: { position: string }[];
  };
}

// Type guard to check if the user is authenticated
function isAuthenticated(context: Context): context is AuthenticatedContext {
  return context.user !== undefined;
}

const resolvers = {
  Query: {
    games: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!isAuthenticated(context)) {
        throw new AuthenticationError('User is not authenticated');
      }

      return Game.find(); // Optionally restrict to admin
    },
    myGames: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!isAuthenticated(context)) {
        throw new AuthenticationError('User is not authenticated');
      }

      return Game.find({ players: context.user._id });
    },
  },

  Mutation: {
    createGame: async (
      _parent: unknown,
      { input }: CreateGameInput,
      context: Context
    ) => {
      if (!isAuthenticated(context)) {
        throw new AuthenticationError('User is not authenticated');
      }

      const userId = context.user._id;

      // Build the players array (you + opponent)
      const players = [userId, input.opponentId];
      // Map moves to include user’s ID (you can adjust logic as needed)
      const moves = input.moves.map((m) => ({
        player: userId,
        position: m.position,
      }));

      const newGame = await Game.create({
        players,
        moves,
        result: 'pending', // initial
      });

      return newGame;
    },
  },

  // Resolve nested Profile objects inside Game.players
  Game: {
    players: async (game: { players: string[] }) => {
      return Profile.find({ _id: { $in: game.players } });
    },
  },
};

export default resolvers;
