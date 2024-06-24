import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
},{
  timestamps: true,
});


export const notificationModel = mongoose.model('notificationModel',notificationSchema)