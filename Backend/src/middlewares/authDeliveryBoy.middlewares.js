import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";
import { DeliveryBoy } from "../models/deliveryBoy.model.js";
import { refreshAccessToken } from "../controllers/deliverBoy.controller.js";
export const verifyJWTDeliveryBoy= asyncHandler (async(req,_,next)=>
{
    try {
        const token = req.cookies ?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token)
        {
            throw new ApiError(401,"Unauthorized token")
        }
    
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_DELIVERYBOY);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                console.log("Access token expired, refreshing...");
                return await refreshAccessToken(req, res, next); // Call refresh token function automatically
            }
            throw new ApiError(401, "Invalid Access Token");
        }
    
        const user = await DeliveryBoy.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user)
        {
            //discuss about fronted
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user=user;
        next()
    } 
    catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})