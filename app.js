import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./src/Routes/userRouter.js"
import teacherRouter from "./src/Routes/teacherRouter.js"


const app = express()


app.use(cors())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

var corsOptions = {
    origin: "*",
  }

  
app.use('/api/v1/users',cors(corsOptions), userRouter);
app.use('/api/v1/teacher',cors(corsOptions), teacherRouter);
// app.use('/api/v1/admin',cors(corsOptions), adminRouter);


export { app }