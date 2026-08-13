import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addToCart, getCart, updateCartItem, removeCartItem } from "../controllers/cart.controller.js";
import { cartValidator, cartUpdateValidator } from "../validators/cart.validator.js";

const cartRouter = Router()


// add to cart route
//POST /api/v1/cart/add/:productId/:variantId?  (variantId optional)
cartRouter.post("/add/:productId", authenticateUser, cartValidator, addToCart)

cartRouter.post("/add/:productId/:variantId", authenticateUser, cartValidator, addToCart)

//update cart item quantity
//PATCH /api/v1/cart/update/:productId/:variantId?  (variantId optional)
cartRouter.patch("/update/:productId", authenticateUser, cartUpdateValidator, updateCartItem)

cartRouter.patch("/update/:productId/:variantId", authenticateUser, cartUpdateValidator, updateCartItem)

//remove cart item
//DELETE /api/v1/cart/remove/:productId/:variantId?  (variantId optional)
cartRouter.delete("/remove/:productId", authenticateUser, cartValidator, removeCartItem)

cartRouter.delete("/remove/:productId/:variantId", authenticateUser, cartValidator, removeCartItem)

//get cart and create new cart
//GET /api/v1/cart/
cartRouter.get("/", authenticateUser, getCart)


export default cartRouter