import { Router } from "express";
import multer, { memoryStorage } from "multer"
const productRouter = Router()

const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize: 5 * 1024 *1024 //5mb
    } 
})


//controllers
import { createProduct, getAllProduts, getProdcutDetails, getSellerProduct, getSellerProductDetail} from "../controllers/product.controller.js"
import { sellerAuthenticator} from "../middlewares/auth.middleware.js";


productRouter.post("/", sellerAuthenticator, upload.array("images" , 7) , createProduct)

//get seller all products
productRouter.get("/seller/products", sellerAuthenticator , getSellerProduct)

productRouter.get("/seller/product/:id" , sellerAuthenticator , getSellerProductDetail)

productRouter.get("/" , getAllProduts)

//get specefic product
productRouter.get("/productDetails/:id" , getProdcutDetails )


export default productRouter