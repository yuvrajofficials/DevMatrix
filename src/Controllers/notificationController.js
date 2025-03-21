import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { notificationModel,reviewModel } from "../Models/notificationModel.js";
import asyncHandler from '../Utils/asyncHandler.js'


const saveNotification = async (req, res) => {
    const { from,to,name, email, message,subject } = req.body;
  
 
  
    try {
      const newNotification = new notificationModel({ from , to , name, email, message,subject });
      const savedNotification = await newNotification.save();
      res.status(200).json({ success: true, data: savedNotification });
    } catch (error) {
      console.error('Error saving notification:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
    
    
  const getNotification = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = 15; // Chunk size

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const totalNotifications = await notificationModel.countDocuments({ from: userId }); // Count total
        const notifications = await notificationModel
            .find({ from: userId })
            .sort({ createdAt: -1 }) // Latest first
            .skip((page - 1) * limit) // Skip previous pages
            .limit(limit); // Get only 15

        if (!notifications.length) {
            return res.status(404).json({ success: false, message: "No notifications found" });
        }

        res.status(200).json({
            success: true,
            data: notifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: page
        });
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


  
const saveReviews = async (req, res) => {
  const { name, email,ratings, message } = req.body;

   

  try {
    const newReview = new reviewModel({ name, email, message,ratings });
    console.log(newReview)
    const savedReview = await newReview.save();
    res.status(200).json({ success: true, data: savedReview });
  } catch (error) {
    console.error('Error Saving Review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  
  

const getReviews = asyncHandler( async (req, res) => {
  try {
      const reviews = await reviewModel.find({});
      res.json(reviews);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});



    

export {saveNotification,getNotification,saveReviews,getReviews}
