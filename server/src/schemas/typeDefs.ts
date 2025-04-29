const typeDefs = `
  # --- existing Profile/Auth types here ---

+  type Move {
+    player: ID!
+    position: Int!
+  }

+  type Game {
+    id: ID!
+    players: [Profile!]!
+    moves: [Move!]!
+    result: String!
+    playedAt: String!
+    createdAt: String!
+    updatedAt: String!
+  }

+  input MoveInput {
+    position: Int!
+  }

+  input CreateGameInput {
+    opponentId: ID!
+    moves: [MoveInput!]!      # initial moves (if any)
+  }

  type Query {
    # --- existing queries ---
+   games: [Game!]!            # all games (admin)
+   myGames: [Game!]!          # only the authenticated user’s games
  }

  type Mutation {
    # --- existing auth/profile mutations ---
+   createGame(input: CreateGameInput!): Game!
  }
`;
export default typeDefs;
