import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    sizeChartType: {
        type: String,
        enum: ['jackets', 'sweaters', 'coats'], 
        default: 'none'
    },
    availableSizes:{
        type:[String],
        default:["S", "M", "L", "XL"],
    },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Product",productSchema)