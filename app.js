import express, { response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./src/Routes/userRouter.js"
import teacherRouter from "./src/Routes/teacherRouter.js"
import trialRouter from "./src/Routes/trialRouter.js"


const app = express()


app.use(cors())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

var corsOptions = {
    origin: "*",
  }

  
const homeRouter = express.Router();


homeRouter.get('/',()=>{
  // return {"message":"Hello to Devmatrix"}
  res.status(200).json({ success: true, data: "i got this "});
  
})
app.use('/api/v1/users',cors(corsOptions), userRouter);
app.use('/api/v1/teacher',cors(corsOptions), teacherRouter);
app.use('/api/v1/kishor',cors(corsOptions), trialRouter);
// app.use('/api/v1/kishor',cors(corsOptions), trialRouter);


const getHome = (req, res) => {
  try {
    res.status(200).json({ message: 'Welcome to Devmatrix' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

app.get('/',getHome)
// app.use('/api/v1/admin',cors(corsOptions), adminRouter);




export { app }