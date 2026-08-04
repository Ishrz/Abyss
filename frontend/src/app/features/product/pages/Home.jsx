import { useSelector } from "react-redux"
import useProduct from "../hook/useProduct"
import { useEffect, useState } from "react"
import { Link } from "react-router"

// ─── Constants ───────────────────────────────────────────────────────────────
const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }

const CATEGORIES = ["All", "Clothing", "Electronics", "Footwear", "Accessories"]

// ─── Skeleton Card ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col">
        <div className="bg-slate-100 aspect-[3/4]" />
        <div className="p-4 space-y-2.5">
            <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
            <div className="h-3 bg-slate-100 rounded-lg w-full" />
            <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
            <div className="pt-2 flex items-center justify-between">
                <div className="h-5 bg-slate-100 rounded-lg w-1/3" />
                <div className="h-8 bg-slate-100 rounded-full w-20" />
            </div>
        </div>
    </div>
)

// ─── No-Image Placeholder ────────────────────────────────────────────────────
const NoImagePlaceholder = () => (
    <div className="bg-gradient-to-br from-slate-100 to-slate-50 aspect-[3/4] flex flex-col items-center justify-center text-slate-300 gap-2">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
    </div>
)

// ─── Product Card ────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
    const [imgError, setImgError] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const symbol = currencySymbols[product.price?.currency] || product.price?.currency || ""
    const hasImage = product.images?.length > 0 && !imgError

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.012] transition-all duration-300 group flex flex-col cursor-pointer">

            {/* Image wrapper */}
            <div className="relative overflow-hidden">
                {hasImage ? (
                    <img
                        src={product.images[0].url}
                        alt={product.title}
                        onError={() => setImgError(true)}
                        className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <NoImagePlaceholder />
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Wishlist button */}
                <button
                    onClick={(e) => { e.stopPropagation(); setIsWishlisted(v => !v) }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
                >
                    <svg
                        className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-red-500 stroke-red-500" : "fill-none stroke-slate-600"}`}
                        strokeWidth="2" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>

                {/* Image count badge */}
                {product.images?.length > 1 && (
                    <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                        </svg>
                        {product.images.length}
                    </span>
                )}
            </div>

            {/* Card body */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {product.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 flex-1">
                    {product.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <div>
                        <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                            {symbol}{Number(product.price?.amount).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                        <span className="ml-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {product.price?.currency}
                        </span>
                    </div>
                    <button className="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-full transition-colors active:scale-95">
                        Add to bag
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
const Hero = ({ productCount }) => (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 rounded-3xl px-8 py-14 md:py-20 md:px-16 mb-10 text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-lg">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300 mb-4 bg-white/10 px-3 py-1 rounded-full">
                New Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4">
                Discover<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">Premium Finds</span>
            </h1>
            <p className="text-indigo-200 text-sm md:text-base font-medium leading-relaxed mb-8 max-w-sm">
                Curated collections from independent sellers. Every item, crafted with intention.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-all shadow-xl active:scale-[0.98]"
                >
                    Start Shopping
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
                {productCount > 0 && (
                    <span className="text-indigo-300 text-sm font-semibold">
                        {productCount} products available
                    </span>
                )}
            </div>
        </div>
    </div>
)

// ─── Home Page ────────────────────────────────────────────────────────────────
const Home = () => {
    const { handleGetAllProducts } = useProduct()
    const products = useSelector(state => state.product.products)
    const user = useSelector( state => state.auth.user)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")
    const [sortBy, setSortBy] = useState("newest")

    useEffect(() => {
        handleGetAllProducts().finally(() => setIsLoading(false))
    }, [])

    // Filter + Sort
    const filtered = products
        .filter(p =>
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "price-asc") return (a.price?.amount || 0) - (b.price?.amount || 0)
            if (sortBy === "price-desc") return (b.price?.amount || 0) - (a.price?.amount || 0)
            return 0 // newest (default order from API)
        })

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
                    <Link to="/" className="text-xl font-extrabold text-indigo-600 tracking-tight">ABYSS</Link>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? 
                        <span 
                            className="text-lg font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 border-2 rounded-full hover:bg-slate-50">
                                {user.fullname}
                        </span>: 
                        <span>
                            <Link
                            to="/login"
                            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
                            >
                                Sign In
                            </Link>
                            <Link
                            to="/register"
                            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-xl transition-colors shadow-sm shadow-indigo-600/20"
                            >
                                Join Now
                            </Link>
                        </span>
                        }
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-10">

                {/* ── Hero ── */}
                <Hero productCount={products.length} />

                {/* ── Controls ── */}
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-6">
                    {/* Search */}
                    <div className="relative w-full md:max-w-sm">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-11 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-white placeholder:text-slate-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-white cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>

                {/* ── Category Pills ── */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${activeCategory === cat
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── Product Grid / States ── */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                        {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-5 bg-indigo-50 rounded-2xl text-indigo-300 mb-5">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">
                            {searchQuery ? "No results found" : "Nothing here yet"}
                        </h2>
                        <p className="text-sm font-medium text-slate-400 max-w-xs mb-4">
                            {searchQuery
                                ? `We couldn't find anything matching "${searchQuery}".`
                                : "Check back soon — new products are being added."}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-indigo-600 font-semibold text-sm hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                            {filtered.length} {filtered.length === 1 ? "product" : "products"}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                            {filtered.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                )}

            </div>

            {/* ── Footer ── */}
            <footer className="mt-20 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-lg font-extrabold text-indigo-600 tracking-tight">ABYSS</span>
                    <p className="text-xs font-medium text-slate-400">
                        © {new Date().getFullYear()} Abyss E-Commerce. All rights reserved.
                    </p>
                    {!user && 
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Sign In</Link>
                        <Link to="/register" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Register</Link>
                    </div>}
                </div>
            </footer>
        </div>
    )
}

export default Home