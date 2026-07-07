import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import {registerValidator} from "../validators/auth.validator.js"
const authrouter = Router()


authrouter.post("/register", registerValidator , register)




export default authrouter