import productModel from "../models/product.model.js"
import { imageKitUpload } from "../services/storage.service.js"

export const createProduct = async (req,res) =>{

    const {title, description, category, priceAmount,priceCurrency} = req.body
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
        category: category || "clothing",
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


export const getSellerProduct = async (req,res) =>{

    const seller = req.user

const products = await productModel.find({seller: seller._id})

    return res.status(200).json({
        message:"Products fetch Successfully",
        success:true,
        products 
    })

}

export const getAllProduts = async (req,res) => {

    const { category, search, priceMin, priceMax, sort } = req.query
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 24))

    // Public listing: open to all users, including non-registered visitors.
    const query = {}

    if (category && category !== "all"){
        query.category = category
    }
    if (search){
        const term = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
        query.$or = [
            { title: term },
            { description: term },
        ]
    }
    const priceQuery = {}
    if (priceMin){ priceQuery.$gte = Number(priceMin) }
    if (priceMax){ priceQuery.$lte = Number(priceMax) }
    if (Object.keys(priceQuery).length){
        query.price = query.price || {}
        query.price.amount = priceQuery
    }

    const sortOrder = sort === "priceAsc" ? { "price.amount": 1 }
                   : sort === "priceDesc" ? { "price.amount": -1 }
                   : { createdAt: -1, _id: -1 }

    const [products, total] = await Promise.all([
        productModel.find(query).sort(sortOrder).limit(limit).skip((page - 1) * limit),
        productModel.countDocuments(query),
    ])

    const totalPages = Math.ceil(total / limit)

    return res.status(200).json({
        message:"All products fetched successfully",
        sucess:true,
        products,
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
    })

}

export const getProdcutDetails = async (req,res) => {
    const {id} = req.params
    // console.log(id)
    const product = await productModel.findById(id)

    if(!product){
        return res.status(404).josn({message:"Product not found", success:false})
    }

    res.status(200).json({
        message:"product details fetched successfully",
        sucess:true,
        product
    })
}

export const getSellerProductDetail = async (req,res) =>{
    const {id} =req.params

    const product = await productModel.findById(id)

    if(!product){
        return res.ststua(404).json({message:"Product not found", success:false})
    }

    res.status(200).json({
        message:"Fetched Product Successfully",
        sucess:true,
        product
    })

}

export const addVariant = async (req,res) =>{
    const { id } = req.params
    const { attributes, stock, priceAmount, priceCurrency } = req.body

    const product = await productModel.findById(id)

    if(!product){
        return res.status(404).json({message:"Product not found", success:false})
    }

    if(String(product.seller) !== String(req.user._id)){
        return res.status(403).json({message:"Forbidden: you can only modify your own products", success:false})
    }

    let imageUrls = []
    if(req.files && req.files.length > 0){
        imageUrls = await Promise.all(req.files.map( async (file) =>{
            const img = await imageKitUpload({
                buffer:file.buffer,
                fileName:file.originalname || "variant"
            })
            return { url: img.url }
        }))
    }

    let parsedAttributes = {}
    if(attributes){
        if(typeof attributes === "string"){
            try {
                parsedAttributes = JSON.parse(attributes)
            } catch (err) {
                parsedAttributes = {}
            }
        } else {
            parsedAttributes = attributes
        }
    }

    product.variants.push({
        images: imageUrls,
        stock: Number(stock) || 0,
        attributes: parsedAttributes,
        price:{
            amount: priceAmount,
            currency: priceCurrency || "INR"
        }
    })

    await product.save()

    res.status(201).json({
        message:"Variant added successfully",
        success:true,
        product
    })
}

export const updateVariant = async (req,res) =>{
    const { id, variantId } = req.params
    const { stock } = req.body

    const product = await productModel.findById(id)

    if(!product){
        return res.status(404).json({message:"Product not found", success:false})
    }

    if(String(product.seller) !== String(req.user._id)){
        return res.status(403).json({message:"Forbidden: you can only modify your own products", success:false})
    }

    const variant = product.variants.id(variantId)

    if(!variant){
        return res.status(404).json({message:"Variant not found", success:false})
    }

    variant.stock = Number(stock) || 0

    await product.save()

    res.status(200).json({
        message:"Variant stock updated successfully",
        success:true,
        product
    })
}

export const deleteVariant = async (req,res) =>{
    const { id, variantId } = req.params

    const product = await productModel.findById(id)

    if(!product){
        return res.status(404).json({message:"Product not found", success:false})
    }

    if(String(product.seller) !== String(req.user._id)){
        return res.status(403).json({message:"Forbidden: you can only modify your own products", success:false})
    }

    product.variants = product.variants.filter(v => String(v._id) !== variantId)

    await product.save()

    res.status(200).json({
        message:"Variant deleted successfully",
        success:true,
        product
    })
}