import { Schema, model, Document, Types } from 'mongoose';

// 1. Define the Game document interface
export interface IGame extends Document {
  players: Types.ObjectId[];                // the two players
  moves: { player: Types.ObjectId; position: number }[]; 
  result: 'X' | 'O' | 'draw' | 'pending';   // game outcome
  playedAt: Date;                           // when game was played
  createdAt: Date;
  updatedAt: Date;
}

// 2. Sub-schema for a single move
const moveSchema = new Schema<{
  player: Types.ObjectId;
  position: number;
}>({
  player: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  position: { type: Number, required: true, min: 0, max: 8 },
}, { _id: false });

// 3. Main Game schema
const gameSchema = new Schema<IGame>(
  {
    players: [
      { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    ],
    moves: [moveSchema],
    result: {
      type: String,
      enum: ['X', 'O', 'draw', 'pending'],
      default: 'pending',
    },
    playedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// 4. Create & export the Model
const Game = model<IGame>('Game', gameSchema);
export default Game;
