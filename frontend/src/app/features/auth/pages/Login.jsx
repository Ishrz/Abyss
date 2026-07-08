import React, { useState } from 'react';
import useAuth from '../hook/useAuth';
import { Link, useNavigate } from 'react-router';

function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    // Clear field-specific error as user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
    setErrorMessage('');
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email Address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
    setErrorMessage('');
    try {
      await handleLogin({
        email: formData.email,
        password: formData.password
      });
      setIsSubmitting(false);
      navigate('/');
    } catch (error) {
      setIsSubmitting(false);
      const serverMsg = error.response?.data?.message || 'Invalid email or password';
      setErrorMessage(serverMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <main className="w-full max-w-[480px] my-8">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-xl shadow-slate-100/50">
          
          {/* Logo / Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-2">ABYSS</h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Sign In to Your Account</p>
          </header>

          {errorMessage && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500" htmlFor="password">
                  Password
                </label>
                <a className="text-xs font-medium text-indigo-600 hover:underline" href="#/forgot-password">
                  Forgot password?
                </a>
              </div>
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

            {/* Remember Me Switch */}
            <div className="flex items-center justify-between py-1">
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-slate-600">Remember me</span>
              </label>
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
                  <span>Logging In...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <footer className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link className="text-indigo-600 font-bold hover:underline ml-1" to="/register">
                Sign up
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

export default Login;
