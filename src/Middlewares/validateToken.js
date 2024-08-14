import { ApiResponse } from "../Utils/APIResponse.js";
import { ApiError } from "../Utils/APIError.js";
import { userModel } from "../Models/userModel.js";
import JWT from "jsonwebtoken";

export const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      throw new ApiError(401, "Unauthorized Access");
    }
    
    token = token.replace(/"/g, '');
    console.log(token)

    const user = await userModel.findOne({ refreshToken: token });
 
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    JWT.verify(token, secret, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token is not valid", error: err });
      }
     
      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handler)
  }
};
