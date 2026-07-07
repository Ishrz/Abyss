import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.status(200).json({
        message:"server is running...."
    })
})

//Routes imports
import authrouter from "./routes/auth.route.js"


app.use("/api/v1/auth" , authrouter)






export default app