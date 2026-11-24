import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import useCart from "../hook/useCart.js"
import Navbar from "../../common/components/Navbar.jsx"

const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }

const formatPrice = (amount, currency) =>
    `${currencySymbols[currency] || currency || ""}${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

const resolveItem = (item) => {
    const product = item?.product || {}
    const variants = Array.isArray(product.variants) ? product.variants : (product.variants ? [product.variants] : [])
    const variant = item?.variant ? variants.find(v => String(v?._id) === String(item.variant)) || null : null
    const image = variant?.images?.[0]?.url || product.images?.[0]?.url || null
    const attributes = variant && Object.keys(variant.attributes || {}).length > 0
        ? Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(" · ")
        : "Default"
    return { product, variant, image, attributes }
}

const CartPage = () => {
    const { handleGetCart, handleUpdateQuantity, handleRemoveItem, handleCreatePaymentOrder } = useCart()
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

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
            const cart = await handleUpdateQuantity({ productId: item.product._id, variantId: item.variant || undefined, quantity: nextQty })
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
            const cart = await handleRemoveItem({ productId: item.product._id, variantId: item.variant || undefined })
            setItems(cart?.items || [])
        } catch (err) {
            setError(err?.response?.data?.message || "Could not remove item")
        } finally {
            setIsUpdating(null)
        }
    }

    async function handlePayment() {
        try {
            await handleCreatePaymentOrder()
            navigate("/")
        } catch (err) {
            setError(err?.response?.data?.message || "Payment failed")
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Bag</h1>
                        <p className="text-sm text-slate-500 font-medium">
                            {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2.5 rounded-xl hover:bg-slate-100"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-[2rem] text-sm font-semibold text-red-600 shadow-sm">
                        <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-6">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex gap-5 animate-pulse">
                                <div className="w-24 h-32 bg-slate-100 rounded-xl flex-shrink-0" />
                                <div className="flex-1 space-y-4">
                                    <div className="h-8 bg-slate-100 rounded-lg w-3/4" />
                                    <div className="h-4 bg-slate-100 rounded-lg w-full" />
                                    <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
                                    <div className="h-12 bg-slate-100 rounded-[2rem] w-48 mt-2" />
                                </div>
                                <div className="w-24 bg-slate-100 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                        <div className="p-8 bg-indigo-50 rounded-[2rem] text-indigo-300 mb-8 inline-block">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Your bag is empty</h2>
                        <p className="text-sm text-slate-400 max-w-xs mb-8">
                            Looks like you haven't added anything yet. Explore our collection and find something you love.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-[2rem] text-sm transition-all shadow-xl shadow-indigo-600/25 active:scale-[0.98]"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                        {/* ── Items ── */}
                        <div className="lg:col-span-7 space-y-6">
                            {items.map(item => {
                                const { product, image, attributes } = resolveItem(item)
                                const key = `${item.product._id}-${item.variant || "default"}`
                                const lineTotal = (Number(item.price?.amount) || 0) * (item.quantity || 1)
                                const isBusy = isUpdating === key
                                return (
                                    <div key={key} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex gap-5 shadow-sm hover:shadow-md transition-all duration-200">
                                        <Link to={`/product/${product._id}`} className="flex-shrink-0">
                                            {image ? (
                                                <img src={image} alt={product.title} className="w-24 h-32 object-cover rounded-xl border border-slate-100" />
                                            ) : (
                                                <div className="w-24 h-32 bg-slate-100 rounded-xl" />
                                            )}
                                        </Link>

                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
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

                                            <span className="inline-block mt-2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                {attributes}
                                            </span>

                                            <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-50">
                                                <div className="inline-flex items-center border border-slate-200 rounded-[2rem] bg-white">
                                                    <button
                                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                        disabled={isBusy || item.quantity <= 1}
                                                        className="px-4 py-2 text-slate-500 hover:text-indigo-600 transition-colors active:scale-95 disabled:opacity-40"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-bold text-slate-900 tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                        disabled={isBusy}
                                                        className="px-4 py-2 text-slate-500 hover:text-indigo-600 transition-colors active:scale-95 disabled:opacity-40"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-slate-900">{formatPrice(item.price?.amount, item.price?.currency)}</div>
                                                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
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
                        <div className="lg:col-span-5">
                            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm sticky top-24 h-fit">
                                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Order Summary</h2>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Items ({itemCount})</span>
                                        <span className="font-semibold text-slate-900">{formatPrice(totalPrice, currency)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Delivery</span>
                                        <span className="font-semibold text-emerald-600">Free</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Taxes</span>
                                        <span className="font-semibold text-slate-900">Included</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6 mb-10 flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Total</span>
                                    <span className="text-3xl font-extrabold text-indigo-600">{formatPrice(totalPrice, currency)}</span>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-[2rem] text-sm tracking-tight transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Checkout
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
