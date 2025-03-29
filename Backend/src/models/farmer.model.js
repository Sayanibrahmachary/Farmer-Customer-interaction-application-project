import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const farmerSchema= new mongoose.Schema(
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
        productId:
        [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        refreshToken:
        {
            type:String,
        }
    },{timestamps:true}
)

farmerSchema.pre("save", async function (next){
    if(!this.isModified("password"))
    {
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

farmerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}

farmerSchema.methods.generateAccessToken= function () {
    return jwt.sign
    (
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },

        process.env.ACCESS_TOKEN_SECRET_FARMER,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY_FARMER
        }
        
    )
}

farmerSchema.methods.generateRefreshToken= function () {
    return jwt.sign
    (
        {
            _id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET_FARMER,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY_FARMER
        }
    )
}

export const Farmer= mongoose.model("Farmer",farmerSchema);