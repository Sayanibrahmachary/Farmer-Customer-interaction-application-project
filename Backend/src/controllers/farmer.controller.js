import { asyncHandler } from "../utils/asyncHandler.js";
import { Farmer } from "../models/farmer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";



const generateAccessAndRefreshTokens = async(userId)=>
{
    try{

        const user= await Farmer.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave: false});// for saving the refreshtoken in data base or mongooes give you this features to you

        return {accessToken,refreshToken};
    }
    catch(error)
    {

        throw new ApiError(500,"Something went wrong while generating refresh and access token");
    }
}


//registration of a farmer
const registerFarmer= asyncHandler(async(req,res)=>
{
    const {username,email,phoneNumber,address,city,password}=req.body

    if(username=="")
    {
        throw new ApiError(400,"username is required");
    }
    else if(email=="")
    {
        throw new ApiError(400,"email is required");
    }
    else if(password=="")
    {
        throw new ApiError(400,"please give a password which protect your account, it is required");
    }
    else if(phoneNumber=="")
    {
        throw new ApiError(400,"please give a valid phoneNumber");
    }
    else if(!email.includes("@") && !email.includes("$") && !email.includes("#") && !email.includes("&") && !email.includes("*"))
    {
        throw new ApiError(400,"pleace put any special character like @,#,$,&,*");
    }
    else if(address=="")
    {
        throw new ApiError(400,"address is required");
    }
    else if(city=="")
    {
        throw new ApiError(400,"city is required");
    }
 
    const exitedUser = await Farmer.findOne ({
        $or: [{username},{email}]
    })
 
    if(exitedUser)
    {
        throw new ApiError(409, "User with email or username is already exits");
    }
 


    //user create in MongoDb
    const user=await Farmer.create({
        username,
        email,
        password,
        address,
        city,
        phoneNumber,
        username: username.toLowerCase()
    })
 
    //remove password and refreshToken from user
    const createdUser=await Farmer.findById(user._id).select(
        "-password -refreshToken"
    )
 
    //if user is not created in db then throw an apierror
    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong while registering the user");
    }
 
    //if it is successfull run then also send an error
    return res.status(201).json(
        new ApiResponse (200,createdUser,"User registered Successfully")
    )
})


//login of a farmer
const logInFarmer=asyncHandler(async(req,res)=>
{
    const {email,password}=req.body;
    // console.log(email);
    // console.log(password);
    const user=await Farmer.findOne({email});

    if(!user)
    {
        throw new ApiError(404,"user is not found");
    }

    const ispassword = await user.isPasswordCorrect(password)

    if(!ispassword)
    {
        throw new ApiError(401,"Password is incorrect");
    }
    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);


    //send cookies
    const loggedIn= await Farmer.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly: true,
        secure: true,
    }
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{user:loggedIn,accessToken,refreshToken},"User loggedIn successfully"))
})

//logout of a farmer
const logOutFarmer=asyncHandler(async(req,res)=>
{
    Farmer.findByIdAndUpdate(
        req.user._id,
        {
            $unset:
            {
                refreshToken:1,
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true,
    }

    return res.status(200).cookie("accesstoken",options).cookie("refreshtoken",options)
    .json(new ApiResponse(200,{},"User logged in successfully"))
})


//change password of a farmer
const changePasswordFarmer=asyncHandler(async(req,res)=>
{
    const {email,oldPassword,newPassword}=req.body;
    // console.log(email);
    const user=await Farmer.findOne({email});
    if(!user)
    {
        throw new ApiError(404,"user is not found");
    }

    const ispasswordCorrect= await user.isPasswordCorrect(oldPassword);

    if(!ispasswordCorrect)
    {
        throw new ApiError(404,"Old password is wrong")
    }

    user.password=newPassword;
    await user.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse(200,{},"Password is changed successfully"))
})


//refresh access token
const refreshAccessToken = asyncHandler(async(req,res)=>
{
    const incomingRfreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRfreshToken)
    {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken=jwt.verify(
            incomingRfreshToken, process.env.REFRESH_TOKEN_SECRET_FARMER,
        )
    
        const user=await Farmer.findById(decodedToken?._id)
        if(!user)
        {
            throw new ApiError(401, "Invalid token");
        }
    
        if(user?.refreshToken!==incomingRfreshToken)
        {
            throw new ApiError(401,"Refresh Token is expired or used");
        }
    
        const options={
            httpOnly:true,
            secure:true,
        }
    
        const {accessToken,newRefreshToken}=await user.generateRefreshToken(user._id)
    
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newRefreshToken,options).json(
            200,
            {
                accessToken,newRefreshToken
            },
            "Access token refreshed successfully",
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})


//todays product according to address
const todaysAllProduct=asyncHandler(async(req,res)=>
{
    const {farmerId}=req.params;
    // console.log(farmerId);
    const todays=new Date();
    todays.setHours(0,0,0,0);

    const endOfToday=new Date();
    endOfToday.setHours(23,59,59,999);

    const allProduct=await Farmer.aggregate([
        {
            $match:
            {
                _id:new mongoose.Types.ObjectId(farmerId)
            }
        },
        {
            $lookup:
            {
                from:"products",
                localField:"productId",
                foreignField:"_id",
                as:"allOrders",
            }
        },
        {
            $unwind:"$allOrders"
        },
        {
            $project:
            {
                productId:"$allOrders._id",
                productName:"$allOrders.productName",
                photo:"$allOrders.photo",
                pay:"$allOrders.pay",
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,allProduct,"fetched all orders successfully"))
})


export {
    registerFarmer,
    logInFarmer,
    logOutFarmer,
    changePasswordFarmer,
    refreshAccessToken,
    todaysAllProduct,//not run
}