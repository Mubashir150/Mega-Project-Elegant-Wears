import jwt from "jsonwebtoken"

export const verifyToken=async(req,res,next)=>{
    const token= req.cookies.token;
    if(!token){
        return res.status(401).json({msg:"Unauthorized. No token provided"})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_KEY);
        if(!decoded){
            return res.status(401).json({msg:"Unauthorized. No token provided"})
        }
        req.userId=decoded.userId;
        next();
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
    
}