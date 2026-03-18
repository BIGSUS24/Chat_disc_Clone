import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponce.js";
import {ApiError} from "../utils/ApiError.js"

export const signup = asyncHandler(async (req,res) => {
    const {username,password,email} = req.body;
    
    // validation basic
    if ([username,email,password].some((field)=>field?.trim() === "")) {
        throw new ApiError(400,"Fill All the Fields these are required")
    
    }
    // check for Existing users
    const existedUser = await User.findOne({

           $or:[{username},{email}] 

    })
    if (existedUser){
        throw new ApiError(409,
            "User already Exists Use Another Account")
    }

    const user = await User.create({
        username:username.toLowerCase(),
        password,
        email
    });

    const createdUser =
     await User.findById(user._id).select("-password");

     if (!createdUser) {
         throw new ApiError(500,"registration failed Try again")
        
     };

     return res
     .status(201)
     .json(
        new ApiResponse(200,createdUser,"User Registered Succesfully")
     );
    

    
});

export const login = asyncHandler(async (req,res) => {

    const {email,password} = req.body;

    if (!email || !password) {
         throw new ApiError(400,"Fill All the Fields these are required")
        
    }
    const user = await User.findOne({
        email
    });
     
    if (!user) {
        throw new ApiError(404,"User Not found")
        
    }

    //validation of passowrd method in models


    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid Password")
  
    }
    const token = user.generateAccessToken();

    const options = {
        httpOnly:true,
        secure:true
    }
      const loggedInUser = await User.findById(user._id).select("-password");

      return res
      .status(200)
      .json(
        new ApiResponse(200,loggedInUser,"User Logged In Succesfully")
      )

})