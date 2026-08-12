import productModel from "../models/product.model.js";



export const stockOfVariant = async (productId, variantId) => {
    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) return 0

    const stock = product.variants.find(variant => variant._id.toString() === variantId)?.stock || 0

    return stock
}