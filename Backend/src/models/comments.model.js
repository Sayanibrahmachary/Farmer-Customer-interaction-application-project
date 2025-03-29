import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema=new mongoose.Schema({

    description:
    {
        type:String,
        required:true,
    },
    productId:
    {
        type:Schema.Types.ObjectId,
        ref:"Product",
    },
    customerId:
    {
        type:Schema.Types.ObjectId,
        ref:"Customer"
    }
},{timestamps:true})

commentSchema.plugin(mongooseAggregatePaginate)
export const Comment=mongoose.model("Comment",commentSchema);