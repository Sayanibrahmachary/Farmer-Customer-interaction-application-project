import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema=new mongoose.Schema(
    {
        productName:
        {
            type: String,
            required: true,
        },
        photo:
        {
            type:String,
            required:true,
        },
        pay:
        {
            type: Number,
            required:true,
        },
    },{timestamps:true}
)

productSchema.plugin(mongooseAggregatePaginate)
export const Product= mongoose.model("Product", productSchema);