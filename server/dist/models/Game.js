import { Schema, model } from 'mongoose';
// 2. Sub-schema for a single move
const moveSchema = new Schema({
    player: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    position: { type: Number, required: true, min: 0, max: 8 },
}, { _id: false });
// 3. Main Game schema
const gameSchema = new Schema({
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
}, {
    timestamps: true, // adds createdAt & updatedAt
});
// 4. Create & export the Model
const Game = model('Game', gameSchema);
export default Game;
