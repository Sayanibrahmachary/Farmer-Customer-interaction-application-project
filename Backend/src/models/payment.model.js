import mongoose ,{Schema}from "mongoose";

const paymentSchema=mongoose.Schema(
    {
        customerId:
        {
            type: Schema.Types.ObjectId,
            ref:"Customer",
        },
        isPaymentDone:
        {
            type: Boolean,
        }
    },{timestamps:true}
)

export const Payment= mongoose.model("Payment",paymentSchema)