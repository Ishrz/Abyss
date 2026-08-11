import mongoose from "mongoose";


const priceSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "GBP", "JPY", "INR", "EUR"],
      default: "INR",
    }
},{
    _id:false,
    _v:false
})


export default priceSchema