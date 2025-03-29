import mongoose, { isValidObjectId } from "mongoose";
 import { Comment } from "../models/comments.model.js";
 import { asyncHandler } from "../utils/asyncHandler.js";
 import { ApiError } from "../utils/ApiError.js";
 import { ApiResponse } from "../utils/ApiResponse.js";
 
 
 const createComment=asyncHandler(async(req,res)=>
 {
     const {description}=req.body;
     const {productId}=req.params;
     //console.log(description);
     if(description=="")
     {
         throw new ApiError(400,"Comment is required");
     }
 
     if(!isValidObjectId(productId))
     {
         throw new ApiError(400,"Invalid ProductId");
     }
 
     const comment =await Comment.create({
         description,
         productId:productId,
         customerId: req.user?._id
     })
 
     if(!comment)
     {
         throw new ApiError(400,"Comment is not created")
     }
 
     return res
     .status(200)
     .json(new ApiResponse(200,comment,"Comment added successfully"))
 })
 
 
 const updateComment=asyncHandler(async(req,res)=>
 {
     const {description}=req.body;
     const {commentId}=req.params;
 
     if(description=="")
     {
         throw new ApiError(400,"comment is required");
     }
 
     if(!isValidObjectId(commentId))
     {
         throw new ApiError(400,"Invalid ProductId")
     }
 
     const commentUpdate=await Comment.findByIdAndUpdate(
         commentId,
         {
             $set:
             {
                 description:description
             }
         }
     )
 
     if(!commentUpdate)
     {
         throw new ApiError(400, "Comment is not updated successfully")
     }
 
     return res
     .status(200)
     .json(new ApiResponse(200,commentUpdate,"Comment is updated successfully"))
 })
 
 
 const deleteComment=asyncHandler(async(req,res)=>
 {
     const {commentId}=req.params;
 
     if(!isValidObjectId(commentId))
     {
         throw new ApiError("CommentId is not valid")
     }
 
     const deleteComment=await Comment.findByIdAndDelete(
         commentId,
     )
 
     if(!deleteComment)
     {
         throw new ApiError(400,"Comment is not deleted")
     }
 
     return res
     .status(200)
     .json(new ApiResponse(200,deleteComment,"Comment is deleted Successfully"))
 })
 
 
 export {
     createComment,
     updateComment,
     deleteComment,
 }