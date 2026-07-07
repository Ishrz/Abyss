import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
const authrouter = Router()


authrouter.post("/register" , register)




export default authrouter