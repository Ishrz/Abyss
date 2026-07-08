import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js"
const authrouter = Router()


authrouter.post("/register", registerValidator , register)
authrouter.post("/login", loginValidator , login)




export default authrouter