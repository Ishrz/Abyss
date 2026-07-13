import express from "express"
import { config } from "./config/config.js"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(cors({
//     origin:"http://localhost:5173",
//     methods:["GET","POST","PUT","DELETE"],
//     credentials:true
// }))

app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/v1/auth/google/callback"
},(_,__,profile,done)=>{
    return done(null,profile)
}))







app.get("/",(req,res)=>{
    res.status(200).json({
        message:"server is running...."
    })
})

//Routes imports
import authrouter from "./routes/auth.route.js"
import productRouter from "./routes/product.route.js"

//authentications route
app.use("/api/v1/auth" , authrouter)

//prodcut route
app.use("/api/v1/product" , productRouter)







export default app