import { Router } from "express";

const productRouter = Router()


//controllers
import {addProducts} from "../controllers/product.controller.js"
import { sellerValidator } from "../middlewares/auth.middleware.js";


productRouter.post("/", sellerValidator , addProducts)




export default productRouter