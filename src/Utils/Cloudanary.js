import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME||"dkvgah026", 
    api_key: process.env.CLOUDINARY_API_KEY||"234793419256975", 
    api_secret: process.env.CLOUDINARY_API_SECRET||"CPzbS-uiOn_yvlN4ITD5SHBsPjQ" 
  });
  
  const uploadOnCloudinary = async (req, res, next) => {
    const localFilePath = req.file.path;
    try {
      if (!localFilePath || typeof localFilePath !== 'string') {
        console.log("Invalid file path provided");
        return res.status(400).json({ message: "Invalid file path provided" });
      }
  
      // Upload the file to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
         folder: req.folder_name||null,
        resource_type: "auto"
      });
  
      // File has been uploaded successfully
      console.log("File uploaded to Cloudinary:", response.secure_url);
  
      // Remove the local file after successful upload
      fs.unlinkSync(localFilePath);
  
      req.cloudinaryUrl = response.secure_url;
      next();
    } catch (error) {
      // Log the error
      console.error("Error uploading file to Cloudinary:", error);
  
      // Remove the locally saved temporary file as the upload operation failed
      try {
        fs.unlinkSync(localFilePath);
      } catch (unlinkError) {
        console.error("Error deleting local file:", unlinkError);
      }
  
      return res.status(500).json({ message: "File upload failed", error: error.message });
    }
  };
export {uploadOnCloudinary}