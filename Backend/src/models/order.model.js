import mongoose ,{Schema} from "mongoose";

const orderSchema=new mongoose.Schema (
    {
        amount:
        {
            type:Number,
            required:true,
        },
        kgOrg:
        {
            type:String,
            required:true,
        },
        customerId:
        {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required:true,
            index: true,
        },
        productId:
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required:true,
        },
        deliveryBoyId:
        {
            type: Schema.Types.ObjectId,
            ref: "DeliveryBoy",
            default: null,
        },
        status: { 
            type: String, 
            enum: ["Placed", "Processing", "Out for Delivery", "Delivered"], 
            default: "Placed" 
        },
        location: { type: String, default: "Warehouse" , required: true},
        isPayment:
        {
            type: Boolean,
            default:false,
        },
        isDelivered:
        {
            type: Boolean,
            default: false,
        }
    },{timestamps:true}
)

export const Order= mongoose.model("Order",orderSchema);
