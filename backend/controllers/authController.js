import User from "../models/User.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken.js";
import { sendVerificationEmail, sendWelcomeEmail , sendForgotPasswordMail,sendResetSuccessEmail} from "../ethereal/emails.js";
import crypto from "crypto"



export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" }); 
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ message: "User already exists" }); 
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();


       
        const user = new User({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        
        await user.save();

        
        generateToken(res, user._id);

       
        console.log(`Attempting to send verification email to: ${user.email}`);
        console.log(`Verification Token/URL: ${verificationToken}`);

        await sendVerificationEmail(user.email, verificationToken); 

        console.log("Verification email send initiated.");

       
        return res.status(201).json({
            success: true,
            message: "User created successfully. Please check your email for verification.",
            user: {
                ...user._doc,
                password: undefined 
            }
        });

    } catch (error) {
        console.error("Error during signup process:", error); 
        
        if (error.code === 11000) { 
            return res.status(400).json({ message: 'Email already registered.' });
        }
        return res.status(500).json({ message: "Server error during signup. Please try again." });
    }
};

export const verifyEmail=async(req,res)=>{
    const {code}=req.body;
    try {
        const user= await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(400).json({msg:"Invalid or expired verification code"})
        }
        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;
        await user.save()
        await sendWelcomeEmail(user.email,user.name)
        res.status(200).json({
            success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},

        })
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

export const forgotPassword=async(req,res)=>{


    const {email}=req.body;
    try {
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"Email not found"})
        }
        const resetToken= crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt=Date.now()+1*60*60*1000;//1 hour
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`
        user.resetPasswordToken=resetToken;
        user.resetPasswordExpiresAt=resetTokenExpiresAt
        await user.save()

        sendForgotPasswordMail(user.email,resetUrl);
        return res.status(200).json({msg:"Reset link sent"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Server error"})
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ msg: "Password is required" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        return res.status(200).json({ msg: "Password reset successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user= await User.findOne({
            email:email,
        })
        if(!user){
            return res.status(400).json({msg:"Invalid credentials"})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({msg:"Invalid credentials"})
        }

        generateToken(res,user._id)
        user.lastLogin=new Date();
        await user.save()
        return res.status(200).json({success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			}})
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const logout=async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({msg:"Logout successfully"})
}

export const checkAuth=async(req,res)=>{
    try {
        const user= await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(404).json({msg:"User not found"})
        }
        return res.status(200).json({user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Server error"})
    }
}