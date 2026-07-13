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
    descriptioon: {
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
            },
            alt:{
                type:String,
                require:true
            }
        }
    ]
})


const produtModel = mongoose.model("product",productSchema)

export default productModel