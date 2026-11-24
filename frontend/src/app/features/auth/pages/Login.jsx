import { useState } from "react"
import useAuth from "../hook/useAuth"
import { Link, useNavigate } from "react-router"

function Login() {
    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target
        setFormData(prev => ({ ...prev, [id]: type === "checkbox" ? checked : value }))
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: "" }))
        setErrorMessage("")
    }

    const validate = () => {
        const newErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) newErrors.email = "Email Address is required"
        else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address"
        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setIsSubmitting(true)
        setErrorMessage("")
        try {
            await handleLogin({ email: formData.email, password: formData.password })
            navigate("/")
        } catch (error) {
            setIsSubmitting(false)
            setErrorMessage(error.response?.data?.message || "Invalid email or password")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 flex items-center justify-center p-4 md:p-8 font-sans">
            <div className="w-full max-w-[460px] my-8 relative z-10">
                <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/20">
                    {/* Logo Header */}
                    <header className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-indigo-600 mb-2">
                            <span className="w-8 h-8 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold">A</span>
                            <span className="font-serif italic">ABYSS</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Welcome back</p>
                    </header>

                    {errorMessage && (
                        <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center gap-2.5 shadow-sm">
                            <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="font-medium">{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="email">Email Address</label>
                            <div className={`relative group ${errors.email ? "text-red-500" : ""}`}>
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className={`w-full pl-12 pr-4 py-4 bg-transparent border-b-2 border-slate-200 rounded-none outline-none focus:border-indigo-600 focus:ring-0 text-slate-900 text-sm placeholder-slate-400 transition-all ${
                                        errors.email ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.email && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="password">Password</label>
                                <a className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors" href="#/forgot-password">
                                    Forgot password?
                                </a>
                            </div>
                            <div className={`relative group ${errors.password ? "text-red-500" : ""}`}>
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25Z" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-4 bg-transparent border-b-2 border-slate-200 rounded-none outline-none focus:border-indigo-600 focus:ring-0 text-slate-900 text-sm placeholder-slate-400 transition-all ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.391 4.178 5.328 7.178 9.966 7.178 2.072 0 3.996-.454 5.717-1.268M19.167 15.68A10.459 10.459 0 0022.066 12c-1.391-4.178-5.328-7.178-9.966-7.178-1.579 0-3.086.304-4.475.856m0 0L3.98 8.223M9.88 9.88a3 3 0 104.24 4.24M10.89 10.89l2.22 2.22m7.5-3.36 1.83-1.83M4.22 19.78 22 2" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                        </svg>
                                    )}
                                </button>
                                {errors.password && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.password}</p>}
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center justify-between py-1">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input type="checkbox" id="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="sr-only peer" />
                                <div className="w-6 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ml-2.5 text-sm font-medium text-slate-600">Remember me</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-[2rem] transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm tracking-tight"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <footer className="mt-10 text-center">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{" "}
                            <Link className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline underline-offset-4 ml-1" to="/register">
                                Create an account
                            </Link>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default Login
