import mongoose, { mongo, Mongoose } from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "GBP", "JPY", "INR", "EUR"],
      default: "INR",
    },
  },
  variants: [
    {
      images: [
        {
          url: {
            type: String,
            required: true,
          },
        },
      ],
      stock: {
        type: Number,
        default: 0,
      },
      attributes: {
        type: Map,
        of: String,
      },
      price: {
        amount: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          enum: ["USD", "GBP", "JPY", "INR", "EUR"],
          default: "INR",
        },
      },
    },
  ],
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

const productModel = mongoose.model("product", productSchema);

export default productModel;
