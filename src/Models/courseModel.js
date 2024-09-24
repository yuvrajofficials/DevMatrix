import mongoose, { Schema } from "mongoose";

const discussionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },
  discussion: { type: String},
  date: { type: Date, default: Date.now },
});



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
  discussion: [discussionSchema],
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: "videoModel",
    },
  ],
  modules:[
    {

      type: Schema.Types.ObjectId,
      ref: "createModuleModel",
    }
  ]
});

export const courseModel = mongoose.model("courseModel", courseSchema);

const addCartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "userModel",
    
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
