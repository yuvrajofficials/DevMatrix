import express from "express";
import asyncHandler from '../Utils/asyncHandler.js'; // Assuming this handles async errors
import { ApiError } from "../Utils/APIError.js"; // Assuming you have a custom error class
import { ApiResponse } from "../Utils/APIResponse.js"; // Assuming you have a custom response class
import { createModuleModel, resourceModel, videoModel } from "../Models/videoModel.js";
import { courseModel } from "../Models/courseModel.js";
import { uploadOnCloudinary } from "../Utils/Cloudanary.js";
import {v2 as cloudinary} from "cloudinary";
import multer from "multer";
import fs from "fs";
import mongoose from "mongoose";
import { userModel } from "../Models/userModel.js";



const uploadVideo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    isPublished,
    owner,
    moduleId,
    course // Expecting courseId from the request body
  } = req.body;
  console.log("module_id",moduleId)
  const videoFile = req.files.videoFile[0].path;
  const thumbnail = req.files.thumbnail[0].path;
 console.log(videoFile);
  try {
    // Upload video to Cloudinary
    const videoResponse = await cloudinary.uploader.upload(videoFile, {
      resource_type: "video",
      folder: "videos"
    });

    // Upload thumbnail to Cloudinary
    const thumbnailResponse = await cloudinary.uploader.upload(thumbnail, {
      folder: "thumbnails"
    });
    // Create a new video document
    const newVideo = new videoModel({
      videoFile: videoResponse.secure_url,
      thumbnail: thumbnailResponse.secure_url,
      title,
      description,
      isPublished,
      moduleId,
      owner,
      course // Associate video with the course
    });

    const uploadedVideo = await newVideo.save();

    // Update the course to include the new video's ID
    await courseModel.findByIdAndUpdate(course, { $push: { videos: uploadedVideo._id } });
    await createModuleModel.findByIdAndUpdate(moduleId, { $push: { videos: uploadedVideo._id } });

    res.status(200).json(new ApiResponse(true, uploadedVideo));
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new ApiError(500, 'Internal Server Error');
  } finally {
    // Cleanup: Remove the local files after uploading to Cloudinary
    fs.unlinkSync(videoFile);
    fs.unlinkSync(thumbnail);
  }
});

  // Get all courses
const getVideo = asyncHandler(async (req, res) => {
  try {
    const videos = await videoModel.find({}).populate(['owner' , 'course']);
    videoModel.aggregate([


    ]);
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error('Error in Getting Videos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const uploadResource = asyncHandler(async (req, res) => {
  const { title, userId } = req.body;
  const resourceFile = req.file.path;

  try {
    // Upload resource to Cloudinary
    const resourceUpload = await cloudinary.uploader.upload(resourceFile, {
      folder: 'resources'
    });

    // Create a new resource document
    const newResource = new resourceModel({
      userId,
      title,
      resourceUrl: resourceUpload.secure_url
    });

    const uploadedResource = await newResource.save();

    // Update the user to include the new resource's ID
    
    await userModel.findByIdAndUpdate(userId, { $push: { resources: uploadedResource._id } });

    res.status(200).json(new ApiResponse(true, uploadedResource));
  } catch (error) {
    console.error('Error uploading resource:', error);
    throw new ApiError(500, 'Internal Server Error');
  } finally {
    // Cleanup: Remove the local file after uploading to Cloudinary
    fs.unlinkSync(resourceFile);
  }
});


// Upload blog resources controller
const uploadBlogResources = asyncHandler(async (req, res) => {
  const { title, userId } = req.body;
  const resourceFile = req.file.path; // File uploaded temporarily to local storage

  try {
    // Upload the resource file to Cloudinary
    const resourceUpload = await cloudinary.uploader.upload(resourceFile, {
      folder: 'resources', // Cloudinary folder for resources
    });

    // Create a new resource document in MongoDB
    const newResource = new resourceModel({
      userId,
      title,
      resourceUrl: resourceUpload.secure_url, // URL from Cloudinary
    });

    const uploadedResource = await newResource.save();

    // Update the user model with the new resource
    await userModel.findByIdAndUpdate(userId, {
      $push: { resources: uploadedResource._id },
    });

    // Respond with the secure URL of the uploaded resource
    res.status(200).json(new ApiResponse(true, resourceUpload.secure_url));
  } catch (error) {
    console.error('Error uploading resource:', error);
    throw new ApiError(500, 'Internal Server Error');
  } finally {
    // Cleanup: Remove the local file after uploading to Cloudinary
    fs.unlinkSync(resourceFile);
  }
});


const uploadedBlogResources = asyncHandler(async (req, res) => {
  try {
    const {userId} = req.params;
    const resources = await resourceModel.find({userId}).populate([]);
    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    console.error('Error in Getting Videos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const createModule = async (req, res) => {
  const { title,courseId,owner } = req.body;


console.log({title,courseId,owner })
  try {
    const createNewModule = new createModuleModel({ title,courseId,owner});

    // const isModule = await createModuleModel.find(title);
 
    // if (isModule) {
    //   return res.status(200).json(new ApiResponse(true, "Module already created"));
    // }
    const saveModule = await createNewModule.save();

    
    await courseModel.findByIdAndUpdate(courseId, { $push: { modules: saveModule._id } });
    
    
    res.status(200).json({ success: true, data: saveModule });
  } catch (error) {
    console.error('Error Creating Module:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  



export const getPurchasedCourseDetails = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.body;


    const courseDetails = await courseModel.aggregate([
  {
  "$match": {
    "$expr": {
      "$eq": [
        "$_id",
        {
          "$toObjectId": courseId,
        }
      ]
    }
  }
},
{
  "$lookup": {
    "from": "createmodulemodels",// The collection containing module details
    "localField": "modules", // The array of module IDs in the course document
    "foreignField": "_id", // The _id field in the module collection
    "as": "moduleDetails" // This will create an array of module details in the result
  }
},
{
  "$unwind": "$moduleDetails" // Unwind to work on each module individually
},
{
  "$lookup": {
    "from": "videomodels", // The collection containing video details
    "localField": "moduleDetails.videos", // Array of video IDs inside each module
    "foreignField": "_id", // The _id field in the video collection
    "as": "moduleDetails.videoDetails" // Place the video details inside each module
  }
},
{
  "$group": {
    "_id": "$_id", // Group by the course _id
    "title": { "$first": "$title" },
    "creator": { "$first": "$creator" },
    "modules": {
      "$push": {
        "module": "$moduleDetails", // Push the module details along with video details
        "videos": "$moduleDetails.videoDetails" // Add the video details from the previous lookup
      }
    }
  }
}
])
console.log(courseDetails)
res.status(200).json({ success: true, data: courseDetails });
} catch (error) {
console.error('Error in Getting Courses:', error);
res.status(500).json({ error: 'Internal Server Error' });
}
});



  export {uploadVideo,getVideo,uploadResource,createModule,uploadBlogResources,uploadedBlogResources};