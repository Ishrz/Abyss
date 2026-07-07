import jwt from "jsonwebtoken"
import userModel from "../models/user.model"
import { config } from "../config/config"


const genrateToken = async (user,res,message) => {
  try {
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRETE,
      { expiresIn: "7D" }
    );

    res.cookie("token", token);

    res.status(200).json({
        message,
        success:true,
        user:{
            id:user._id,
            email:user.email,
            fullname:user.fullname,
            contact:user.contact,
            role:user.role
        }
    })
  } catch (err) {
    console.log(err)
  }
};

export const register = async (req,res) =>{
    const {email , contact , fullname , password, isSeller} = req.body

    try {
        const existingUser = await userModel.findOne({
        $or:[{email , contact}]
    })

    if(existingUser) return res.staus(400).json({message: "user already exist"})

    const user = await userModel.create({
        fullname,
        email,
        contact,
        password,
        role: isSeller ? "seller" : "buyer"
    })

    await genrateToken(user,res,"user resgistered successfully")

    } catch (error) {
        res.status(500).json({
            message:"server error",
            success:false,
            error:error
        })
    }
    



}