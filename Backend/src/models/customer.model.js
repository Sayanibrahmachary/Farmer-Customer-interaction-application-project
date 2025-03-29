import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const customerSchema= new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase:true,
            trim:true,
            index: true,
        },
        email:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phoneNumber:
        {
            type:String,
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
            type:String,
            required: [true,"password is required"]
        },
        orderId:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "order"
            },
        ],
        refreshToken:
        {
            type: String,
        }
    },{timestamps:true}
)


//hooks
customerSchema.pre("save", async function (next){
    if(!this.isModified("password"))
    {
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

customerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}

customerSchema.methods.generateAccessToken= function () {
    return jwt.sign
    (
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },

        process.env.ACCESS_TOKEN_SECRET_CUSTOMER,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY_CUSTOMER
        }
        
    )
}

customerSchema.methods.generateRefreshToken= function () {
    return jwt.sign
    (
        {
            _id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET_CUSTOMER,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY_CUSTOMER
        }
    )
}
export const Customer = mongoose.model("Customer",customerSchema);