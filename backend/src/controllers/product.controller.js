import productModel from "../models/product.model"

export const addProducts = async (req,res) =>{

    const {title, description , price, image , seller} = req.body

    const product = await productModel.create({
        title,
        description,
        price,
        seller,
        image
    })


    res.status(201).json({
        message:"product created successfully",
        success:true,
        product

    })





}