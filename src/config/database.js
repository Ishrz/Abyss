import mongoose from "mongoose";
import {config} from "./config.js"

export const databaseConnection = async () => {
    try{
        const MONGOURI = config.MONGO_URI

        await mongoose.connect(MONGOURI)
        console.log("Databse connected...")

    }catch(err){
        console.log("Error in connecting Database" , err)
    }
}