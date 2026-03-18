import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponce.js";
import {ApiError} from "../utils/ApiError.js"

export const signup = asyncHandler(async (req,res) => {
    const {username,password,email} = req.body;
    
    // validation basic
    if ([!username,!email,!password].some((field)=>field?.trim() === "")) {
        throw new ApiError(400,"Fill All the Fields these are required")
    
    }
    // check for Existing users
    const existedUser = await User.findOne({

           $or:[{username},{email}] 

    })
    if (existedUser){
        throw new ApiError(409,"User already Exists Use Another Account")
    }
    

    
})