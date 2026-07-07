import { body, validationResult } from "express-validator";


const validator = async (req,res,next)=>{
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() })
    }

    next()
}


export const registerValidator = [
  body("email").isEmail().withMessage("email is required"),
  body("contact")
    .notEmpty().withMessage("contact number is required")
    .matches(/^\d{10}$/).withMessage("Contact must be a 10-digit number"),
  body("password")
    .isLength({max:6 , min:3}).withMessage("Password must be max 6 and min 3 charachter long")
    .notEmpty().withMessage("Password is required"),
  body("fullname")
    .notEmpty().withMessage("full name is required")
    .isLength({max:10 , min:3}).withMessage("fullname must be max 10 and min 3 charachter long"),
  body("isSeller")
    .isBoolean(),


    validator
];
