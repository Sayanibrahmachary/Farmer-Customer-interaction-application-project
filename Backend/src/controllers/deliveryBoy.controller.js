import { asyncHandler } from "../utils/asyncHandler.js";
 import { DeliveryBoy } from "../models/deliveryBoy.model.js";
 import { ApiError } from "../utils/ApiError.js";
 import { ApiResponse } from "../utils/ApiResponse.js";
 import { Order } from "../models/order.model.js";
 import mongoose,{isValidObjectId} from "mongoose";
 import { Customer } from "../models/customer.model.js";
 
 const generateAccessAndRefreshTokens = async(userId)=>
 {
     try{
 
         const user= await DeliveryBoy.findById(userId);
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
 
 
 //register of a delivery boy
 const registerDeliveryBoy= asyncHandler(async(req,res)=>
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
  
     const exitedUser = await DeliveryBoy.findOne ({
         $or: [{username},{email}]
     })
  
     if(exitedUser)
     {
         throw new ApiError(409, "User with email or username is already exits");
     }
  
 
 
     //user create in MongoDb
     const user=await DeliveryBoy.create({
         username,
         email,
         password,
         address,
         city,
         phoneNumber,
         username: username.toLowerCase()
     })
  
     //remove password and refreshToken from user
     const createdUser=await DeliveryBoy.findById(user._id).select(
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
 
 
 //login of a delivery boy
 const logInDeliveryBoy=asyncHandler(async(req,res)=>
 {
     const {email,password}=req.body;
     // console.log(email);
     // console.log(password);
     const user=await DeliveryBoy.findOne({email});
 
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
     const loggedIn= await DeliveryBoy.findById(user._id).select("-password -refreshToken")
 
     const options={
         httpOnly: true,
         secure: true,
     }
     return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
     .json(new ApiResponse(200,{user:loggedIn,accessToken,refreshToken},"User loggedIn successfully"))
 })
 
 
 //logout of a delivery boy
 const logOutDeliveryBoy=asyncHandler(async(req,res)=>
 {
     DeliveryBoy.findByIdAndUpdate(
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
 
 
 //change password of a delivery boy
 const changePasswordDeliveryBoy=asyncHandler(async(req,res)=>
 {
     const {email,oldPassword,newPassword}=req.body;
 
     const user=await DeliveryBoy.findOne({email});
     if(!email)
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
             incomingRfreshToken, process.env.REFRESH_TOKEN_SECRET_DELIVERYBOY,
         )
     
         const user=await DeliveryBoy.findById(decodedToken?._id)
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
 
 //check that user is valid or not
 const useingPinCheckUser=asyncHandler(async(req,res)=>
 {
     const {deliveryBoyId,pinByParams}=req.params;
     const {pinByCustomer}=req.body;
 
     if(pinByCustomer!=pinByParams)
     {
         throw new ApiError(400,"please provide valid pin");
     }
 
     const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
     if (!deliveryBoy) {
         throw new ApiError(400, "Cannot find the delivery boy by this ID");
     }
 
     const order = await Order.findOne({
         deliveryBoyId: new mongoose.Types.ObjectId(deliveryBoyId),
         isDeliverd:false,
     });
 
     if (!order) {
         throw new ApiError(400, "No pending order found for this delivery boy");
     }
 
     // Update order status to delivered
     order.isDeliverd = true;
     await order.save();
 
     // Update delivery boy status to available after successful delivery
     deliveryBoy.status = "available";
     await deliveryBoy.save();
 
     return res
     .status(200)
     .json(new ApiResponse(200,"order reached to the customer successfully"));
 })
 
 const bookDeliveryBoy=asyncHandler(async(req,res)=>
 {
     const {customerId}=req.params;
     const customer = await Customer.findById(customerId);
     if (!customer) {
         throw new ApiError(404, "Customer not found");
     }
     const customerCity=customer.city;
     const allDeliveryBoys = await DeliveryBoy.find({ status: "available" });
 
     // Filter delivery boys whose address matches the customer's address
     const matchedDeliveryBoys = allDeliveryBoys.filter(
         (boy) => boy.city === customerCity
     );
 
     if (matchedDeliveryBoys.length === 0) {
         throw new ApiError(400, "No delivery boy available for this address");
     }
 
     // Randomly select a delivery boy
     const randomIndex = Math.floor(Math.random() * matchedDeliveryBoys.length);
     const assignedDeliveryBoy = matchedDeliveryBoys[randomIndex];
     assignedDeliveryBoy.status = "busy";
     await assignedDeliveryBoy.save();
 
     return res
     .status(200)        
     .json(new ApiResponse(200,assignedDeliveryBoy,'Delivery boy booked successfully'));
 })
 //get the map so that he can put the destination
 
 export {
     registerDeliveryBoy,
     logInDeliveryBoy,
     logOutDeliveryBoy,
     changePasswordDeliveryBoy,
     refreshAccessToken,
     useingPinCheckUser,
     bookDeliveryBoy,//pending to run
 }