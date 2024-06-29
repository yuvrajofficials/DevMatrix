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
    default: "",
  },
  price: {
    type: String,
  },
  description: {
    type: String,
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

const addCartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "userModel"
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "courseModel"
  },
  resourceUrl: {
    type: String,
  }


},
  {
    timestamps: true,
  })


export const addCartModel = mongoose.model("addCartModel", addCartSchema);
