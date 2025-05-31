import mongoose from "mongoose";

const orderItemSchema= new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Product"
    },
    name:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        min:1,
        required:true

    },
    price:{
        type:Number,
        min:0,
        required:true
    }
})

const orderSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    items:[orderItemSchema],
    totalAmount:{
        type:Number,
        required:true,
        min:0
    },
    paymentMethod:{
        type:String,
        required:true,
        enum:["COD","Card"]

    },
    transactionId:{
        type:String,
        required: function() {return this.paymentMethod==="Card"},
    },
    paymentStatus:{
        type:String,
        enum:["pending","paid","failed","refunded"],
        default:"pending",
        required:true
    }
})

const Order= mongoose.model("Order",orderSchema)
export default Order;