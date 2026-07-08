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
    .isLength({min:6 }).withMessage("Password must be  min 6 charachter long")
    .notEmpty().withMessage("Password is required"),
  body("fullname")
    .notEmpty().withMessage("full name is required")
    .isLength({min:3 }).withMessage("fullname must be  min 6 charachter long"),


    validator
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validator
];
