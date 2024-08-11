import express from "express";
import asyncHandler from '../Utils/asyncHandler.js';
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/APIResponse.js";
import { addCartModel, courseModel } from "../Models/courseModel.js";
import slugify from "slugify";
import { userModel } from "../Models/userModel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import { blogModel } from "../Models/blogModel.js";



export const createBlog = asyncHandler(async (req, res) => {
    const { title, abstract, userid, author, isPublished, comments } = req.body;
    const resourceFile = req.file.path;

    try {
        // Upload resource to Cloudinary
        console.log("almost done")
        const isExist = await blogModel.findOne({ title });

        if (isExist) {
            throw new ApiError(403, "Course Title Already Exists");
        }

        const resourceUpload = await cloudinary.uploader.upload(resourceFile, {
            folder: 'resources'
        });

        const newBlog = new blogModel({

            title,
            abstract,
            userid,
            author,
            isPublished,
            comments,
            slug: slugify(title).toLowerCase(),
            thumbnail: resourceUpload.secure_url
        })

        // Create a new resource document


        const createdBlog = await newBlog.save();

        // Update the user to include the new resource's 

        res.status(200).json({ success: true, data: createdBlog });
    } catch (error) {
        console.error('Error in Creating Course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Cleanup: Remove the local file after uploading to Cloudinary
        fs.unlinkSync(resourceFile);
    }
});

export const getAllBlogs = asyncHandler(async (req, res) => {
    try {
      const blogs = await blogModel.find({});
      res.status(200).json({ success: true, data: blogs });
    } catch (error) {
      console.error('Error in Getting Blogs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // error code
  export const getSpecificComment = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    try {
        const blogData = await blogModel.aggregate([
                {
                  "$match": {
                    "$expr": {
                      "$eq": [
                        "$_id",
                        {
                          "$toObjectId": "667e6d7397c051b1e88caf93"
                        }
                      ]
                    }
                  }
                },
                {
                  "$lookup": {
                    "from": "usermodels",
                    "localField": "comments.user",
                    "foreignField": "_id",
                    "as": "commentUsers"
                  }
                },
                {
                  "$unwind": {
                    "path": "$comments",
                    "preserveNullAndEmptyArrays": true
                  }
                },
                {
                  "$lookup": {
                    "from": "usermodels",
                    "localField": "comments.user",
                    "foreignField": "_id",
                    "as": "commentUserDetails"
                  }
                },
                {
                  "$unwind": {
                    "path": "$commentUserDetails",
                    "preserveNullAndEmptyArrays": true
                  }
                },
                {
                  "$group": {
                    "_id": "$_id",
                    "thumbnail": { "$first": "$thumbnail" },
                    "title": { "$first": "$title" },
                    "abstract": { "$first": "$abstract" },
                    "author": { "$first": "$author" },
                    "isPublished": { "$first": "$isPublished" },
                    "description": { "$first": "$description" },
                    "userId": { "$first": "$userId" },
                    "comments": {
                      "$push": {
                        "comment": "$comments",
                        "userDetails": "$commentUserDetails"
                      }
                    }
                  }
                },
                {
                  "$lookup": {
                    "from": "usermodels",
                    "localField": "userId",
                    "foreignField": "_id",
                    "as": "result"
                  }
                },
                {
                  "$project": {
                    "_id": 1,
                    "thumbnail": 1,
                    "title": 1,
                    "abstract": 1,
                    "author": 1,
                    "isPublished": 1,
                    "description": 1,
                    "userId": 1,
                    "comments.comment": 1,
                    "comments.userDetails.username": 1,
                    "comments.userDetails.avatar": 1,
                    "result.username": 1,
                    "result.avatar": 1
                  }
                }
              
              
        ]);
        
        res.status(200).json(blogData);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});


  
  export const saveComment = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.params;
        const { userId, comment } = req.body;
        console.log('Incoming Data:', { blogId, userId, comment });

        // Find the user making the comment (optional, if you need to verify user)
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the blog post to add the comment to
        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Create the new comment
        const newComment = {
            user: userId,
            comment: comment
        };
        console.log('New Comment:', newComment);

        // Add the comment to the blog post's comments array
        blog.comments.push(newComment);
        await blog.save();
        console.log('Comment saved successfully');
       
        res.status(201).json({ message: 'Comment added successfully', blog });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An error occurred', error });
    }
});