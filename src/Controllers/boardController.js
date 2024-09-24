import Board from '../Models/boardModel.js';

// Get all boards
export const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new board
export const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const newBoard = new Board({ name });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a board
export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    await Board.findByIdAndDelete(id);
    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
