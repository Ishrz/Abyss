import { useState } from "react"
import useAuth from "../hook/useAuth"
import { Link, useNavigate } from "react-router"

function Register() {
    const { handleRegister } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        role: "buyer"
    })

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

    const handleRoleChange = (selectedRole) => {
        setFormData(prev => ({ ...prev, role: selectedRole }))
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.fullname.trim()) {
            newErrors.fullname = "Full Name is required"
        } else if (formData.fullname.trim().length < 2) {
            newErrors.fullname = "Name must be at least 2 characters"
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) {
            newErrors.email = "Email Address is required"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }
        const phoneRegex = /^[0-9]{10}$/
        const cleanPhone = formData.phone.replace(/[\s-]/g, "")
        if (!formData.phone) {
            newErrors.phone = "Contact number is required"
        } else if (!phoneRegex.test(cleanPhone)) {
            newErrors.phone = "Please enter a valid 10-digit number"
        }
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setIsSubmitting(true)
        setErrorMessage("")
        try {
            await handleRegister({
                fullname: formData.fullname,
                contact: formData.phone,
                email: formData.email,
                password: formData.password,
                role: formData.role
            })
            navigate("/")
        } catch (err) {
            setIsSubmitting(false)
            setErrorMessage(err.response?.data?.message || "Failed to create account")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 flex items-center justify-center p-4 md:p-8 font-sans">
            <div className="w-full max-w-[520px] my-8 relative z-10">
                <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/20">
                    <header className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-indigo-600 mb-2">
                            <span className="w-8 h-8 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold">A</span>
                            <span className="font-serif italic">ABYSS</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Create your account</p>
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
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="fullname">Full Name</label>
                            <div className={`relative group ${errors.fullname ? "text-red-500" : ""}`}>
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.618Z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    id="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full pl-12 pr-4 py-4 bg-transparent border-b-2 border-slate-200 rounded-none outline-none focus:border-indigo-600 focus:ring-0 text-slate-900 text-sm placeholder-slate-400 transition-all ${
                                        errors.fullname ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.fullname && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.fullname}</p>}
                            </div>
                        </div>

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

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="phone">Contact Number</label>
                            <div className="flex gap-2.5 relative group">
                                <div className="min-w-[64px] flex items-center justify-center bg-slate-50 border-b-2 border-slate-200 rounded-none text-slate-600 text-sm font-semibold select-none">
                                    +91
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="98765 43210"
                                        className={`w-full pl-2 pr-4 py-4 bg-transparent border-b-2 border-slate-200 rounded-none outline-none focus:border-indigo-600 focus:ring-0 text-slate-900 text-sm placeholder-slate-400 transition-all ${
                                            errors.phone ? "border-red-500" : ""
                                        }`}
                                    />
                                    {errors.phone && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="password">Password</label>
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

                        {/* Role */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Join as</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange("buyer")}
                                    className={`p-4 border rounded-xl text-left transition-all outline-none focus:ring-2 focus:ring-indigo-600/30 cursor-pointer relative overflow-hidden group ${formData.role === "buyer"
                                        ? "border-indigo-600 bg-indigo-50/30 text-indigo-900"
                                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`transition-colors ${formData.role === "buyer" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0Zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Z" />
                                            </svg>
                                        </span>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                            formData.role === "buyer" ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                                        }`}>
                                            {formData.role === "buyer" && <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">Buyer</p>
                                    <p className="text-[10px] leading-tight text-slate-500 mt-0.5">Shop products & track orders</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange("seller")}
                                    className={`p-4 border rounded-xl text-left transition-all outline-none focus:ring-2 focus:ring-indigo-600/30 cursor-pointer relative overflow-hidden group ${formData.role === "seller"
                                        ? "border-indigo-600 bg-indigo-50/30 text-indigo-900"
                                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`transition-colors ${formData.role === "seller" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 003.75-.615 3.001 3.001 0 013.75.615m-7.5 0a2.999 2.999 0 015.865-1.154 3.001 3.001 0 015.865 1.154m0 0a3.001 3.001 0 003.75-.615 3.001 3.001 0 013.75.615m-7.5 0h7.5m-15 0h.008v.008H3.75V9.35Z" />
                                            </svg>
                                        </span>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                            formData.role === "seller" ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                                        }`}>
                                            {formData.role === "seller" && <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">Seller</p>
                                    <p className="text-[10px] leading-tight text-slate-500 mt-0.5">List products & manage shop</p>
                                </button>
                            </div>
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
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <footer className="mt-10 text-center">
                        <p className="text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline underline-offset-4 ml-1" to="/login">
                                Sign in
                            </Link>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default Register
