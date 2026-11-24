import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import useProduct from "../hook/useProduct.js"
import Navbar from "../../common/components/Navbar.jsx"
import useCart from "../../cart/hook/useCart.js"

const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }

const NoImagePlaceholder = () => (
    <div className="aspect-square w-full bg-gradient-to-br from-slate-100 to-slate-50 flex flex-col items-center justify-center text-slate-300 gap-2 rounded-3xl border border-slate-100">
        <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
    </div>
)

const ProductDetails = () => {
    const { handleAddToCart } = useCart()
    const params = useParams()
    const { productId } = params
    const { handleProductDetails } = useProduct()
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)
    const [qty, setQty] = useState(1)
    const [selections, setSelections] = useState({})

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            const data = await handleProductDetails(productId)
            if (!cancelled) {
                setProduct(data)
                setIsLoading(false)
                const gallery = [
                    ...(data?.images || []),
                    ...(data?.variants?.flatMap(v => v?.images || []) || [])
                ].filter((img, i, arr) => arr.findIndex(x => x.url === img.url) === i)
                const idx = gallery.findIndex(g => g.url === data?.images?.[0]?.url)
                setActiveImage(idx >= 0 ? idx : 0)
                setSelections({})
            }
        }
        load()
        return () => { cancelled = true }
    }, [productId])

    const variants = product?.variants || []
    const attributeTypes = [...new Set(variants.flatMap(v => Object.keys(v?.attributes || {})))]
    const optionsByType = {}
    attributeTypes.forEach(type => {
        optionsByType[type] = [...new Set(variants.filter(v => v?.attributes?.[type]).map(v => v.attributes[type]))]
    })

    const findMatchingVariant = (selectionObj) => {
        if (variants.length === 0 || Object.keys(selectionObj).length === 0) return null
        const matches = variants.filter(v => {
            const attrs = v?.attributes || {}
            return Object.entries(attrs).every(([key, value]) => selectionObj[key] === value)
        })
        matches.sort((a, b) => Object.keys(b?.attributes || {}).length - Object.keys(a?.attributes || {}).length)
        return matches[0] || null
    }

    const selectedVariant = findMatchingVariant(selections)
    const activePrice = selectedVariant?.price || product?.price
    const activeStock = selectedVariant != null ? selectedVariant.stock : null
    const activePriceSymbol = currencySymbols[activePrice?.currency] || activePrice?.currency || ""

    const galleryImages = [
        ...(product?.images || []),
        ...(variants.flatMap(v => v?.images || []))
    ].filter((img, i, arr) => arr.findIndex(x => x.url === img.url) === i)

    const setImageToFirstOf = (images) => {
        const firstUrl = images?.[0]?.url
        const idx = galleryImages.findIndex(g => g.url === firstUrl)
        setActiveImage(idx >= 0 ? idx : 0)
    }

    function handleSelect(type, value) {
        let next = { ...selections }
        if (next[type] === value) delete next[type]
        else next[type] = value
        setSelections(next)
        const variant = findMatchingVariant(next)
        setImageToFirstOf(variant?.images || product?.images)
    }

    function handleReset() {
        setSelections({})
        setImageToFirstOf(product?.images)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
                        <div className="aspect-square bg-slate-100 rounded-3xl" />
                        <div className="space-y-6">
                            <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                            <div className="h-10 bg-slate-100 rounded-xl w-3/4" />
                            <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                            <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
                            <div className="space-y-4 pt-4">
                                <div className="h-3 bg-slate-100 rounded-lg w-full" />
                                <div className="h-3 bg-slate-100 rounded-lg w-full" />
                                <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
                            </div>
                            <div className="h-12 bg-slate-100 rounded-[2rem] w-full mt-8" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="p-8 bg-white/50 backdrop-blur-sm rounded-[3rem] text-indigo-300 mb-8 border border-white/20">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Product not found</h2>
                    <p className="text-sm text-slate-400 max-w-xs mb-8">
                        The item you're looking for doesn't exist or may have been removed.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-indigo-600/25 active:scale-[0.98]"
                    >
                        Browse Collection
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16">

                {/* Breadcrumbs */}
                <nav className="flex gap-2 mb-8 text-xs text-slate-400 font-medium">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-slate-600">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* ── Left: Image Gallery ── */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="relative aspect-[1.2] rounded-[2rem] border border-slate-100 shadow-sm bg-white overflow-hidden">
                            {galleryImages.length > 0 ? (
                                <img
                                    key={activeImage}
                                    src={galleryImages[activeImage]?.url}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                                />
                            ) : (
                                <NoImagePlaceholder />
                            )}
                            <span className="absolute bottom-4 right-4 bg-black/40 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {activeImage + 1} / {galleryImages.length}
                            </span>
                            <button
                                className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
                                onClick={() => setActiveImage(i => (i + 1) % galleryImages.length)}
                            >
                                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>

                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {galleryImages.map((img, i) => (
                                    <button
                                        key={img._id || i}
                                        onClick={() => setActiveImage(i)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i
                                            ? "border-indigo-600 ring-1 ring-indigo-600"
                                            : "border-transparent hover:border-slate-200"
                                            }`}
                                    >
                                        <img src={img.url} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Product Info ── */}
                    <div className="lg:col-span-6 flex flex-col lg:pt-4">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-4">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            Abyss Collection · {product.category}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                            {product.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="text-4xl md:text-5xl font-extrabold text-indigo-600 tracking-tight">
                                {activePriceSymbol}{Number(activePrice?.amount).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {activePrice?.currency}
                            </span>
                            {selectedVariant != null && (
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${activeStock > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
                                    {activeStock > 0 ? `${activeStock} in stock` : "Out of stock"}
                                </span>
                            )}
                        </div>

                        {/* Variants */}
                        {attributeTypes.length > 0 && (
                            <div className="border border-slate-100 rounded-[2rem] p-6 bg-white/50 backdrop-blur-sm mb-8 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Variants</h2>
                                    {Object.keys(selections).length > 0 && (
                                        <button
                                            onClick={handleReset}
                                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                                        >
                                            Reset All
                                        </button>
                                    )}
                                </div>
                                {attributeTypes.map(type => (
                                    <div key={type}>
                                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            {type}
                                            {selections[type] ? <span className="text-slate-600 normal-case font-medium ml-1">{selections[type]}</span> : null}
                                        </h2>
                                        <div className="flex flex-wrap gap-2.5">
                                            {optionsByType[type].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleSelect(type, option)}
                                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all active:scale-95 capitalize ${selections[type] === option
                                                        ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-5 mb-10">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
                            <div className="inline-flex items-center border border-slate-200 rounded-[2rem] bg-white shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    disabled={qty <= 1}
                                    className="px-4 py-2.5 text-slate-400 hover:text-indigo-600 transition-colors active:scale-95 disabled:opacity-30"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                    </svg>
                                </button>
                                <span className="w-10 text-center text-sm font-bold text-slate-900 tabular-nums">{qty}</span>
                                <button
                                    onClick={() => setQty(q => Math.min(99, q + 1))}
                                    className="px-4 py-2.5 text-slate-400 hover:text-indigo-600 transition-colors active:scale-95"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-12">
                            <button
                                onClick={() => {
                                    if (activeStock === 0) return
                                    handleAddToCart({ productId: product._id, variantId: selectedVariant?._id, quantity: qty })
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4.5 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-[2rem] text-sm tracking-tight transition-all shadow-sm active:scale-[0.98] hover:bg-indigo-50"
                                disabled={activeStock === 0}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 004 0z" />
                                </svg>
                                Add to Bag
                            </button>
                            <button className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-[2rem] text-sm tracking-tight transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98]">
                                Buy Now
                            </button>
                        </div>

                        {/* Description */}
                        <div className="border border-slate-100 rounded-[2rem] bg-white p-8 shadow-sm mb-12">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Description</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-6 border-t border-slate-100 pt-8">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Authentic</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4m8 0V4m0 0v.01M8 12a3 3 0 100-6 3 3 0 000 6z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secure Pay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
