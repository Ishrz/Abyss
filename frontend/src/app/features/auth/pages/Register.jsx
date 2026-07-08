import React, { useState } from 'react';
import useAuth from '../hook/useAuth';
import { Link, useNavigate } from 'react-router';

function Register() {

    const {handleRegister} = useAuth()
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    role: 'buyer' // Default role selection
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear field-specific error as user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleRoleChange = (selectedRole) => {
    setFormData(prev => ({
      ...prev,
      role: selectedRole
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full Name is required';
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email Address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!formData.phone) {
      newErrors.phone = 'Contact number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate user creation API response time
    try{
        const data= await handleRegister({
        fullname:formData.fullname,
        contact:formData.phone,
        email:formData.email,
        password:formData.password,
        isSeller:formData.role
    })
    setIsSubmitting(false)
    navigate("/")
    }catch(err){

        setIsSubmitting(false)
        const serverMsg = error.response?.data?.message || 'Invalid email or password';
        console.log(serverMsg)
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <main className="w-full max-w-[520px] my-8">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-xl shadow-slate-100/50">
          
          {/* Logo / Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-2">ABYSS</h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Create Your Account</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="fullname">
                Full Name
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all ${
                errors.fullname 
                  ? 'border-red-500 bg-red-50/5' 
                  : 'border-slate-200 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/10'
              }`}>
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.618Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-0 rounded-xl outline-none focus:ring-0 text-slate-900 text-sm"
                />
              </div>
              {errors.fullname && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.fullname}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="email">
                Email Address
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all ${
                errors.email 
                  ? 'border-red-500 bg-red-50/5' 
                  : 'border-slate-200 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/10'
              }`}>
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-0 rounded-xl outline-none focus:ring-0 text-slate-900 text-sm"
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Contact Number (Locked to +91 country code) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="phone">
                Contact Number
              </label>
              <div className="flex gap-2">
                <div className="min-w-[70px] flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold select-none">
                  +91
                </div>
                <div className={`relative flex-1 flex items-center rounded-xl border transition-all ${
                  errors.phone 
                    ? 'border-red-500 bg-red-50/5' 
                    : 'border-slate-200 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/10'
                }`}>
                  <span className="absolute left-4 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.502-5.18-3.858-6.682-6.682l1.293-.97a2.25 2.25 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 bg-transparent border-0 rounded-xl outline-none focus:ring-0 text-slate-900 text-sm"
                  />
                </div>
              </div>
              {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="password">
                Password
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all ${
                errors.password 
                  ? 'border-red-500 bg-red-50/5' 
                  : 'border-slate-200 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/10'
              }`}>
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-transparent border-0 rounded-xl outline-none focus:ring-0 text-slate-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.391 4.178 5.328 7.178 9.966 7.178 2.072 0 3.996-.454 5.717-1.268M19.167 15.68A10.459 10.459 0 0 0 22.066 12c-1.391-4.178-5.328-7.178-9.966-7.178-1.579 0-3.086.304-4.475.856m0 0L3.98 8.223M9.88 9.88a3 3 0 1 0 4.24 4.24M10.89 10.89l2.22 2.22m7.5-3.36 1.83-1.83M4.22 19.78 22 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.password}</p>}
            </div>

            {/* Role Selection ("Join As") */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">
                Join as
              </label>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Buyer Option Card */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('buyer')}
                  className={`group p-4 border rounded-xl text-left transition-all relative outline-none focus:ring-2 focus:ring-indigo-600/30 cursor-pointer ${
                    formData.role === 'buyer'
                      ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex flex-col gap-3 h-full justify-between">
                    <div className="flex justify-between items-start">
                      <span className={`transition-colors ${formData.role === 'buyer' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        formData.role === 'buyer' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {formData.role === 'buyer' && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Buyer</p>
                      <p className="text-[11px] leading-tight text-slate-500 mt-1">Shop products & track orders</p>
                    </div>
                  </div>
                </button>

                {/* Seller Option Card */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('seller')}
                  className={`group p-4 border rounded-xl text-left transition-all relative outline-none focus:ring-2 focus:ring-indigo-600/30 cursor-pointer ${
                    formData.role === 'seller'
                      ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex flex-col gap-3 h-full justify-between">
                    <div className="flex justify-between items-start">
                      <span className={`transition-colors ${formData.role === 'seller' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615 3.001 3.001 0 0 0 3.75.615m-7.5 0a2.999 2.999 0 0 1 5.865-1.154 3.001 3.001 0 0 1 5.865 1.154m0 0a3.001 3.001 0 0 0 3.75-.615 3.001 3.001 0 0 0 3.75.615m-7.5 0h7.5m-15 0h.008v.008H3.75V9.35Z" />
                        </svg>
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        formData.role === 'seller' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {formData.role === 'seller' && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Seller</p>
                      <p className="text-[11px] leading-tight text-slate-500 mt-1">List products & manage shop</p>
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
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
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <footer className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link className="text-indigo-600 font-bold hover:underline ml-1" to="/login">
                Log in
              
              </Link>
            </p>
          </footer>
        </div>

        {/* Brand Copyright */}
        <p className="mt-8 text-center text-[10px] text-slate-400/50 uppercase tracking-widest font-semibold">
          ABYSS Premium Retail &copy; {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}

export default Register;