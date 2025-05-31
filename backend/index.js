import express from "express";
import {connect} from "./connection/connect.js"
import cors from "cors"
import productRoutes from "./routes/productRoutes.js"
import cartRoute from "./routes/cartRoutes.js"
import dotenv from "dotenv"
dotenv.config()
import authRoutes  from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
const app=express();
app.use(cors({origin:"https://mega-project-elegant-wears.vercel.app", credentials:true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static("public/images"));
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/", productRoutes)
app.use("/api/cart",cartRoute)



const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    connect();
    console.log("Server started")
})

