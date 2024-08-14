import express from "express";
import {registerController, loginController,uploadedVideo} from '../Controllers/userController.js'
import {saveNotification,getNotification, getReviews, saveReviews} from '../Controllers/notificationController.js';

import { uploadOnCloudinary } from "../Utils/Cloudanary.js";
import { addToCart,getAllCourse, getCourseDetails, getSpecificDiscussion, getTutorDetails, saveDiscussion } from "../Controllers/courseController.js";
import { validateToken } from "../Middlewares/validateToken.js";
import { getAllBlogs, getSpecificComment, saveComment } from "../Controllers/blogController.js";
import { getActualCount, getAllCartItem } from "../Controllers/othersController.js";


const app = express();


const userRouter = express.Router();

// user auth routes

userRouter.post('/login',loginController)
userRouter.post('/register', registerController)

// user contact form route

// userRouter.post('/upload-file', upload.single('file'),uploadOnCloudinary);

userRouter.post('/save-notification',saveNotification)
userRouter.post('/add-to-cart/:itemId',addToCart);
userRouter.get('/my-add-cart',getAllCartItem)
userRouter.get('/get-notification',getNotification)
userRouter.post('/save-reviews',saveReviews)
userRouter.get('/get-reviews',getReviews)

userRouter.post('/save-addtocart',addToCart);
userRouter.post('/get-course-details',getCourseDetails);


userRouter.post('/:blogId/save-comment',saveComment);
userRouter.get('/blog/:blogId',getSpecificComment);
userRouter.post('/:courseId/save-discussion',saveDiscussion);
userRouter.post('/:courseId',getSpecificDiscussion);

userRouter.get('/get-allcourse',getAllCourse);
userRouter.get('/get-allblogs', getAllBlogs);
// userRouter.post('/get-everyblog', getEveryBlog);


userRouter.get('/countdata',getActualCount);







export default userRouter