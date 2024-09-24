import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true
    },
    thumbnail: {
      type: String, // cloudinary url
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "userModel",
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "courseModel",
      required: true
    }
  },
  {
    timestamps: true
  }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const videoModel = mongoose.model("videoModel", videoSchema);

const resourceSchema = new Schema({

  userId: {
    type: Schema.Types.ObjectId,
    ref: "userModel"
  },
  title: {
    type: String
  },
  resourceUrl: {
    type: String
  }

})

export const resourceModel = mongoose.model("resourceModel", resourceSchema);


const moduleSchema = new Schema({

  owner: {
    type: Schema.Types.ObjectId,
    ref: "userModel"
  },
  title: {
    type: String
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "courseModel"
  },
  videos: [{
    type: Schema.Types.ObjectId,
    ref: "courseModel"
  }]

})

export const createModuleModel = mongoose.model("createModuleModel", moduleSchema);

