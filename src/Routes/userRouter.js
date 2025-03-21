import express from "express";
import {registerController, loginController,uploadedVideo, getLoginDetails} from '../Controllers/userController.js'
import {saveNotification,getNotification, getReviews, saveReviews} from '../Controllers/notificationController.js';

import { uploadOnCloudinary } from "../Utils/Cloudanary.js";
import { addToCart,getAllCourse, getAllPurchasedCourse, getCourseDetails, getSpecificDiscussion, getTutorDetails, removeFromCart, saveDiscussion } from "../Controllers/courseController.js";
import { validateToken } from "../Middlewares/validateToken.js";
import { getAllBlogs, getSpecificComment, saveComment } from "../Controllers/blogController.js";
import { dummyPaymentGateway, getActualCount, getAllCartItem } from "../Controllers/othersController.js";
import { getPurchasedCourseDetails, getPurchasedCourses } from "../Controllers/videoController.js";


const app = express();


const userRouter = express.Router();

// user auth routes

userRouter.post('/login',loginController)
userRouter.post('/register', registerController)


userRouter.get('/get-profile/:userId',getLoginDetails);

// user contact form route

// userRouter.post('/upload-file', upload.single('file'),uploadOnCloudinary);

userRouter.post('/save-notification',saveNotification)
userRouter.get('/get-notification',getNotification)
userRouter.get('/get-my-notifications/:userId',getNotification)

userRouter.post('/add-to-cart/:itemId',addToCart);
userRouter.get('/my-add-cart',getAllCartItem)

userRouter.post('/save-reviews',saveReviews)
userRouter.get('/get-reviews',getReviews)

userRouter.post('/save-addtocart',addToCart);
userRouter.delete('/remove-from-cart',removeFromCart);


userRouter.post('/get-course-details',getCourseDetails);
userRouter.post('/get-purchased-courses',getPurchasedCourses);
userRouter.post('/mylearning/get-course-details',getPurchasedCourseDetails);
userRouter.get('/get-course-content/:courseId',getCourseDetails);



userRouter.post('/blog/:blogId/save-comment',saveComment);
userRouter.get('/blog/:blogId',getSpecificComment);
userRouter.post('/course/:courseId/save-discussion',saveDiscussion);
userRouter.post('/course/:courseId',getSpecificDiscussion);

userRouter.get('/get-allcourse',getAllCourse);
userRouter.get('/get-allblogs', getAllBlogs);
userRouter.post('/get-purchased-course',getAllPurchasedCourse);

// userRouter.post('/get-everyblog', getEveryBlog);


userRouter.get('/countdata',getActualCount);


// payment gateway

userRouter.post('/dummy/payment',dummyPaymentGateway)
  


export default userRouter