import productModel from "../models/product.model.js"
import { imageKitUpload } from "../services/storage.service.js"

export const createProduct = async (req,res) =>{

    const {title, description , priceAmount,priceCurrency} = req.body
    const {role} = req.user

    // console.log("body")
    // console.log(title, description , priceAmount,priceCurrency)
    // console.log(req.user)
    // console.log(description)

    const images = await Promise.all(req.files.map( async (file) =>{
        return await imageKitUpload({
            buffer:file.buffer,
            fileName:file.orginalName || "file"
        })
    } ))


    const product = await productModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency: priceCurrency || "INR"
        },
        seller: req.user._id,
        role,
        images
    })


    res.status(201).json({
        message:"product created successfully",
        success:true,
        product

    })





}