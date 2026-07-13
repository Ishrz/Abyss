import jwt from "jsonwebtoken"
import { config } from "../config/config"

export const sellerValidator = async (req,res,next) =>{
    const {token} = req.cookies


    if(!token){

        return res.status(401).json({
            message:"unathorized access",
            success:true
        })
    }

    try {

    const decoded = jwt.verify(token, config.JWT_SECRET) 
    
    const user = await userModel.findById(decoded.id)

    if(!user){
        return res.status(401).json({
            message:"Unathorized access",
            success:true
        })
    }

    if(user.role !== "seller"){
        return res.status(403).json({
            message:"forbidden",
            success:true
        })
    }

    req.user = user

    next()
        
    } catch (error) {
        return res.status(400).json({
            message:"Unathorized access",
            success:true,
            error:error.message
        })
    }
}