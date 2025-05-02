import mongoose, { Schema, Document } from 'mongoose';

export interface IStats extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user
  gamesPlayed: number;
  wins: number;
  losses: number;
}

const statsSchema = new Schema<IStats>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Stats = mongoose.model<IStats>('Stats', statsSchema);
export default Stats;