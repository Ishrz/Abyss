import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";


export const getFinalCart = async() =>{
    const cart = (await cartModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id)
        }
      },
      { $unwind: { path: '$items' } },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'items.product'
        }
      },
      { $unwind: { path: '$items.product', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          matchedVariant: {
            $ifNull: [
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: { $ifNull: ['$items.product.variants', []] },
                      as: 'v',
                      cond: { $eq: ['$$v._id', '$items.variant'] }
                    }
                  },
                  0
                ]
              },
              null
            ]
          }
        }
      },
      {
        $match: {
          $expr: {
            $and: [
              { $ne: ['$items.product', null] },
              {
                $or: [
                  { $eq: ['$items.variant', null] },
                  { $ne: ['$matchedVariant', null] }
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          'items.product.variants': '$matchedVariant',
          itemPrice: {
            price: {
              $multiply: [
                {
                  $ifNull: [
                    '$matchedVariant.price.amount',
                    '$items.product.price.amount',
                    '$items.price.amount',
                    0
                  ]
                },
                '$items.quantity'
              ]
            },
            currency: {
              $ifNull: [
                '$matchedVariant.price.currency',
                '$items.product.price.currency',
                '$items.price.currency'
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          items: { $push: '$items' },
          totalPrice: { $sum: '$itemPrice.price' },
          currency: {
            $first: '$itemPrice.currency'
          }
        }
      }
    ]))[0]


    return cart
}