import mongoose from 'mongoose';

// Define Task schema
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  priority: { type: String, default: 'low' },
  status: { type: String, enum: ['todo', 'inProgress', 'done'], default: 'todo' },
  board: { type: String, required: true },
});

// Create Task model
const Task = mongoose.model('Task', taskSchema);

export default Task;
