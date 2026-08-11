import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { addToCart } from "../controllers/cart.controller";
import { cartValidator } from "../validators/cart.validator";

const cartRouter = Router()


// add to cart route
//POST /api/v1/cart/add/:productId/:variantId

cartRouter.post("/add/:productId/:variantId" , authenticateUser , cartValidator , addToCart)



export default cartRouter