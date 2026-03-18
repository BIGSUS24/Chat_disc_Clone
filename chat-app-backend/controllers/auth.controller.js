import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponce.js";

export const signup = asyncHandler(async (req,res) => {
    const {username,password,email} = req.body;
    
    // validation basic
    if ([!username,!email,!password].some((field)=>field?.trim() === "")) {
        throw new ApiError(400,"Fill All the Fields these are required")
    
    }
    
    
})