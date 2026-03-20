import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import {User} from "../models/user.model.js";
import {Group} from "../models/group.model.js";
import { io , getReceiverSocketId } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req,res) => {

    const {text} = req.body
    const {groupId} = req.params;

    if(!text){
        throw new ApiError(400,"Text bar is empty");
    }

    //save the message in database
    const message = await Message.create({
        sender:req.user._id,
        groupId,
        text
    })

    const group = await Group.findById(groupId);

    // 3. The "Walkie-Talkie" Step (Real-time)
    // First, we find the Group to see who is in it

    if (group) {
        // We tell every member in the group about the new message!
        group.members.forEach((memberId) => {
            // Find if this member is currently online (check their socket ID)
            const receiverSocketId = getReceiverSocketId(memberId);
            if (receiverSocketId) {
                // SHOUT the message to them!
                io.to(receiverSocketId).emit("newMessage", message);
            }
        });
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200,message,"message was send succesfully")
    )

    
});

export const getMessages = asyncHandler(async (req,res) => {

    const {groupId} = req.params;

    const messages = await Message.find({
        groupId
    }).populate("sender","username email")
    .sort({createdAt:1}) //old to new -1 = new to old

    return res
    .status(200)
    .json(
        new ApiResponse(200,messages,"messages Fretched to frontend")
    )
    
})