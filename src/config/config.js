import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("mongo uri is empty in enviroment variable")
}

if(!process.env.JWT_SECRET){
    throw new Error("jwt secret is undefined in enviroment variable")
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET : process.env.JWT_SECRET
}