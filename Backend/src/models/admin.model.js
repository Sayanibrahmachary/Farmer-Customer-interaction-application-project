import mongoose from "mongoose";

const adminSchema= new mongoose.Schema(
    {
        orderId:
        {
            type: String,
        },
        payment:
        {
            type: Number,
        }
    },{timestamps:true}
)

export const Admin= mongoose.model("Admin",adminSchema);