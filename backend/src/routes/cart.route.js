import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";
import { cartValidator } from "../validators/cart.validator.js";

const cartRouter = Router()


// add to cart route
//POST /api/v1/cart/add/:productId/:variantId
cartRouter.post("/add/:productId/:variantId" , authenticateUser , cartValidator , addToCart)

//get cart and create new cart
//GET /api/v1/cart/
cartRouter.get("/", authenticateUser, getCart)


export default cartRouter