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



setInterval(() => {
  console.log("Keep-alive ping");
  // You can make a GET request or hit an endpoint to keep the server active
  // For instance, hitting the home route here
  fetch("https://devmatrix.onrender.com") // Replace with your app's URL
    .then((response) => response.text())
    .then((data) => console.log("Server is still active"))
    .catch((error) => console.log("Error keeping server alive", error));
}, 300000); // Sends a request every 5 minutes (300000 ms)


export { app }