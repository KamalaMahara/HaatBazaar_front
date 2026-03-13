import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Status } from '../../globals/types/types';
import { loginUser, resetStatus } from '../../store/authSlice';

const Login: React.FC = () => {

  const Navigate = useNavigate()
  const { status } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (status == Status.SUCCESS) {
      dispatch(resetStatus())
      Navigate("/")
    }
    else if (status == Status.ERROR) {
      alert("something went wrong")
    }
  }, [status, Navigate, dispatch])





  const [showPassword, setShowPassword] = useState(false);

  // 1. Form State
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 2. Validation Logic
  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      // Simulate API Call
      dispatch(loginUser(formData))
      console.log('Form Submitted successfully:', formData);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100">

        {/* Left Side (Visuals) */}
        <div className="hidden md:flex md:w-5/12 bg-[#111827] relative overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/35/f9/c4/35f9c43e08c7910869550c5936df9ad5.jpg"
            alt="Shopping Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-7/12 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-[#111827] text-5xl font-black mb-3">Welcome Back</h1>
            <p className="text-gray-600 font-medium text-lg">Good to see you again! Please enter your details.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-bold text-[#111827] mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#F59E0B]'}`}>
                  <Mail size={20} />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border-2 rounded-2xl outline-none transition-all duration-300 text-[#111827] font-medium placeholder:text-gray-300 shadow-sm
                    ${errors.email ? 'border-red-500 focus:bg-red-50' : 'border-transparent focus:bg-white focus:border-[#F59E0B]'}`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 ml-1 text-red-500 text-xs font-bold flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-sm font-bold text-[#111827] mb-2 ml-1">Password</label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#F59E0B]'}`}>
                  <Lock size={20} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 bg-[#F9FAFB] border-2 rounded-2xl outline-none transition-all duration-300 text-[#111827] font-medium placeholder:text-gray-300 shadow-sm
                    ${errors.password ? 'border-red-500 focus:bg-red-50' : 'border-transparent focus:bg-white focus:border-[#F59E0B]'}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#111827]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 ml-1 text-red-500 text-xs font-bold flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end pr-1">
              <button type="button" className="text-sm font-bold text-[#F59E0B] hover:text-[#d97706] transition-all hover:underline decoration-2 underline-offset-4" onClick={() => Navigate("/reset-password")}>
                Forgot password?
              </button>
            </div>

            <button
              disabled={isLoading}
              className="group w-full bg-[#111827] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 shadow-[0_10px_30px_rgba(17,24,39,0.2)] active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Log In'}
              {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium">Or continue with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <p className="text-center text-gray-500 font-medium">
              New here?
              <a href="/register" className="ml-2 text-[#111827] font-black hover:underline decoration-[#F59E0B] decoration-4">Create an account</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;