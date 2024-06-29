import express from "express";
import {createCourse, getCourse, getMyCreatedCourse} from '../Controllers/courseController.js'
import { getVideo, uploadResource, uploadVideo } from "../Controllers/videoController.js";
import {  validateToken } from "../Middlewares/validateToken.js";
import { uploadV,uploadR } from "../Middlewares/multerMiddleware.js";
import { uploadOnCloudinary } from "../Utils/Cloudanary.js";
import { createBlog } from "../Controllers/blogController.js";
const app = express();

const teacherRouter = express.Router();

// user auth routes

teacherRouter.post('/create-course',uploadR.single('resource'), createCourse)
teacherRouter.post('/get-course',validateToken,getCourse)
teacherRouter.post('/get-mycourse',validateToken,getMyCreatedCourse)

teacherRouter.post('/upload-video',validateToken,uploadV,uploadVideo)
teacherRouter.post('/get-video',validateToken,getVideo)
// teacherRouter.post('/upload-resource', validateToken, uploadR.single('resource'), uploadResource);
teacherRouter.post('/create-blog',uploadR.single('resource'), createBlog);



teacherRouter.post('/upload-resource', uploadR.single('thumbnail'), uploadResource);
// teacherRouter.post('/upload', upload.single("file"), uploadOnCloudinary, (req, res) => {
//     res.json({ message: 'File uploaded to Cloudinary', url: req.cloudinaryUrl });
//   });


export default teacherRouter

