import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose,{isValidObjectId }from 'mongoose';
import cron from "node-cron";
import {Farmer} from "../models/farmer.model.js"
const { ObjectId } = mongoose.Types;
import { Comment } from "../models/comments.model.js";


//create product
const createProduct=asyncHandler(async(req,res)=>
{
    const {productName,pay}=req.body;

    if(productName=="")
    {
        throw new ApiError(400, "product name is required");
    }
    if(pay=="")
    {
        throw new ApiError(400, "payment is required");
    }

    const photoLocalPath=req.files?.photo[0]?.path;
    if(!photoLocalPath)
    {
        throw new ApiError(400, "Photo of the product is required");
    }
    const photo=await uploadOnCloudinary(photoLocalPath);
    if(!photo)
    {
        throw new ApiError(400,"Avatar is required");
    }
    const product=await Product.create({
        productName,
        pay,
        photo:photo.url,
    })

    const savedProduct= await product.save();
    //console.log("Request User:", req.user);
    const user = await Farmer.findById(req.user?._id);
    //console.log(user);
    if (!user) 
    {
        throw new ApiError(404, "User not found");
    }
    user.productId.push(savedProduct._id);
    await user.save();

    if(!product)
    {
        throw new ApiError(400,"product is not created");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,product,"product is created successfully")
    )
})


//update the product by its name
const updateProduct=asyncHandler(async(req,res)=>
{
    const {productId}=req.params;
    const {productName,pay}=req.body;

    if(productName=="")
    {
        throw new ApiError(400,"product name is required")
    }
    if(pay=="")
    {
        throw new ApiError(400,"pay is required")
    }

    if(!isValidObjectId(productId))
    {
        throw new ApiError(401,"Invalid productId")
    }
    const product=await Product.findByIdAndUpdate(
        productId,
        {
            $set:
            {
                productName,
                pay,
            }
        },{new:true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,product,"Product is updated successfully")
    )
})


//delete products manually 
const ManuallydeleteProduct=asyncHandler(async(req,res)=>
{
    const {productId}=req.params;
    if(!isValidObjectId(productId))
    {
        throw new ApiError(400,"Invalid product Id")
    }

    const product=await Product.findById(productId)
    if(!product)
    {
        throw new ApiError(400,"can not find the product by its id")
    }

    const productDelete=await Product.findOneAndDelete(product)
    if(!productDelete)
    {
        throw new ApiError(400,"Error while deleteing product from db")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,productDelete,"product is deleted successfully"))
})



//all comments for this posts
const allComments = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    //console.log(productId);

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const allComments = await Product.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(productId),
            },
        },
        {
            $lookup: {
                from: "comments", // Ensure the correct collection name
                localField: "_id",
                foreignField: "productId",
                as: "allcomments", // lowercase "allcomments" matches unwind
                pipeline:
                [
                    {
                        $lookup:
                        {
                            from:"customers",
                            localField:"customerId",
                            foreignField:"_id",
                            as:"customerDetails",
                        }
                    },
                    {
                        $unwind:"$customerDetails"
                    }
                ]
            },
        },
        {
            $unwind: "$allcomments",
        },
        {
            $project: {
                username: "$allcomments.customerDetails.username",
                comment: "$allcomments.description",
            },
        },
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, allComments, "All comments fetched successfully"));
});


//delete the yesterdays product 
const deleteYesterdaysProducts = async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Move to yesterday
        yesterday.setHours(0, 0, 0, 0); // Start of yesterday

        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999); // End of yesterday

        // Find and delete all products created yesterday
        const productsToDelete = await Product.find({
            createdAt: { $gte: yesterday, $lte: endOfYesterday }
        });

        if (productsToDelete.length > 0) {
            const productIds = productsToDelete.map((product) => product._id);

            // Delete associated comments first
            const deleteCommentsResult = await Comment.deleteMany({ productId: { $in: productIds } });
            console.log(`Deleted ${deleteCommentsResult.deletedCount} comments related to yesterday's products.`);

            // Delete the products themselves
            const deleteProductsResult = await Product.deleteMany({ _id: { $in: productIds } });
            console.log(`Deleted ${deleteProductsResult.deletedCount} products created yesterday.`);
        } else {
            console.log("No products to delete from yesterday.");
        }
    } catch (error) {
        console.error("Error deleting yesterday's products and comments:", error);
    }
};

// Schedule the function to run exactly at 12 AM every day
cron.schedule("0 0 * * *", () => {
    console.log("Running deleteYesterdaysProducts at 12 AM...");
    deleteYesterdaysProducts();
}, { timezone: "UTC" });  // Adjust timezone if needed




export {
    createProduct,
    updateProduct,
    ManuallydeleteProduct,
    deleteYesterdaysProducts,
    allComments,
}