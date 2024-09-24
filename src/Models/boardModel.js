import mongoose from 'mongoose';

// Define Board schema
const boardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

// Create Board model
const Board = mongoose.model('Board', boardSchema);

export default Board;
