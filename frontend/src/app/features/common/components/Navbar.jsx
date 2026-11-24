import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router"
import useCart from "../../cart/hook/useCart.js"

const Navbar = () => {
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const cartCount = Array.isArray(cartItems) ? cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0) : 0
    const { handleGetCart } = useCart()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        if (user) handleGetCart().catch(() => {})
    }, [user])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    <span className="w-7 h-7 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold">A</span>
                    <span className="font-serif italic">ABYSS</span>
                </Link>

                {/* Desktop Search + Nav */}
                <div className="hidden md:flex items-center gap-8 flex-1 max-w-2xl">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search clothing, jeans, dresses…"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all backdrop-blur-sm"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/cart"
                        className="relative inline-flex items-center justify-center w-9 h-9 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                        aria-label="Cart"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center text-[9px] font-bold text-white bg-indigo-600 rounded-full shadow-lg">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden text-slate-600 hover:text-indigo-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {user ? (
                        <Link
                            to="/seller/product/dashboard"
                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Sell
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2.5 rounded-xl hover:bg-slate-100"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
                            >
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile Menu Panel */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white border-l border-slate-100 shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
                        <span className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">A</span>
                        <span className="font-serif italic">ABYSS</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search products…"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>

                    <div className="space-y-3">
                        <Link to="/" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Home</Link>
                        <Link to="/cart" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between">
                            <span>My Cart ({cartCount})</span>
                            <span className="text-indigo-600 font-bold">{cartCount}</span>
                        </Link>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                        {user ? (
                            <>
                                <Link to="/seller/product/dashboard" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                                    <span>Seller Dashboard</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </Link>
                                <div className="px-3 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl bg-slate-50">{user.fullname}</div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Sign In</Link>
                                <Link to="/register" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 text-center transition-colors shadow-lg shadow-indigo-600/25">Join Now</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ABYSS Premium Retail</p>
                    <p className="text-xs text-slate-400 mt-0.5">© {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
