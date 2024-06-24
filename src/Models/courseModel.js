import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  creator: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default:"",
  },
  slug: {
    type: String,
    unique: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "userModel",
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: "videoModel",
    },
  ],
});

export const courseModel = mongoose.model("courseModel", courseSchema);
