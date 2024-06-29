import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },
  comment: { type: String},
  date: { type: Date, default: Date.now },
});


const blogSchema = new mongoose.Schema({
  thumbnail: { type: String, required: true },
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  comments: [commentSchema],
});

export const blogModel = mongoose.model('blogModel', blogSchema);

