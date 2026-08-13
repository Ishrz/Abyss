import { body,param,validationResult } from "express-validator";


const validateRequest = async (req,res,next)=>{
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() })
    }

    next()
}

export const cartValidator = [
    param("productId").isMongoId().withMessage("Invalid Product Id"),
    param("variantId").optional().isMongoId().withMessage("Invalid Variant Id"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quatity atleast must be 1"),

    validateRequest

]

export const cartUpdateValidator = [
    param("productId").isMongoId().withMessage("Invalid Product Id"),
    param("variantId").optional().isMongoId().withMessage("Invalid Variant Id"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity atleast must be 1"),

    validateRequest

]