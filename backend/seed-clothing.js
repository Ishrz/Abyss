// Seeds a batch of clothing products for the public listing (category: "clothing").
// Product images are real free stock photos from Pexels (free for commercial use with attribution).
// Reuses the app's config/database. Usage: cd backend && npm run seed
import mongoose from "mongoose"
import productModel from "./src/models/product.model.js"
import userModel from "./src/models/user.model.js"
import { databaseConnection } from "./src/config/database.js"

const SELLER_EMAIL = "seed.seller@abyss.local"

const img = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`

const SEED_DATA = [
    {
        title: "Printed Cotton Round Neck T-Shirt",
        description: "Soft 100% cotton tee with a subtle dot print, worked for everyday wear.",
        priceAmount: 1299,
        priceCurrency: "INR",
        imageIds: [18257675, 9985771],
        variants: [
            { attributes: { size: "S", color: "White" }, stock: 40, priceAmount: 1299, priceCurrency: "INR" },
            { attributes: { size: "M", color: "White" }, stock: 40, priceAmount: 1299, priceCurrency: "INR" },
            { attributes: { size: "L", color: "White" }, stock: 40, priceAmount: 1299, priceCurrency: "INR" },
        ],
    },
    {
        title: "Denim Straight Fit Jeans",
        description: "Medium-wash straight-leg jeans with a comfortable sit.",
        priceAmount: 3490,
        priceCurrency: "INR",
        imageIds: [10133274, 6764142],
        variants: [
            { attributes: { size: "M", color: "Blue Denim" }, stock: 12, priceAmount: 3490, priceCurrency: "INR" },
            { attributes: { size: "L", color: "Blue Denim" }, stock: 12, priceAmount: 3490, priceCurrency: "INR" },
        ],
    },
    {
        title: "Linen Straight Trousers",
        description: "Classic linen-blend trousers, breathable and relaxed.",
        priceAmount: 2299,
        priceCurrency: "INR",
        imageIds: [10341113],
        variants: [
            { attributes: { size: "M", color: "Beige" }, stock: 20, priceAmount: 2299, priceCurrency: "INR" },
        ],
    },
    {
        title: "Oversized Chunky Knit Sweater",
        description: "Cable-knit style cardigan with a relaxed silhouette.",
        priceAmount: 2799,
        priceCurrency: "INR",
        imageIds: [18885255, 6630834],
        variants: [
            { attributes: { size: "L", color: "Olive" }, stock: 25, priceAmount: 2799, priceCurrency: "INR" },
            { attributes: { size: "XL", color: "Olive" }, stock: 25, priceAmount: 2799, priceCurrency: "INR" },
        ],
    },
    {
        title: "Polyester Blend Active Hoodie",
        description: "Lighter-than-usual hoodie with kangaroo pocket, made for movement.",
        priceAmount: 1899,
        priceCurrency: "INR",
        imageIds: [36888404],
        variants: [
            { attributes: { size: "M", color: "Black" }, stock: 30, priceAmount: 1899, priceCurrency: "INR" },
            { attributes: { size: "L", color: "Black" }, stock: 30, priceAmount: 1899, priceCurrency: "INR" },
        ],
    },
    {
        title: "Silk Bandage Skirt",
        description: "A-line satin skirt, 10-inch slit, great for evening wear.",
        priceAmount: 5990,
        priceCurrency: "INR",
        imageIds: [6046219],
        variants: [
            { attributes: { size: "S", color: "Dust Pink" }, stock: 8, priceAmount: 5990, priceCurrency: "INR" },
            { attributes: { size: "M", color: "Dust Pink" }, stock: 8, priceAmount: 5990, priceCurrency: "INR" },
        ],
    },
    {
        title: "TENCEL Linen Mix Dress",
        description: "Championed by shoppers for comfort, with a gentle drape.",
        priceAmount: 4290,
        priceCurrency: "INR",
        imageIds: [8198047],
        variants: [
            { attributes: { size: "L", color: "Ivory" }, stock: 15, priceAmount: 4290, priceCurrency: "INR" },
        ],
    },
    {
        title: "Velvet Midi Skirt",
        description: "Soft velvet midi skirt, a staple for weekend gatherings.",
        priceAmount: 3790,
        priceCurrency: "INR",
        imageIds: [27459368],
        variants: [
            { attributes: { size: "M", color: "Midnight Blue" }, stock: 18, priceAmount: 3790, priceCurrency: "INR" },
            { attributes: { size: "L", color: "Midnight Blue" }, stock: 18, priceAmount: 3790, priceCurrency: "INR" },
        ],
    },
    {
        title: "Leather Biker Jacket",
        description: "Classic biker jacket, weather-resistant finish.",
        priceAmount: 18599,
        priceCurrency: "INR",
        imageIds: [32836908],
        variants: [
            { attributes: { size: "M", color: "Black" }, stock: 6, priceAmount: 18599, priceCurrency: "INR" },
        ],
    },
    {
        title: "Mulberry Silk Blouse",
        description: "Luxurious mulberry silk blouse, v-neck with cuffs.",
        priceAmount: 7990,
        priceCurrency: "USD",
        imageIds: [20636648],
        variants: [
            { attributes: { size: "S", color: "Cream" }, stock: 9, priceAmount: 7990, priceCurrency: "USD" },
            { attributes: { size: "M", color: "Cream" }, stock: 9, priceAmount: 7990, priceCurrency: "USD" },
        ],
    },
    {
        title: "Tribal Embroidered Crop Top",
        description: "Hand-embroidered crop top with tribal patterns.",
        priceAmount: 2199,
        priceCurrency: "INR",
        imageIds: [2885170],
        variants: [
            { attributes: { size: "S", color: "Navy" }, stock: 30, priceAmount: 2199, priceCurrency: "INR" },
            { attributes: { size: "M", color: "Navy" }, stock: 30, priceAmount: 2199, priceCurrency: "INR" },
        ],
    },
    {
        title: "Recycled Polyester Skinny Jeans",
        description: "Slim fit jeans made from recycled polyester, mid-rise.",
        priceAmount: 2690,
        priceCurrency: "INR",
        imageIds: [19824259],
        variants: [
            { attributes: { size: "M", color: "Denim Blue" }, stock: 22, priceAmount: 2690, priceCurrency: "INR" },
            { attributes: { size: "L", color: "Denim Blue" }, stock: 22, priceAmount: 2690, priceCurrency: "INR" },
        ],
    },
]

const getSeedSeller = async () => {
    const existing = await userModel.findOne({ email: SELLER_EMAIL })
    if (existing) return existing
    return userModel.create({
        fullname: "Seed Seller",
        email: SELLER_EMAIL,
        password: "seed-seller-password-123",
        role: "seller",
        contact: "+910000000000",
    })
}

const seedClothing = async () => {
    await databaseConnection()
    const seller = await getSeedSeller()

    let created = 0
    let updated = 0
    let skipped = 0
    for (const p of SEED_DATA) {
        const images = p.imageIds.map(img)
        const exists = await productModel.findOne({ title: p.title, seller: seller._id })
        if (exists) {
            exists.images = images.map(url => ({ url }))
            await exists.save()
            updated++
            continue
        }
        await productModel.create({
            title: p.title,
            description: p.description,
            category: "clothing",
            price: { amount: p.priceAmount, currency: p.priceCurrency },
            images: images.map(url => ({ url })),
            variants: p.variants.map(v => ({
                images: [],
                stock: v.stock,
                attributes: v.attributes,
                price: { amount: v.priceAmount, currency: v.priceCurrency },
            })),
            seller: seller._id,
        })
        created++
    }

    console.log(`Clothing seed done — ${created} created, ${updated} images updated, ${skipped} skipped`)
    await mongoose.disconnect()
}

seedClothing().catch(err => {
    console.error("Clothing seed failed:", err)
    mongoose.disconnect()
    process.exit(1)
})
