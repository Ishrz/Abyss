import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"

export const addToCart = async (req, res) => {
    const { productId, variantId } = req.params
    const { quantity = 1 } = req.body

    let product
    let variant = null

    if (variantId) {
        product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        })

        if (!product) {
            return res.status(404).json({
                message: "product or variant not found",
                success: false
            })
        }

        variant = product.variants.id(variantId)
    } else {
        product = await productModel.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "product not found",
                success: false
            })
        }
    }

    // main product has no stock field, so treat it as always available
    const stock = variant ? variant.stock : Number.MAX_SAFE_INTEGER

    //find already cart or create new one
    let cart = (await cartModel.findOne({ user: req.user._id })) || (await cartModel.create({ user: req.user._id }))

    //check if product already in cart or not for increasing its quantity
    const isProductAlreadyInCart = cart.items.some(item =>
        item.product.toString() === productId &&
        (variantId ? item.variant?.toString() === variantId : !item.variant)
    )

    //if cart already exist, and item already present in cart so we increase quantity
    if (isProductAlreadyInCart) {
        const existingItem = cart.items.find(item =>
            item.product.toString() === productId &&
            (variantId ? item.variant?.toString() === variantId : !item.variant)
        )

        const quantityInCart = existingItem.quantity

        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                success: false
            })
        }

        cart = await cartModel.findOneAndUpdate(
            {
                user: req.user._id,
                "items.product": productId,
                ...(variantId ? { "items.variant": variantId } : { "items.variant": null })
            },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            cart
        })
    }

    //if cart is not exist already so we create a new one

    //check if usser quantity is exced stock
    if (quantity > stock) {
        return res.status(400).json({
            message: `only ${stock} items left in stock`,
            success: false
        })
    }

    cart.items.push({
        product: productId,
        variant: variantId || null,
        quantity: quantity,
        price: variant?.price || product.price
    })

    await cart.save()

    return res.status(201).json({
        message: "Product added to cart successfully",
        success: true,
        cart
    })
}

export const getCart =async (req,res) => {

    const user = req.user

    let cart = await cartModel.findOne({user:user._id}).populate("items.product")

    if(!cart){
        cart = await cartModel.create({user:user._id})
    }

    return res.status(200).json({
        message:"Cart fetched successfully",
        success:true,
        cart
    })

}