import mongoose, { mongo, Mongoose } from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        require:true
    }
    ,
    description: {
        type:String,
        require:true
    },
    price: {
        amount: {
            type:Number,
             require:true
        },
        currency: {
            type:String,
            enum: ["USD" , "GBP" , "JPY" , "INR" , "EUR"],
            default:"INR"
        }
    },
    images:[
        {
            url:{
                type:String,
                require:true
            }
        }
    ]
})


const productModel = mongoose.model("product",productSchema)

export default productModel