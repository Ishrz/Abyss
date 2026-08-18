import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("mongo uri is not defiend in enviroment variable")
}

if(!process.env.JWT_SECRET){
    throw new Error("jwt secret is not defiend in enviroment variable")
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("Google client id is not defiend in enviroment varaible")
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("Google client secret is not defiend in enviroment varaible")
}

if(!process.env.NODE_ENV){
    throw new Error("Node Env is not defiend in enviroment varaible")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("ImageKit private key is not defiend in enviroment variable")
}

if(!process.env.RAZORPAY_KEY_ID){
    throw new Error("razorpay key id is not defiend in enviroment variable")
}

if(!process.env.RAZORPAY_KEY_SECRET){
    throw new Error("razorpay key secret key is not defiend in enviroment variable")
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET : process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV : process.env.NODE_ENV,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
}