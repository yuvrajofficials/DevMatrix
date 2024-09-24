import mongoose from "mongoose";
import express from "express";
import { blogModel } from "../Models/blogModel.js";
import { userModel } from "../Models/userModel.js";  // Ensure this is correctly imported
import { courseModel } from "../Models/courseModel.js";  // Ensure this is correctly imported
import { videoModel } from "../Models/videoModel.js";  // Ensure this is correctly imported
import asyncHandler from "../Utils/asyncHandler.js";
import { ApiResponse } from "../Utils/APIResponse.js";

export const dummyPaymentGateway = async (req, res) => {
    console.log("Payment request received");
    const { userId,courseId,cardNumber, expiryDate, cvv, amount } = req.body;

    console.log({userId,courseId,cardNumber, expiryDate, cvv, amount })
    
    // Check for missing payment details
    if (!cardNumber || !expiryDate || !cvv || !amount) {
        res.status(200).json({ success: true, data: courses });
        console.error("Missing payment details");
        return res.status(400).json({ error: 'Missing payment details' });
    }

    // Simulate payment processing logic
    try {
        console.log("Processing payment...");
        // Simulate a successful payment (in reality, you would integrate with a payment gateway)
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' });
        }
    
        // Check if the course is already in the user's cart
        if (user.mycourses.includes(courseId)) {
            return res.json({ success: true, message: 'Course Already Purchased' });
        }
    
        
        
        const isPaymentSuccessful = true;
        user.mycourses.push(courseId);
    await user.save();
    
        if (isPaymentSuccessful) {
            console.log("Payment processed successfully");
            return res.json({ success: true, message: 'Payment processed successfully' });
        } else {
            console.error("Payment processing failed");
            return res.status(500).json({ success: false, message: 'Payment processing failed' });
        }
    } catch (error) {
        console.error("Server error", error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
}

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

export const getAllCartItem = asyncHandler(async (req, res) => {
    try {
        const courses = await userModel.find({}).populate('owner');
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        console.error('Error in Getting Courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
