import { userModel } from "../Models/userModel.js";
import { comparePassword, hashPassword } from "../Helpers/userHelper.js";
import JWT from "jsonwebtoken";
import { compare } from "bcrypt";
import { ApiResponse } from "../Utils/APIResponse.js";
import { ApiError } from "../Utils/APIError.js";
import { response } from "express";

const registerController = async (req, res) => {
  try {
    const {
      username,
      fullname,
      email,
      password,
      phone,
      education,
      gender,
      age,
    } = req.body;

    console.log({ username,
      fullname,
      email,
      password,
      phone,
      education,
      gender,
      age})
    //validations
    if (!username) {
      throw new ApiError(400, "Username is required");
    }
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
    if (!password) {
      throw new ApiError(400, "Password is required");
    }
    if (!fullname) {
      throw new ApiError(400, "Fullname is required");
    }
    if (!phone) {
      throw new ApiError(400, "Phone is required");
    }
    
    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res
        .status(201)
        .json(
          new ApiResponse(200,"User Already Exist")
        );
    }
    
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      username,
      fullname,
      email,
      password:hashedPassword,
      phone,
      education,
      gender,
      age,
    }).save();

    return res
      .status(201)
      .json(new ApiResponse(200, "User registered Successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const getLoginDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user in the database
    const user = await userModel.findOne({ _id: userId });

    // If no user is found, return 404
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Respond with the user details
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: user,
    });

  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Send a 500 status and a proper error message
    return res.status(500).send({
      success: false,
      message: "Server error, please try again later",
      error: error.message,
    });
  }
};


//POST LOGIN
const loginController = async (req, res) => {
  try {
    const { userdata,password } = req.body;
    console.log({userdata,password})
    //validation
    if (!userdata || !password) {
      console.log(userdata,password);
       new ApiResponse(404,"Invalid username or password");
    }
    //check user
    const user = await userModel.findOne({ username:userdata }) || await userModel.findOne({ email:userdata });
    if (!user) {
      new ApiResponse(404,"User is not registered");
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
       new ApiResponse(404,"Invalid Password");

    }
    //token
    const token = JWT.sign({
      data: user.username
    },  process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

    user.refreshToken = token;
    await user.save();

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        userId: user._id,
        logintype: user.logintype,
        mycourses: user.mycourses,
        mycart: user.mycart,


        token, 

      },
    });
  } catch (error) {
    console.log(error);
   throw new ApiError(500,"Internal Error")
  }
};

const uploadedVideo = ()=>{
  console.log("uploaded successfully")
}



export { registerController, loginController,uploadedVideo,getLoginDetails };
