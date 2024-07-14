import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { notificationModel,reviewModel } from "../Models/notificationModel.js";
import asyncHandler from '../Utils/asyncHandler.js'


const saveNotification = async (req, res) => {
    const { name, email, message,subject } = req.body;
  
 
  
    try {
      const newNotification = new notificationModel({ name, email, message,subject });
      const savedNotification = await newNotification.save();
      res.status(200).json({ success: true, data: savedNotification });
    } catch (error) {
      console.error('Error saving notification:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
    
    

const getNotification = asyncHandler( async (req, res) => {
    try {
        const notifications = await notificationModel.find({});
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
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
