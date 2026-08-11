import { useParams, useNavigate, Link } from "react-router"
import useProduct from "../hook/useProduct"
import { useEffect, useState, useRef } from "react"

// ─── Constants ───────────────────────────────────────────────────────────────
const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" }
const currencies = [
    { value: "INR", label: "INR (₹)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
]

const formatPrice = (amount, currency) => {
    const symbol = currencySymbols[currency] || currency || ""
    const num = Number(amount || 0)
    return `${symbol}${num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

// ─── No-Image Placeholder ────────────────────────────────────────────────────
const NoImagePlaceholder = ({ compact }) => (
    <div className={`bg-gradient-to-br from-slate-100 to-slate-50 w-full flex flex-col items-center justify-center text-slate-300 gap-1.5 rounded-xl ${compact ? "aspect-square" : "aspect-square"}`}>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
    </div>
)

// ─── Loading Skeleton ────────────────────────────────────────────────────────
const DetailsSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-40 aspect-square bg-slate-100 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-3 pt-2">
                    <div className="h-3 bg-slate-100 rounded-lg w-24" />
                    <div className="h-7 bg-slate-100 rounded-xl w-2/3" />
                    <div className="h-3 bg-slate-100 rounded-lg w-full" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                    <div className="h-5 bg-slate-100 rounded-lg w-32" />
                </div>
            </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="h-5 bg-slate-100 rounded-lg w-40" />
            <div className="h-24 bg-slate-100 rounded-xl w-full" />
            <div className="h-24 bg-slate-100 rounded-xl w-full" />
        </div>
    </div>
)

// ─── Attribute Chips ─────────────────────────────────────────────────────────
const AttributeChips = ({ attributes }) => {
    const entries = Object.entries(attributes || {})
    if (entries.length === 0) {
        return <span className="text-[11px] font-medium text-slate-400 italic">No attributes</span>
    }
    return (
        <div className="flex flex-wrap gap-1.5">
            {entries.map(([key, value]) => (
                <span key={key} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    <span className="text-slate-400 uppercase tracking-wide">{key}:</span>
                    {value}
                </span>
            ))}
        </div>
    )
}

// ─── Build Stock Drafts Helper ───────────────────────────────────────────────
const buildStockDrafts = (p) => {
    const drafts = {}
    ;(p?.variants || []).forEach(v => { drafts[v._id] = v.stock })
    return drafts
}

// ─── Seller Product Details Page ─────────────────────────────────────────────
const SellerProdcutDetails = () => {
    const { productId } = useParams()
    const navigate = useNavigate()
    const {
        handleGetSellerProdcutDetais,
        handleAddProductVariant,
        handleUpdateProductVariant,
        handleDeleteProductVariant
    } = useProduct()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    // Add-variant form state
    const [showAddForm, setShowAddForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [attributes, setAttributes] = useState([{ key: "", value: "" }])
    const [variantForm, setVariantForm] = useState({
        priceAmount: "",
        priceCurrency: "INR",
        stock: ""
    })
    const [variantImages, setVariantImages] = useState([])
    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState(null)

    // Stock editing state
    const [stockDrafts, setStockDrafts] = useState({})
    const [updatingStockId, setUpdatingStockId] = useState(null)

    const fileInputRef = useRef(null)

    useEffect(() => {
        let cancelled = false
        handleGetSellerProdcutDetais(productId)
            .then(data => {
                if (cancelled) return
                setProduct(data)
                setStockDrafts(buildStockDrafts(data))
            })
            .catch(err => {
                if (cancelled) return
                setMessage({ type: "error", text: err.response?.data?.message || "Failed to load product." })
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => { cancelled = true }
    }, [productId])

    // ── Variant form handlers ──
    const handleVariantChange = (e) => {
        const { id, value } = e.target
        setVariantForm(prev => ({ ...prev, [id]: value }))
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: "" }))
        setMessage(null)
    }

    const handleAttributeChange = (index, field, value) => {
        setAttributes(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a))
    }

    const handleAddAttribute = () => {
        setAttributes(prev => [...prev, { key: "", value: "" }])
    }

    const handleRemoveAttribute = (index) => {
        setAttributes(prev => prev.length === 1 ? [{ key: "", value: "" }] : prev.filter((_, i) => i !== index))
    }

    // ── Variant image handlers ──
    const processFiles = (fileList) => {
        setMessage(null)
        Array.from(fileList).forEach(file => {
            if (!file.type.startsWith('image/')) return
            setVariantImages(prev => [
                ...prev,
                { id: Math.random().toString(36).substring(2, 9) + Date.now(), file, previewUrl: URL.createObjectURL(file) }
            ])
        })
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) processFiles(e.target.files)
    }

    const handleRemoveVariantImage = (id, previewUrl) => {
        URL.revokeObjectURL(previewUrl)
        setVariantImages(prev => prev.filter(img => img.id !== id))
    }

    const resetVariantForm = () => {
        variantImages.forEach(img => URL.revokeObjectURL(img.previewUrl))
        setVariantImages([])
        setAttributes([{ key: "", value: "" }])
        setVariantForm({ priceAmount: "", priceCurrency: "INR", stock: "" })
        setErrors({})
    }

    // ── Add variant submit ──
    const validateVariant = () => {
        const newErrors = {}
        const validAttrs = attributes.filter(a => (a.key && a.key.trim()) || (a.value && a.value.trim()))
        const attrErrors = validAttrs.filter(a => !(a.key.trim() && a.value.trim())).length
        if (attrErrors > 0) newErrors.attributes = "Both attribute name and value are required."
        if (!variantForm.priceAmount || Number(variantForm.priceAmount) < 0) newErrors.priceAmount = "A valid price is required."
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAddVariant = async (e) => {
        e.preventDefault()
        if (!validateVariant()) return

        setIsSubmitting(true)
        setMessage(null)

        try {
            const payload = new FormData()
            payload.append('priceAmount', variantForm.priceAmount)
            payload.append('priceCurrency', variantForm.priceCurrency)
            payload.append('stock', variantForm.stock || 0)

            const attrObject = {}
            attributes.forEach(a => {
                if (a.key && a.key.trim() && a.value && a.value.trim()) {
                    attrObject[a.key.trim()] = a.value.trim()
                }
            })
            payload.append('attributes', JSON.stringify(attrObject))

            variantImages.forEach(img => payload.append('images', img.file))

            const updated = await handleAddProductVariant(productId, payload)
            setProduct(updated)
            setStockDrafts(buildStockDrafts(updated))
            resetVariantForm()
            setShowAddForm(false)
            setMessage({ type: "success", text: "Variant added successfully." })
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to add variant. Please try again." })
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── Stock update handlers ──
    const handleStockDraftChange = (variantId, value) => {
        setStockDrafts(prev => ({ ...prev, [variantId]: value }))
    }

    const handleSaveStock = async (variantId) => {
        setUpdatingStockId(variantId)
        setMessage(null)
        try {
            const updated = await handleUpdateProductVariant(productId, variantId, stockDrafts[variantId])
            setProduct(updated)
            setStockDrafts(buildStockDrafts(updated))
            setMessage({ type: "success", text: "Stock updated successfully." })
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update stock." })
        } finally {
            setUpdatingStockId(null)
        }
    }

    // ── Delete variant ──
    const handleDeleteVariant = async (variantId) => {
        if (!window.confirm("Delete this variant permanently?")) return
        setMessage(null)
        try {
            const updated = await handleDeleteProductVariant(productId, variantId)
            setProduct(updated)
            setStockDrafts(buildStockDrafts(updated))
            setMessage({ type: "success", text: "Variant deleted successfully." })
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete variant." })
        }
    }

    const variants = product?.variants || []
    const mainImage = product?.images?.[0]

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
                    <Link to="/" className="text-xl font-extrabold text-indigo-600 tracking-tight">ABYSS</Link>
                    <Link
                        to="/seller/product/dashboard"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-10">
                {/* ── Messages ── */}
                {message && (
                    <div className={`p-4 mb-6 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn ${message.type === "success"
                            ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                            : "text-red-700 bg-red-50 border border-red-100"}`}>
                        {message.type === "success" ? (
                            <svg className="w-5 h-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        <span className="font-semibold">{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto text-slate-400 hover:text-slate-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {loading ? <DetailsSkeleton /> : !product ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="p-5 bg-indigo-50 rounded-2xl text-indigo-300 mb-5">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">Product not found</h2>
                        <p className="text-sm font-medium text-slate-400 max-w-xs mb-6">
                            The product you're looking for doesn't exist or may have been removed.
                        </p>
                        <button
                            onClick={() => navigate('/seller/product/dashboard')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* ── Product Header ── */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="w-full sm:w-44 flex-shrink-0">
                                    {mainImage ? (
                                        <img src={mainImage.url} alt={product.title} className="w-full aspect-square object-cover rounded-2xl border border-slate-100" />
                                    ) : (
                                        <NoImagePlaceholder />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">Product</p>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                                        {product.title}
                                    </h1>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                        {product.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">
                                            {formatPrice(product.price?.amount, product.price?.currency)}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            {product.price?.currency}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Variants Section ── */}
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Variants</h2>
                                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                                        Add product variants, manage attributes, pricing and per-variant stock.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowAddForm(prev => !prev)
                                        setMessage(null)
                                    }}
                                    className={`self-start inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer ${showAddForm
                                            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        {showAddForm
                                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />}
                                    </svg>
                                    {showAddForm ? "Cancel" : "Add Variant"}
                                </button>
                            </div>

                            {/* ── Add Variant Form ── */}
                            {showAddForm && (
                                <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6 shadow-sm">
                                    <form onSubmit={handleAddVariant} className="space-y-6">
                                        {/* Attributes */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-bold text-slate-800">Attributes</h3>
                                                <button
                                                    type="button"
                                                    onClick={handleAddAttribute}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                    Add Attribute
                                                </button>
                                            </div>
                                            <div className="space-y-2.5">
                                                {attributes.map((attr, index) => (
                                                    <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2.5">
                                                        <input
                                                            type="text"
                                                            value={attr.key}
                                                            onChange={e => handleAttributeChange(index, 'key', e.target.value)}
                                                            placeholder="e.g. Size"
                                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={attr.value}
                                                            onChange={e => handleAttributeChange(index, 'value', e.target.value)}
                                                            placeholder="e.g. Large"
                                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAttribute(index)}
                                                            className="inline-flex items-center justify-center p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                            title="Remove attribute"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.attributes && <p className="text-[11px] text-red-500 font-medium">{errors.attributes}</p>}
                                        </div>

                                        {/* Price & Stock */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="priceAmount">
                                                    Price
                                                </label>
                                                <input
                                                    type="number"
                                                    id="priceAmount"
                                                    min="0"
                                                    step="0.01"
                                                    value={variantForm.priceAmount}
                                                    onChange={handleVariantChange}
                                                    placeholder="0.00"
                                                    disabled={isSubmitting}
                                                    className={`w-full px-4 py-2.5 border rounded-xl outline-none text-sm text-slate-800 transition-all ${errors.priceAmount
                                                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                                            : "border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"}`}
                                                />
                                                {errors.priceAmount && <p className="text-[11px] text-red-500 font-medium">{errors.priceAmount}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="priceCurrency">
                                                    Currency
                                                </label>
                                                <select
                                                    id="priceCurrency"
                                                    value={variantForm.priceCurrency}
                                                    onChange={handleVariantChange}
                                                    disabled={isSubmitting}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none bg-white text-sm text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all cursor-pointer"
                                                >
                                                    {currencies.map(curr => <option key={curr.value} value={curr.value}>{curr.label}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="stock">
                                                    Stock
                                                </label>
                                                <input
                                                    type="number"
                                                    id="stock"
                                                    min="0"
                                                    step="1"
                                                    value={variantForm.stock}
                                                    onChange={handleVariantChange}
                                                    placeholder="0"
                                                    disabled={isSubmitting}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Images */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-bold text-slate-800">Images</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {variantImages.map(img => (
                                                    <div key={img.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50">
                                                        <img src={img.previewUrl} alt="Variant preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveVariantImage(img.id, img.previewUrl)}
                                                            className="absolute top-1 right-1 bg-white/95 text-slate-500 hover:text-red-600 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                            title="Remove image"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                                {variantImages.length < 7 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-white hover:border-indigo-500 hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 gap-1 cursor-pointer"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">Add Image</span>
                                                    </button>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <p className="text-[11px] font-medium text-slate-400">Optional. PNG, JPG, WEBP.</p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => { setShowAddForm(false); resetVariantForm() }}
                                                className="px-5 py-2.5 border border-slate-200 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Adding...
                                                    </>
                                                ) : "Add Variant"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ── Variant List ── */}
                            {variants.length === 0 ? (
                                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                                    <div className="mx-auto w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 mb-4">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-700 mb-1">No variants yet</h3>
                                    <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto mb-5">
                                        Add variants like Size, Color or Material to let customers choose from different options with their own price and stock.
                                    </p>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Add Your First Variant
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {variants.map(variant => {
                                        const vmImages = variant.images || []
                                        const stockDraft = stockDrafts[variant._id]
                                        return (
                                            <div key={variant._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                                {/* Images */}
                                                <div className="flex gap-2 mb-4 overflow-x-auto">
                                                    {vmImages.length === 0 ? (
                                                        <div className="w-16 h-16 flex-shrink-0"><NoImagePlaceholder compact /></div>
                                                    ) : (
                                                        vmImages.map((img, i) => (
                                                            <img key={img._id || i} src={img.url} alt={`Variant ${i + 1}`} className="w-16 h-16 flex-shrink-0 object-cover rounded-xl border border-slate-100" />
                                                        ))
                                                    )}
                                                </div>

                                                {/* Attributes */}
                                                <div className="mb-3">
                                                    <AttributeChips attributes={variant.attributes} />
                                                </div>

                                                {/* Price & Stock snapshot */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-lg font-extrabold text-indigo-600 tracking-tight">
                                                        {formatPrice(variant.price?.amount, variant.price?.currency)}
                                                    </span>
                                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${variant.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                                        {variant.stock > 0 ? `In Stock` : "Out of Stock"}
                                                    </span>
                                                </div>

                                                {/* Stock management */}
                                                <div className="mt-auto pt-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex-1">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Manage Stock</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1"
                                                                value={stockDraft ?? variant.stock}
                                                                onChange={e => handleStockDraftChange(variant._id, e.target.value)}
                                                                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none text-sm text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all tabular-nums"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => handleSaveStock(variant._id)}
                                                            disabled={updatingStockId === variant._id}
                                                            className="self-end inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                        >
                                                            {updatingStockId === variant._id ? (
                                                                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                </svg>
                                                            )}
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteVariant(variant._id)}
                                                            className="self-end p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                            title="Delete variant"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SellerProdcutDetails