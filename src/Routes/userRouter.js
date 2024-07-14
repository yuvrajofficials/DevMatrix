import express from "express";
import {registerController, loginController,uploadedVideo} from '../Controllers/userController.js'
import {saveNotification,getNotification, getReviews, saveReviews} from '../Controllers/notificationController.js';

import { uploadOnCloudinary } from "../Utils/Cloudanary.js";
import { addToCart, getAllCourse, getCourseDetails, getSpecificDiscussion, saveDiscussion } from "../Controllers/courseController.js";
import { validateToken } from "../Middlewares/validateToken.js";
import { getAllBlogs, getSpecificComment, saveComment } from "../Controllers/blogController.js";
import { getActualCount } from "../Controllers/othersController.js";


const app = express();


const userRouter = express.Router();

// user auth routes

userRouter.post('/login',loginController)
userRouter.post('/register', registerController)

// user contact form route

// userRouter.post('/upload-file', upload.single('file'),uploadOnCloudinary);

userRouter.post('/save-notification',saveNotification)
userRouter.get('/get-notification',getNotification)
userRouter.post('/save-reviews',saveReviews)
userRouter.get('/get-reviews',getReviews)

userRouter.post('/save-addtocart',addToCart);
userRouter.post('/get-course-details',getCourseDetails);


userRouter.post('/:blogId/save-comment',saveComment);
userRouter.get('/:blogId',getSpecificComment);
userRouter.post('/:courseId/save-discussion',saveDiscussion);
userRouter.get('/:courseId',getSpecificDiscussion);

userRouter.post('/get-allcourse',getAllCourse);
userRouter.post('/get-allblogs', getAllBlogs);

userRouter.post('/countdata',getActualCount);

export default userRouter

