import express from "express";
import {createCourse, getCourse, getMyCreatedCourse,getMyCreatedModules,getTeacherCourses} from '../Controllers/courseController.js'
import { getVideo, uploadResource, uploadVideo ,createModule, uploadBlogResources, uploadedBlogResources} from "../Controllers/videoController.js";
import {  validateToken } from "../Middlewares/validateToken.js";
import { uploadV,uploadR, uploadBlogResource } from "../Middlewares/multerMiddleware.js";
import { uploadOnCloudinary } from "../Utils/Cloudanary.js";
import { createBlog, getTeacherBlogs } from "../Controllers/blogController.js";

import { createTask, getTasksByBoard, updateTaskStatus, deleteTask } from '../Controllers/taskController.js';
import { getAllBoards, createBoard, deleteBoard } from '../Controllers/boardController.js';


const app = express();

const teacherRouter = express.Router();

// user auth routes

teacherRouter.post('/create-course',uploadR.single('resource'), createCourse)
teacherRouter.post('/get-course',validateToken,getCourse)
teacherRouter.post('/get-mycourse',validateToken,getMyCreatedCourse)
teacherRouter.post('/get-mymodule',validateToken,getMyCreatedModules)
teacherRouter.post('/get-course-modules',getMyCreatedModules)

teacherRouter.post('/create-module', createModule)


// teacherRouter.post('/upload-video',validateToken,uploadV,uploadVideo)
teacherRouter.post('/upload-video',uploadV,uploadVideo)
teacherRouter.post('/get-video',validateToken,getVideo)
teacherRouter.get('/get-allcourse/:owner',getTeacherCourses)

teacherRouter.post('/create-blog',uploadR.single('thumbnail'), createBlog);
teacherRouter.get('/get-allblogs/:userId',getTeacherBlogs)



teacherRouter.post('/upload-resource', uploadR.single('thumbnail'), uploadResource);
// teacherRouter.post('/upload', upload.single("file"), uploadOnCloudinary, (req, res) => {
    //     res.json({ message: 'File uploaded to Cloudinary', url: req.cloudinaryUrl });
    //   });
    
    
    teacherRouter.get('/taskmanagement/tasks/:board', getTasksByBoard)
    teacherRouter.post('/taskmanagement/tasks/createTask', createTask)
    teacherRouter.put('/taskmanagement/tasks/:id/status', updateTaskStatus)
    teacherRouter.delete('/taskmanagement/tasks/:board', deleteTask)
    
    teacherRouter.get('/taskmanagement/board', getAllBoards);
    teacherRouter.post('/taskmanagement/board', createBoard);
    teacherRouter.delete('/taskmanagement/board/:id', deleteBoard);
    
    teacherRouter.post('/upload-blog-resource', uploadBlogResource.single('resourceFile'), uploadBlogResources);
    teacherRouter.get('/uploaded-blog-resource/:userId', uploadedBlogResources);

export default teacherRouter

