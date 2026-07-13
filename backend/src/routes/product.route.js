import { Router } from "express";

const productRouter = Router()


//controllers
import { createProduct} from "../controllers/product.controller.js"
import { sellerAuthenticator} from "../middlewares/auth.middleware.js";


productRouter.post("/", sellerAuthenticator , createProduct)




export default productRouter