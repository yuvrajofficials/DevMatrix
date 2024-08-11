import mongoose from "mongoose";
import express from "express";
import { blogModel } from "../Models/blogModel.js";
import { userModel } from "../Models/userModel.js";  // Ensure this is correctly imported
import { courseModel } from "../Models/courseModel.js";  // Ensure this is correctly imported
import { videoModel } from "../Models/videoModel.js";  // Ensure this is correctly imported
import asyncHandler from "../Utils/asyncHandler.js";

export const getActualCount = async (req, res) => {
    console.log("request came")
    try {
        const userCount = await userModel.aggregate([
            {
                $count: 'count'
            }
        ]);

        const coursesCount = await courseModel.aggregate([
            {
                $count: 'count'
            }
        ]);

        const videosCount = await videoModel.aggregate([
            {
                $count: 'count'
            }
        ]);

        const blogsCount = await blogModel.aggregate([
            {
                $count: 'count'
            }
        ]);

        const result = {
            users: userCount[0]?.count || 1,
            videos: videosCount[0]?.count || 0,
            courses: coursesCount[0]?.count || 0,
            blogs: blogsCount[0]?.count || 0
        };
         console.log(result)
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error });
    }
}


export const getAllCourse = asyncHandler(async (req, res) => {
    try {
      
      res.status(200).json({ success: true, data: "heelo" });
    } catch (error) {
      console.error('Error in Getting Courses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });