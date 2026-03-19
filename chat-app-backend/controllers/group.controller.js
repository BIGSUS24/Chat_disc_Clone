import { Group } from "../models/group.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";

export const createGroup = asyncHandler(async (req,res) => {

    const { name , members } = req.body

    if (!name || !members ) {
         
        throw new ApiError(400," group name or member required")
        
        
    }

    const allMembers = members ? [...members, req.user._id] : [req.user._id];

    const group = await Group.create({
        name,
        members:allMembers
    })

   return res
    .status(201)
    .json(
        new ApiResponse(200,group,"Group Created")
    )
        
    
    
});

export const getUserGroup = asyncHandler(async (req,res) => {

    const groups= await Group.find({
        members:req.user._id
    }).populate("members", "username email") 
    // Populate gets the actual user details, not just ID

    return res
    .status(200)
    .json(
        new ApiResponse(200,groups,"User Groups Fetched")
    )
    


    
})
