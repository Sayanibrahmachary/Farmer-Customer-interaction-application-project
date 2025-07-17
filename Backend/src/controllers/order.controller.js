import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Customer} from "../models/customer.model.js";
import {DeliveryBoy} from "../models/deliveryBoy.model.js"
import mongoose,{isValidObjectId} from "mongoose";


//place the order
const orderPlaced=asyncHandler(async(req,res)=>
{
    const {amount,kgOrg}=req.body;
    const {productId,customerId}=req.params;


    const customer = await Customer.findById(customerId);
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }
    // const customerCity = customer.city;

    // // Fetch all available delivery boys
    // const allDeliveryBoys = await DeliveryBoy.find({ status: "available" });

    // // Filter delivery boys whose address matches the customer's address
    // const matchedDeliveryBoys = allDeliveryBoys.filter(
    //     (boy) => boy.city === customerCity
    // );

    // if (matchedDeliveryBoys.length === 0) {
    //     throw new ApiError(400, "No delivery boy available for this address");
    // }

    // // Randomly select a delivery boy
    // const randomIndex = Math.floor(Math.random() * matchedDeliveryBoys.length);
    // const assignedDeliveryBoy = matchedDeliveryBoys[randomIndex];

    // Create Order
    const order = await Order.create({
        amount,
        kgOrg,
        customerId,
        productId,
    });

    // Mark the delivery boy as busy
    // assignedDeliveryBoy.status = "busy";
    // await assignedDeliveryBoy.save();

    return res
    .status(200)
    .json(new ApiResponse(200,order,'Order placed successfully'));
})

//delete the order
const cancelOrder=asyncHandler(async(req,res)=>
{
    const {orderId}=req.params;
    //console.log(orderId);

    if(!isValidObjectId(orderId))
    {
        throw new ApiError(400,"order id is not valid");
    }

    const order=await Order.find(orderId);
    if(!order)
    {
        throw new ApiError(400,"can not find the product by its id");
    }

    if(order.isPayment)
    {
        throw new ApiError(400,"you pay the bill so you cannot cancle the order");
    }

    const deleteOrder=await Order.findByIdAndDelete(order);

    if(!deleteOrder)
    {
        throw new ApiError(400,"order is not deleted successfully");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,deleteOrder,"Order is deleted successfully"))
})

export {
    orderPlaced,
    cancelOrder,
}
