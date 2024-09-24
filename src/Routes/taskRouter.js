import express from 'express';
import { createTask, getTasksByBoard, updateTaskStatus, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

// Task Routes
router.get('/:board', getTasksByBoard);
router.post('/', createTask);
router.put('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
