import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const deliveryBoySchema= new mongoose.Schema(
    {
        username:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phoneNumber:
        {
            type: Number,
            required: true,
        },
        address:
        {
            type: String,
            required: true,
        },
        city:
        {
            type: String,
            required: true,
        },
        password:
        {
            type: String,
            required: [true,"password is required"],
        },
        orderId:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Order"
            }
        ],
        status: {
            type: String,
            enum: ["available", "busy", "inactive"], // Define possible statuses
            default: "available", // By default, a new delivery boy is available
        },
    },{timestamps:true}
)


deliveryBoySchema.pre("save", async function (next){
    if(!this.isModified("password"))
    {
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

deliveryBoySchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}

deliveryBoySchema.methods.generateAccessToken= function () {
    return jwt.sign
    (
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },

        process.env.ACCESS_TOKEN_SECRET_DELIVERYBOY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY_DELIVERYBOY
        }
        
    )
}

deliveryBoySchema.methods.generateRefreshToken= function () {
    return jwt.sign
    (
        {
            _id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET_DELIVERYBOY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY_DELIVERYbOY
        }
    )
}

export const DeliveryBoy= mongoose.model("DeliveryBoy",deliveryBoySchema);