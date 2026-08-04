import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import useProduct from '../hook/useProduct';

function CreateProduct() {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form Field States
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR'
  });

  // Image Upload States
  // Array of { id: string, file: File, previewUrl: string }
  const [images, setImages] = useState([]);
  
  // UX / Feedback States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Currency Options
  const currencies = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' }
  ];

  // Handle standard input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
    setErrorMessage('');
  };

  // Helper to handle added files (validations & state addition)
  const processFiles = (fileList) => {
    setErrorMessage('');
    const newErrors = {};
    const validImages = [];
    const maxFilesAllowed = 7;
    const currentFilesCount = images.length;

    if (currentFilesCount + fileList.length > maxFilesAllowed) {
      setErrorMessage(`You can only upload up to ${maxFilesAllowed} images. Please reduce the number of selected files.`);
      return;
    }

    Array.from(fileList).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        newErrors.fileType = 'Only image files (PNG, JPG, etc.) are allowed.';
        return;
      }
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        newErrors.fileSize = 'Each image must be smaller than 10MB.';
        return;
      }

      validImages.push({
        id: Math.random().toString(36).substring(2, 9) + Date.now(),
        file,
        previewUrl: URL.createObjectURL(file)
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrorMessage(newErrors.fileType || newErrors.fileSize || 'Error uploading files');
      return;
    }

    setImages(prev => [...prev, ...validImages]);
  };

  // File picker handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Remove specific image
  const handleRemoveImage = (id, previewUrl) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrl);
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Product Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.priceAmount) {
      newErrors.priceAmount = 'Price is required';
    } else if (parseFloat(formData.priceAmount) < 0) {
      newErrors.priceAmount = 'Price must be a positive number';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
      setErrorMessage('At least one product image is required.');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description.trim());
      payload.append('priceAmount', formData.priceAmount);
      payload.append('priceCurrency', formData.priceCurrency);

      // Append files
      images.forEach(img => {
        payload.append('images', img.file);
      });

      const product=await handleCreateProduct(payload);
    //   console.log(product)
      setSuccessMessage('Product published successfully! Redirecting...');
      
      // Revoke all preview URLs
      images.forEach(img => URL.revokeObjectURL(img.previewUrl));
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/seller/product/dashboard');
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      const serverMsg = error.response?.data?.message || 'Failed to create product. Please try again.';
      setErrorMessage(serverMsg);
    }
  };

  const handleCancel = () => {
    // Revoke all preview URLs
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    navigate(-1);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:min-h-0 bg-slate-50 flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans overflow-y-auto lg:overflow-hidden">
      <main className="w-full max-w-3xl lg:max-w-5xl lg:h-full lg:max-h-[90vh] lg:flex lg:flex-col my-4 lg:my-0">
        
        {/* Navigation & Header */}
        <div className="mb-4 lg:mb-5 flex-shrink-0">
          <button 
            type="button"
            onClick={handleCancel}
            className="flex items-center text-slate-500 hover:text-indigo-600 font-semibold text-xs tracking-wide uppercase transition-colors mb-2 cursor-pointer group"
          >
            <svg className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Create Product</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Add a new item to your boutique's collection.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-xl shadow-slate-100/50 lg:flex lg:flex-col lg:overflow-hidden lg:flex-1">
          
          {/* Messages */}
          {errorMessage && (
            <div className="p-4 mb-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 animate-fadeIn flex-shrink-0">
              <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 mb-5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2.5 animate-fadeIn flex-shrink-0">
              <svg className="w-5 h-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-0 lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:flex-1 lg:overflow-hidden mb-5">
              
              {/* Left Column: Details & Pricing */}
              <div className="lg:col-span-7 space-y-6 lg:overflow-y-auto lg:pr-4 lg:max-h-[52vh]">
                
                {/* Product Details Section */}
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Product Details</h2>
                  
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="title">
                      Product Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Minimalist Wool Coat"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-slate-800 text-sm ${
                        errors.title 
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                          : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10'
                      }`}
                    />
                    {errors.title && <p className="text-[11px] text-red-500 font-medium">{errors.title}</p>}
                  </div>

                  {/* Description Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows="6"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide details about materials, fit, sizing, and details..."
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-slate-800 text-sm resize-none ${
                        errors.description 
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                          : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10'
                      }`}
                    />
                    {errors.description && <p className="text-[11px] text-red-500 font-medium">{errors.description}</p>}
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Pricing</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Price Amount */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="priceAmount">
                        Price
                      </label>
                      <input
                        type="number"
                        id="priceAmount"
                        min="0"
                        step="0.01"
                        value={formData.priceAmount}
                        onChange={handleChange}
                        placeholder="0.00"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-slate-800 text-sm ${
                          errors.priceAmount 
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                            : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10'
                        }`}
                      />
                      {errors.priceAmount && <p className="text-[11px] text-red-500 font-medium">{errors.priceAmount}</p>}
                    </div>

                    {/* Price Currency */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="priceCurrency">
                        Currency
                      </label>
                      <select
                        id="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 text-slate-800 text-sm cursor-pointer"
                      >
                        {currencies.map(curr => (
                          <option key={curr.value} value={curr.value}>{curr.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Media Upload */}
              <div className="lg:col-span-5 space-y-4 lg:overflow-y-auto lg:pl-2 lg:max-h-[52vh]">
                
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <h2 className="text-lg font-bold text-slate-800">Media</h2>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {images.length} / 7 Images
                  </span>
                </div>

                {/* Drag and Drop Zone */}
                {images.length < 7 && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-50/20'
                        : errors.images
                          ? 'border-red-300 hover:border-red-400 bg-red-50/5'
                          : 'border-slate-200 hover:border-indigo-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="p-3 bg-slate-100 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 rounded-full transition-colors mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </span>
                    <p className="text-sm font-semibold text-slate-700 mb-0.5">
                      Drag & drop images here or <span className="text-indigo-600 group-hover:underline">browse</span>
                    </p>
                    <p className="text-xs font-medium text-slate-400">PNG, JPG, WEBP up to 10MB</p>
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
                )}

                {/* Previews Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {images.map((img) => (
                      <div 
                        key={img.id} 
                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50 flex items-center justify-center"
                      >
                        <img 
                          src={img.previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id, img.previewUrl)}
                          disabled={isSubmitting}
                          className="absolute top-2 right-2 bg-white/95 text-slate-500 hover:text-red-600 p-1.5 rounded-full shadow-sm hover:shadow opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-0"
                          title="Remove image"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}

                    {/* Quick add thumbnail slot (only if fewer than 7 images) */}
                    {images.length > 0 && images.length < 7 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="aspect-square rounded-xl border border-dashed border-slate-200 bg-white hover:border-indigo-500 hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 gap-1 cursor-pointer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                      </button>
                    )}
                  </div>
                )}

              </div>

            </div>

            {/* Actions Form Footer */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 border border-slate-200 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-all text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish Product
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateProduct;