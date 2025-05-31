import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    name:{
        type:String,
        required:true,
        
    },
    lastLogin:{
        type:Number,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
    cart: [ 
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', 
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
            name: String,
            price: Number,
            image: String,
        },
    ],
},{timestamps:true})

const User= mongoose.model("user",userSchema)

export default User