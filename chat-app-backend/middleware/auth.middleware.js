import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// This function will sit in the middle of a request
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1. Get the token from the user's cookie
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token found");
        }

        // 2. "Decode" the token to see who it belongs to
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 3. Find the user in the database
        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // 4. ATTACH the user info to the request!
        // This is like giving the user a pass they can use in the next function.
        req.user = user;
        
        // 5. Move to the next function (the controller)
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
