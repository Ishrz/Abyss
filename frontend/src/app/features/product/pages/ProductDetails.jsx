import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import useProduct from "../hook/useProduct.js"

// ─── Constants ───────────────────────────────────────────────────────────────
const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }

// ─── No-Image Placeholder ────────────────────────────────────────────────────
const NoImagePlaceholder = () => (
    <div className="bg-gradient-to-br from-slate-100 to-slate-50 aspect-square w-full flex flex-col items-center justify-center text-slate-300 gap-2 rounded-2xl">
        <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="text-[11px] font-bold uppercase tracking-wider">No Image</span>
    </div>
)

// ─── Loading Skeleton ────────────────────────────────────────────────────────
const DetailsSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
        <div className="bg-slate-100 aspect-square rounded-2xl" />
        <div className="space-y-5 pt-2">
            <div className="h-3 bg-slate-100 rounded-lg w-24" />
            <div className="h-8 bg-slate-100 rounded-xl w-3/4" />
            <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
            <div className="h-5 bg-slate-100 rounded-lg w-32" />
            <div className="space-y-2.5 pt-2">
                <div className="h-3 bg-slate-100 rounded-lg w-full" />
                <div className="h-3 bg-slate-100 rounded-lg w-full" />
                <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
            </div>
            <div className="h-12 bg-slate-100 rounded-2xl w-full mt-4" />
        </div>
    </div>
)

// ─── Product Details Page ────────────────────────────────────────────────────
const ProductDetails = () => {

    const params = useParams()
    const { productId } = params
    const { handleProductDetails } = useProduct()
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [imgError, setImgError] = useState(false)
    const [activeImage, setActiveImage] = useState(0)
    const [qty, setQty] = useState(1)

    async function fetchProductDetails() {
        const data = await handleProductDetails(productId)
        setProduct(data)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchProductDetails()
    }, [productId])

    const symbol = currencySymbols[product?.price?.currency] || product?.price?.currency || ""
    const images = product?.images || []
    const hasImage = images.length > 0 && !imgError

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
                    <Link to="/" className="text-xl font-extrabold text-indigo-600 tracking-tight">ABYSS</Link>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Back to Shop
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-14">

                {isLoading ? <DetailsSkeleton /> : !product ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="p-5 bg-indigo-50 rounded-2xl text-indigo-300 mb-5">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">Product not found</h2>
                        <p className="text-sm font-medium text-slate-400 max-w-xs mb-6">
                            The item you're looking for doesn't exist or may have been removed.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                        {/* ── Image Gallery ── */}
                        <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                                {hasImage ? (
                                    <img
                                        key={activeImage}
                                        src={images[activeImage].url}
                                        alt={product.title}
                                        onError={() => setImgError(true)}
                                        className="w-full aspect-square object-cover"
                                    />
                                ) : (
                                    <NoImagePlaceholder />
                                )}
                                {images.length > 1 && (
                                    <span className="absolute bottom-4 right-4 bg-black/50 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                                        {activeImage + 1} / {images.length}
                                    </span>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto py-1">
                                    {images.map((img, i) => (
                                        <button
                                            key={img._id || i}
                                            onClick={() => { setImgError(false); setActiveImage(i) }}
                                            className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i
                                                    ? "border-indigo-600 ring-2 ring-indigo-600/20"
                                                    : "border-slate-200 hover:border-indigo-400"
                                                }`}
                                        >
                                            <img src={img.url} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Product Info ── */}
                        <div className="flex flex-col lg:pt-4">

                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-3">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                Abyss Collection
                            </span>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl md:text-4xl font-extrabold text-indigo-600 tracking-tight">
                                    {symbol}{Number(product.price?.amount).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    {product.price?.currency}
                                </span>
                            </div>

                            <div className="border-t border-slate-100 pt-6 mb-6">
                                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Description</h2>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* ── Quantity ── */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</span>
                                <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
                                    <button
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="px-4 py-2.5 text-slate-500 hover:text-indigo-600 transition-colors active:scale-95 disabled:opacity-40"
                                        disabled={qty <= 1}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                        </svg>
                                    </button>
                                    <span className="w-10 text-center text-sm font-bold text-slate-900 tabular-nums">{qty}</span>
                                    <button
                                        onClick={() => setQty(q => Math.min(99, q + 1))}
                                        className="px-4 py-2.5 text-slate-500 hover:text-indigo-600 transition-colors active:scale-95"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl text-sm transition-all active:scale-[0.98]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                    Buy Now
                                </button>
                            </div>

                            {/* ── Trust Badges ── */}
                            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                    <span className="text-[11px] font-semibold text-slate-500">Authentic</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                    <span className="text-[11px] font-semibold text-slate-500">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                    </svg>
                                    <span className="text-[11px] font-semibold text-slate-500">Secure Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ProductDetails