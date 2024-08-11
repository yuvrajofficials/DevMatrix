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
import fs, { readSync } from "fs";


// Create a new course
// export const createCourse = asyncHandler(async (req, res) => {
//   const { title, creator, owner } = req.body;

//   try {
//     console.log("almost done")
//     const isExist = await courseModel.findOne({ title });

//     if (isExist) {
//       throw new ApiError(403, "Course Title Already Exists");
//     }

//     const resourceUpload = await cloudinary.uploader.upload(resourceFile, {
//       folder: 'resources'
//     });


//     const newCourse = new courseModel({
//       title,
//       creator,
//       owner,
//       slug: slugify(title).toLowerCase()
//     })


//     const createdCourse = await newCourse.save();
//     res.status(200).json({ success: true, data: createdCourse });
//   } catch (error) {
//     console.error('Error in Creating Course:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



export const createCourse = asyncHandler(async (req, res) => {
  const { title, creator, owner, price, description, } = req.body;
  const resourceFile = req.file.path;

  try {
    // Upload resource to Cloudinary
    console.log("almost done")
    const isExist = await courseModel.findOne({ title });

    if (isExist) {
      throw new ApiError(403, "Course Title Already Exists");
    }

    const resourceUpload = await cloudinary.uploader.upload(resourceFile, {
      folder: 'resources'
    });

    const newCourse = new courseModel({
      title,
      creator,
      price,
      description,
      owner,
      slug: slugify(title).toLowerCase(),
      thumbnail: resourceUpload.secure_url
    })

    // Create a new resource document


    const createdCourse = await newCourse.save();

    // Update the user to include the new resource's ID
    await userModel.findByIdAndUpdate(owner, { $push: { resources: createdCourse._id } });

    res.status(200).json({ success: true, data: createdCourse });
  } catch (error) {
    console.error('Error in Creating Course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Cleanup: Remove the local file after uploading to Cloudinary
    fs.unlinkSync(resourceFile);
  }
});



// Get all courses
export const getAllCourse = asyncHandler(async (req, res) => {
  try {
    const courses = await courseModel.find({}).populate('owner');
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error('Error in Getting Courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const getCourse = asyncHandler(async (req, res) => {
  try {

    const result = courseModel.aggregate([
      {
        $match: {
          slug: req.title
        }
      },
      {
        $project: {
          videos: 1,
          title: 1,


        }
      }
    ]).exec()
      .then(results => {
        res.status(200).json({ success: true, data: results });
        // Process aggregated results here
      })
      .catch(err => {
        console.error('Error executing aggregation:', err);
      });

  } catch (error) {
    console.error('Error in Getting Courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const getMyCreatedCourse = asyncHandler(async (req, res) => {
  try {
    const owner = req.body.owner; // Assuming userId is passed in the request body
    console.log(owner)
    const mycourses = await userModel.aggregate([
      {
                "$match": {
          "$expr": {
            "$eq": [
              "$_id",
              {
                "$toObjectId": owner,
              }
            ]
          }
        }


      },
      {
        $lookup: {
          from: "coursemodels", // Ensure this matches the actual collection name
          localField: "_id",
          foreignField: "owner",
          as: "mycourses"
        }
      },
      {
        $project: {
          mycourses: 1
        }

      }, {
        $unwind: {
          path: "$mycourses"
        }
      }, {
        $project: {
          "mycourses.title": 1,
          "mycourses._id": 1,


        }


      }

    ]);

    res.status(200).json({ success: true, data: mycourses });
  } catch (error) {
    console.error('Error in Getting User Courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export const addToCart = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json(new ApiResponse(false, "User not found"));
    }

    // Check if the course is already in the user's cart
    if (user.mycart.includes(courseId)) {
      return res.status(200).json(new ApiResponse(true, "Already added to cart"));
    }

    // Add the course to the user's cart        
    user.mycart.push(courseId);
    await user.save();

    res.status(200).json(new ApiResponse(true, "Course added to cart successfully"));
  } catch (error) {
    console.error('Error adding to cart', error);
    throw new ApiError(500, 'Internal Server Error');
  }
});


export const getCourseDetails = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseDetails = await courseModel.aggregate([

      {        "$match": {
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
        $lookup: {
          from: "videomodels",
          localField: "videos",
          foreignField: "_id",
          as: "videodetails"
        }
      }

    ])
    res.status(200).json({ success: true, data: courseDetails });
  } catch (error) {
    console.error('Error in Getting Courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export const getSpecificDiscussion = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  try {
    const courseData = await courseModel.aggregate([
  

    ]);

    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
})
export const saveDiscussion = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId, discussion } = req.body;
    // console.log('Incoming Data:', { courseId, userId, discussion });

    // Find the user making the comment (optional, if you need to verify user)
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user);

    // Find the course to add the discussion to
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    console.log('Course found:', course);

    // Create the new discussion
    const newDiscussion = {
      user: userId,
      discussion: discussion,
      date: new Date()
    };
    console.log('New Discussion:', newDiscussion);

    // Add the discussion to the course's discussion array
    course.discussion.push(newDiscussion);
    await course.save();

    console.log('Discussion saved successfully');

    res.status(201).json({ message: 'Your discussion added successfully', course });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred', error });
  }
});


export const getTutorDetails = asyncHandler(async (req,res) =>{
  const {tutorId} = req.params;
  console.log(tutorId);
  const user = await userModel.findById(tutorId);
  res.status(201).json({ message: 'User Found ', user });
})