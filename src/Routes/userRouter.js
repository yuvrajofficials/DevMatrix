import express from "express";
import {registerController, loginController,uploadedVideo} from '../Controllers/userController.js'
import {saveNotification,getNotification} from '../Controllers/notificationController.js';

import { uploadOnCloudinary } from "../Utils/Cloudanary.js";
import { addToCart, getAllCourse, getCourseDetails } from "../Controllers/courseController.js";
import { validateToken } from "../Middlewares/validateToken.js";
import { getAllBlogs, getSpecificComment, saveComment } from "../Controllers/blogController.js";


const app = express();


const userRouter = express.Router();

// user auth routes

userRouter.post('/login',loginController)
userRouter.post('/register', registerController)

// user contact form route

// userRouter.post('/upload-file', upload.single('file'),uploadOnCloudinary);

userRouter.post('/save-notification',saveNotification)
userRouter.get('/get-notification',getNotification)
userRouter.post('/save-addtocart',validateToken,addToCart);
userRouter.post('/get-course-details',getCourseDetails);
userRouter.post('/:blogId/save-comment',saveComment);
userRouter.get('/:blogId',getSpecificComment);

userRouter.post('/get-allcourse',getAllCourse);

userRouter.post('/get-allblogs', getAllBlogs);

export default userRouter

