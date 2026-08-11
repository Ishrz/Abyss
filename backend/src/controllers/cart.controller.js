import cartModel from "../models/cart.model"
import productModel from "../models/product.model"

export const addToCart = (req,res) =>{
    const {productId, variantId} = req.param

    const product = await productModel.findOne({
        productId,
        variantId
    })

    if(!product){
        return res.status(404).json({
            message:"product or variant not found",
            success:false
        })
    }

    const cart = (await cartModel.findOne({user:req.user._id})) || (await cartModel.create({user:req.user._id}))


    const isProductAlreadyInCart = cart.items.some(item => 
        item.product.toString() === productId && item.variant?.toString() === variantId)



}