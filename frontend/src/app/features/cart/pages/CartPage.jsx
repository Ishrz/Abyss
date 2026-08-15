
import { useState, useEffect } from "react"
import { Link } from "react-router"
import useCart from "../hook/useCart.js"
import Navbar from "../../common/components/Navbar.jsx"

const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }

const formatPrice = (amount, currency) =>
    `${currencySymbols[currency] || currency || ""}${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

const resolveItem = (item) => {
    const product = item?.product || {}
    const variants = Array.isArray(product.variants)
        ? product.variants
        : (product.variants ? [product.variants] : [])

    const variant = item?.variant
        ? variants.find(v => String(v?._id) === String(item.variant)) || null
        : null

    const image = variant?.images?.[0]?.url || product.images?.[0]?.url || null
    const attributes = variant && Object.keys(variant.attributes || {}).length > 0
        ? Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(" · ")
        : "Default"

    return { product, variant, image, attributes }
}

const CartSkeleton = () => (
    <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-100 rounded-xl w-40" />
        {[0, 1, 2].map(i => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4">
                <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2.5 py-1">
                    <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
                    <div className="h-9 bg-slate-100 rounded-xl w-28 mt-4" />
                </div>
                <div className="w-20 bg-slate-100 rounded-xl" />
            </div>
        ))}
    </div>
)

const CartPage = () => {
    const { handleGetCart, handleUpdateQuantity, handleRemoveItem } = useCart()
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        handleGetCart()
            .then(cart => setItems(cart?.items || []))
            .catch(err => setError(err?.response?.data?.message || "Failed to load cart"))
            .finally(() => setIsLoading(false))
    }, [])

    const totalPrice = items.reduce((sum, item) => sum + (Number(item.price?.amount) || 0) * (item.quantity || 1), 0)
    const currency = items[0]?.price?.currency || items[0]?.product?.price?.currency || "INR"
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0)

    async function handleQuantityChange(item, nextQty) {
        if (nextQty < 1) return
        const key = `${item.product._id}-${item.variant || "default"}`
        setIsUpdating(key)
        setError(null)
        try {
            const cart = await handleUpdateQuantity({
                productId: item.product._id,
                variantId: item.variant || undefined,
                quantity: nextQty
            })
            setItems(cart?.items || [])
        } catch (err) {
            setError(err?.response?.data?.message || "Could not update quantity")
        } finally {
            setIsUpdating(null)
        }
    }

    async function handleRemove(item) {
        const key = `${item.product._id}-${item.variant || "default"}`
        setIsUpdating(key)
        setError(null)
        try {
            const cart = await handleRemoveItem({
                productId: item.product._id,
                variantId: item.variant || undefined
            })
            setItems(cart?.items || [])
        } catch (err) {
            setError(err?.response?.data?.message || "Could not remove item")
        } finally {
            setIsUpdating(null)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>

                {error && (
                    <div className="mb-5 flex items-center justify-between gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-600">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}

                {isLoading ? <CartSkeleton /> : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center bg-white border border-slate-100 rounded-2xl">
                        <div className="p-5 bg-indigo-50 rounded-2xl text-indigo-300 mb-5">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">Your cart is empty</h2>
                        <p className="text-sm font-medium text-slate-400 max-w-xs mb-6">
                            Looks like you haven't added anything yet. Explore our collection and find something you love.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                        {/* ── Items ── */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map(item => {
                                const { product, image, attributes } = resolveItem(item)
                                const key = `${item.product._id}-${item.variant || "default"}`
                                const lineTotal = (Number(item.price?.amount) || 0) * (item.quantity || 1)
                                const isBusy = isUpdating === key
                                return (
                                    <div key={key} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 shadow-sm">
                                        <Link to={`/product/${product._id}`} className="flex-shrink-0">
                                            {image ? (
                                                <img src={image} alt={product.title} className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border border-slate-100" />
                                            ) : (
                                                <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-100 rounded-xl" />
                                            )}
                                        </Link>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3">
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 hover:text-indigo-600 transition-colors">
                                                        {product.title}
                                                    </h3>
                                                </Link>
                                                <button
                                                    onClick={() => handleRemove(item)}
                                                    disabled={isBusy}
                                                    className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                                                    aria-label="Remove item"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <span className="inline-block mt-1.5 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                                {attributes}
                                            </span>

                                            <div className="mt-3 md:mt-4 flex flex-wrap items-center justify-between gap-3">
                                                <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white">
                                                    <button
                                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                        disabled={isBusy || item.quantity <= 1}
                                                        className="px-3 py-2 text-slate-500 hover:text-indigo-600 transition-colors active:scale-95 disabled:opacity-40"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                        </svg>
                                                    </button>
                                                    <span className="w-9 text-center text-sm font-bold text-slate-900 tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                        disabled={isBusy}
                                                        className="px-3 py-2 text-slate-500 hover:text-indigo-600 transition-colors active:scale-95 disabled:opacity-40"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-slate-900">{formatPrice(item.price?.amount, item.price?.currency)}</div>
                                                    <div className="text-[11px] font-semibold text-slate-400">
                                                        Line total: <span className="text-indigo-600">{formatPrice(lineTotal, item.price?.currency)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* ── Summary ── */}
                        <div className="h-fit lg:sticky lg:top-20">
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-5">Order Summary</h2>

                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Items ({itemCount})</span>
                                        <span className="font-semibold text-slate-900">{formatPrice(totalPrice, currency)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Delivery</span>
                                        <span className="font-semibold text-emerald-600">Free</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 mb-6 flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Total</span>
                                    <span className="text-2xl font-extrabold text-indigo-600">{formatPrice(totalPrice, currency)}</span>
                                </div>

                                <button
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage