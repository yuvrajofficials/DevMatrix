import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    fullname: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    education: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // cloudinary url
      default: "https://res.cloudinary.com/dwq5shjnh/image/upload/v1716634851/ProfilePic_cda0px.jpg",
    },
    coverImage: {
      type: String, // cloudinary url
      default: ""
    },
    watchHistory: [
      {
        type: String,
      }
    ],
    createdCourses: [
      {
        type: String,
      }
    ],
     uploadedresource: [
      {
        type: Schema.Types.ObjectId,
        ref: "resourceModel",
      },
    ],
    mycart:[{
      type: Schema.Types.ObjectId,
      ref: "courseModel",
    }],
    refreshToken: {
      type: String,
      default: ""
    },
    logintype: {
      type: Number,
      default: 0
    },
    mycourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "courseModel",
      }],
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("userModel", userSchema);
