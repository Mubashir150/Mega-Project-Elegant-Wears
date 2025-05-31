import mongoose from "mongoose";


export const connect=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_CLOUD_URL)
        console.log("MongoDB connected")
    } catch (error) {
        console.log("Error connectiong to MongoDB", error);
        process.exit(1);
    }
}
