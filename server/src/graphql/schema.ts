import { gql } from 'apollo-server-express'; 

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    record: [String!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addResult(userId: ID!, result: String!): User!
    updateUser(id: ID!, name: String, email: String, password: String): User!
    deleteMe: Boolean!
  }
  
 type Game {
   id: ID!
   board: [String!]!     # 9 cells: "X","O", or ""
   players: [User!]!     # [playerX, playerO]
   turn: ID!             # current player’s userId
   status: String!       # "in-progress", "won", or "tie"
 }

 extend type Query {
   games: [Game!]!
   game(id: ID!): Game
 }

 extend type Mutation {
   createGame(playerIds: [ID!]!): Game!
   makeMove(gameId: ID!, position: Int!): Game!
   deleteGame(id: ID!): Boolean!
 }

`;
