import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router"
import useCart from "../../cart/hook/useCart.js"

const Navbar = () => {
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const cartCount = Array.isArray(cartItems) ? cartItems.length : 0
    const { handleGetCart } = useCart()

    useEffect(() => {
        if (user) {
            handleGetCart().catch(() => {})
        }
    }, [user])

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
                <Link to="/" className="text-xl font-extrabold text-indigo-600 tracking-tight">ABYSS</Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Cart icon with badge */}
                    <Link
                        to="/cart"
                        className="relative inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors"
                        aria-label="Cart"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center text-[10px] font-bold text-white bg-indigo-600 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <span className="text-sm font-semibold text-slate-600 px-3 py-1.5 border-2 rounded-full">
                            {user.fullname}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
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
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar