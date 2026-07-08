import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"server is running...."
    })
})

//Routes imports
import authrouter from "./routes/auth.route.js"


app.use("/api/v1/auth" , authrouter)






export default app