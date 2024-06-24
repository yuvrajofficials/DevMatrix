import express from "express";
import asyncHandler from '../Utils/asyncHandler.js'; // Assuming this handles async errors
import { ApiError } from "../Utils/ApiError.js"; // Assuming you have a custom error class
import { ApiResponse } from "../Utils/APIResponse.js"; // Assuming you have a custom response class
import { videoModel } from "../Models/videoModel.js";
import { courseModel } from "../Models/courseModel.js";
import { uploadV,uploadP } from "../Middlewares/multerMiddleware.js";
import { uploadOnCloudinary } from "../Utils/Cloudanary.js";
import {v2 as cloudinary} from "cloudinary";
import multer from "multer";
import fs from "fs";
import mongoose from "mongoose";


const uploadVideo = asyncHandler(async (req, res) => {
    const {
      title,
      description,
      isPublished,
      owner,
      course // Expecting courseId from the request body
    } = req.body;

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
        owner,
        course // Associate video with the course
      });
  
      const uploadedVideo = await newVideo.save();
  
      // Update the course to include the new video's ID
      await courseModel.findByIdAndUpdate(course, { $push: { videos: uploadedVideo._id } });
  
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




  export {uploadVideo,getVideo};