import {asyncHandler} from "../utils/asyncHandler.js";
 import {ApiError} from "../utils/ApiError.js";
 import {ApiResponse} from "../utils/ApiResponse.js";
 import {Customer} from "../models/customer.model.js";
 import mongoose, { isValidObjectId } from "mongoose";
 
 
 const generateAccessAndRefreshTokens = async(userId)=>
 {
     try{
 
         const user= await Customer.findById(userId);
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
 
 
 //Register of a customer
 const registerCustomer= asyncHandler(async(req,res)=>
 {
     // get user details from fronted
     // validation - not empty
     // check if user already exists: through username and email
     // check for images and check for avatar
     // upload them to cloudinery, avatar
     // create user object- create entry in db
     // remove password and refresh token field from response
     // check for user creation 
     // if create successfully then return response other wish check
     
     const {username,email,phoneNumber,address,city,password}=req.body
     console.log(username);
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
  
     const exitedUser = await Customer.findOne ({
         $or: [{username},{email}]
     })
  
     if(exitedUser)
     {
         throw new ApiError(409, "User with email or username is already exits");
     }
  
 
 
     //user create in MongoDb
     const user=await Customer.create({
         username,
         email,
         password,
         address,
         city,
         phoneNumber,
         username: username.toLowerCase()
     })
  
     //remove password and refreshToken from user
     const createdUser=await Customer.findById(user._id).select(
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
 
 
 //Login 
 const logInCustomer=asyncHandler(async(req,res)=>
 {
     const {email,password}=req.body;
     const user=await Customer.findOne({email});
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
     const loggedIn= await Customer.findById(user._id).select("-password -refreshToken")
 
     const options={
         httpOnly: true,
         secure: true,
     }
     console.log(email);
     console.log(password);
     return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
     .json(new ApiResponse(200,{user:loggedIn,accessToken,refreshToken},"User loggedIn successfully"))
 })
 
 
 //LogOut
 const logOutCustomer=asyncHandler(async(req,res)=>
 {
     Customer.findByIdAndUpdate(
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
 
 
 //Change password
 const changePasswordCustomer=asyncHandler(async(req,res)=>
 {
     const {email,oldPassword,newPassword}=req.body;
 
     const user=await Customer.findOne({email});
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
 
 //refreshAccessToken
 const refreshAccessToken = asyncHandler(async(req,res)=>
 {
     const incomingRfreshToken=req.cookies.refreshToken || req.body.refreshToken
 
     if(!incomingRfreshToken)
     {
         throw new ApiError(401, "Unauthorized request");
     }
 
     try {
         const decodedToken=jwt.verify(
             incomingRfreshToken, process.env.REFRESH_TOKEN_SECRET_CUSTOMER,
         )
     
         const user=await Customer.findById(decodedToken?._id)
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
 
 
 const todaysAllOrder = asyncHandler(async (req, res) => {
     const { customerId } = req.params;
 
     if (!isValidObjectId(customerId)) {
         throw new ApiError(400, "Invalid CustomerId");
     }
 
     // Aggregate orders for the customer
     const allTodaysOrder = await Customer.aggregate([
         {
             $match: { 
                 _id: new mongoose.Types.ObjectId(customerId) // Match customer by ID
             },
         },
         {
             $lookup: {
                 from: "orders",
                 localField: "_id",
                 foreignField: "customerId",
                 as: "orders", // Lookup orders associated with this customer
                 pipeline: [
                     {
                         $lookup: {
                             from: "products",
                             localField: "productId", // Match productId with the product collection
                             foreignField: "_id",
                             as: "productDetails", // Fetch product details from the products collection
                         }
                     },
                     {
                         $unwind: "$productDetails" // Unwind the productDetails to flatten the array
                     },
                     {
                         $project: {
                             amount: 1, // Include amount field from orders
                             kgOrg: 1, // Include kgOrg field from orders
                             productName: "$productDetails.productName",
                             photo: "$productDetails.photo",
                             pay: "$productDetails.pay",
                         }
                     }
                 ],
             },
         },
         { 
             $unwind: "$orders", // Unwind the orders after they have been fetched
         },
         {
             $replaceRoot: { newRoot: "$orders" }, // Replace root with order details
         },
     ]);
 
     // console.log("Fetched Orders:", allTodaysOrder);
     
     return res.status(200).json(new ApiResponse(200, allTodaysOrder, "Fetched all orders successfully"));
 });
 
 
 //show products according to customers address
 const allProductsAccordingToAddress=asyncHandler(async(req,res)=>
 {
     const {customerId}=req.params;
 
     const allFarmersAccordingToAddress=await Customer.aggregate([
         {
             $match:
             {
                 _id:new mongoose.Types.ObjectId(customerId),
             },
         },
         {
             $lookup:
             {
                 from:"farmers",
                 localField:"city",
                 foreignField:"city",
                 as:"allFarmers",
 
                 pipeline:[
                     {
                         $lookup:
                         {
                             from:"products",
                             localField:"productId",
                             foreignField:"_id",
                             as:"allProducts",
                         }
                     },
                     {
                         $unwind:"$allProducts"
                     }
                 ]
             }
         },
         {
             $unwind:"$allFarmers"
         },
         {
             $project:
             {
                 farmerName:"$allFarmers.username",
                 productId:"$allFarmers.allProducts._id",
                 productName:"$allFarmers.allProducts.productName",
                 productPay:"$allFarmers.allProducts.pay",
                 productPhoto:"$allFarmers.allProducts.photo",  
             }
         }
     ])
 
     return res
     .status(200)
     .json(
         new ApiResponse(200,allFarmersAccordingToAddress,"Fatch those farmers who have same address like the customer")
     );
 })
 
 
 //total bill by this customer
 const totalBillByThisCustomer=asyncHandler(async(req,res)=>
 {
 
 })
 
 
 export {
     registerCustomer,
     logInCustomer,
     logOutCustomer,
     changePasswordCustomer,
     refreshAccessToken,
     allProductsAccordingToAddress,
     todaysAllOrder,//not run
 }