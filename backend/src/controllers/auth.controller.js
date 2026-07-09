import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { config } from "../config/config.js"


const genrateToken = async (user,res,message) => {
  try {
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
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

    console.log(email , contact , fullname , password, isSeller)

    try {
        const existingUser = await userModel.findOne({
        $or:[{email , contact}]
    })

    if(existingUser) return res.status(400).json({message: "user already exist"})

    const user = await userModel.create({
        fullname,
        email,
        contact,
        password,
        role: isSeller === "buyer" ? "buyer" :  "seller"
    })

    await genrateToken(user,res,"user resgistered successfully")

    } catch (error) {
        res.status(500).json({
            message:"server error",
            success:false,
            error:error.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }

        const isMatch = await user.camparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }

        await genrateToken(user, res, "user logged in successfully");
    } catch (error) {
        res.status(500).json({
            message: "server error",
            success: false,
            error: error.message
        });
    }
};

export const googleCallback = async (req,res) =>{
        const {id,displayName,emails,photos} = req.user
        const email = emails[0].value
        const photo = photos[0].value

        let user = userModel.fineOne({
            email
        })
        
        if(!user){
            user = userModel.create({
                fullname:displayName,
                email:email,
                googleId:id
            })
        }

        const token = jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"7D"})
        res.cookie("token", token)

        res.redirect("http//localhost:5173/")
}