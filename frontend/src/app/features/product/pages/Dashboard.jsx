import { useEffect, useState } from "react"
import useProduct from "../hook/useProduct"
import { useSelector } from "react-redux"
import { Link } from "react-router"

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="bg-slate-100 aspect-[4/3]" />
    <div className="p-4 space-y-2.5">
      <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
      <div className="h-3 bg-slate-100 rounded-lg w-full" />
      <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
      <div className="pt-1 flex items-center justify-between">
        <div className="h-5 bg-slate-100 rounded-lg w-1/3" />
        <div className="h-8 bg-slate-100 rounded-xl w-20" />
      </div>
    </div>
  </div>
)

// ─── No-Image Placeholder ────────────────────────────────────────────────────
const NoImagePlaceholder = () => (
  <div className="bg-slate-50 aspect-[4/3] flex flex-col items-center justify-center text-slate-300 gap-2 border-b border-slate-100">
    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
    <span className="text-[11px] font-semibold uppercase tracking-wider">No Image</span>
  </div>
)

// ─── Stats Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
    <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-400 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
)

// ─── Product Card ────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false)
  const symbol = currencySymbols[product.price?.currency] || product.price?.currency || ""
  const hasImage = product.images?.length > 0 && !imgError
  const totalImages = product.images?.length || 0

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.015] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden">
        {hasImage ? (
          <>
            <img
              src={product.images[0].url}
              alt={product.title}
              onError={() => setImgError(true)}
              className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {totalImages > 1 && (
              <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                +{totalImages - 1} more
              </span>
            )}
          </>
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          <span className="text-base font-extrabold text-indigo-600 tracking-tight">
            {symbol}{Number(product.price?.amount).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.price?.currency}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="p-5 bg-indigo-50 rounded-2xl text-indigo-300 mb-5">
      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    </div>
    <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">No products yet</h2>
    <p className="text-sm font-medium text-slate-400 max-w-xs mb-6">
      Your boutique is empty. Start by adding your first product to showcase your collection.
    </p>
    <Link
      to="/seller/product/create"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Add Your First Product
    </Link>
  </div>
)

// ─── Dashboard ───────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct()
  const products = useSelector(state => state.product.sellerProducts)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    handleGetSellerProduct().finally(() => setIsLoading(false))
  }, [])

  // Derived stats
  const totalProducts = products.length
  const inrProducts = products.filter(p => p.price?.currency === "INR")
  const totalValue = inrProducts.reduce((acc, p) => acc + (Number(p.price?.amount) || 0), 0)
  const totalImages = products.reduce((acc, p) => acc + (p.images?.length || 0), 0)

  // Filtered products
  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Seller Portal</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">My Products</h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Manage and monitor your boutique's full inventory.
            </p>
          </div>
          <Link
            to="/seller/product/create"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
            label="Total Products"
            value={isLoading ? "—" : totalProducts}
            sub={totalProducts === 1 ? "1 item listed" : `${totalProducts} items listed`}
          />
          <StatCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="INR Inventory Value"
            value={isLoading ? "—" : `₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            sub="Across INR-priced products"
          />
          <StatCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            }
            label="Total Media"
            value={isLoading ? "—" : totalImages}
            sub="Images uploaded across products"
          />
        </div>

        {/* ── Search / Filter Bar ── */}
        {!isLoading && totalProducts > 0 && (
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products by title or description..."
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* ── Grid / States ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : totalProducts === 0 ? (
          <EmptyState />
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-slate-400 font-semibold text-sm">No products match your search.</p>
            <button onClick={() => setSearchQuery("")} className="mt-3 text-indigo-600 font-semibold text-xs hover:underline">
              Clear search
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Showing {filteredProducts.length} of {totalProducts} products
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Dashboard