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
import { createProduct} from "../controllers/product.controller.js"
import { sellerAuthenticator} from "../middlewares/auth.middleware.js";


productRouter.post("/", sellerAuthenticator, upload.array("images" , 7) , createProduct)




export default productRouter