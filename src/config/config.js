import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("mongo uri is empty in enviroment variable")
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT
}