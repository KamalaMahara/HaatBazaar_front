import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Mail, KeyRound } from "lucide-react";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8000";

  const passwordStrength = () => {
    if (newPassword.length < 6) return "weak";
    if (newPassword.match(/[A-Z]/) && newPassword.match(/[0-9]/) && newPassword.length >= 8) return "strong";
    return "medium";
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await axios.post(`${API_BASE}/forgot-password`, { email });
      setMessage(res.data.message || "OTP code sent to your email!");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("OTP code is required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await axios.post(`${API_BASE}/verifyOtp`, { email, otp });
      setMessage(res.data.message || "OTP verified successfully!");
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please fill out all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await axios.post(`${API_BASE}/resetpassword`, {
        email,
        newPassword,
        confirmPassword,
      });
      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        
        {/* Back button */}
        <button
          onClick={() => step > 1 ? setStep((prev) => (prev - 1) as any) : navigate("/login")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#F59E0B] transition-colors mb-6 text-sm font-bold border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} />
          {step > 1 ? "Go Back" : "Back to Login"}
        </button>

        <h1 className="text-3xl font-black text-[#111827] mb-2 uppercase tracking-tight">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm mb-6 font-medium">
          {step === 1 && "Enter your email address to receive a validation OTP code."}
          {step === 2 && "Enter the OTP security code sent to your email inbox."}
          {step === 3 && "Define a secure new password for your account."}
        </p>

        {/* STEP 1: SEND OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-[#111827] font-medium focus:bg-white focus:border-[#F59E0B] shadow-sm text-sm"
                />
              </div>
            </div>
            <button
              disabled={loading || !email}
              className="w-full bg-[#111827] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 shadow-[0_10px_30px_rgba(17,24,39,0.15)] active:scale-[0.97] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? "Sending..." : "Send OTP Verification"}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2 ml-1">OTP Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <ShieldCheck size={20} />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-[#111827] font-bold tracking-widest text-center focus:bg-white focus:border-[#F59E0B] shadow-sm text-lg"
                />
              </div>
            </div>
            <button
              disabled={loading || otp.length < 4}
              className="w-full bg-[#111827] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 shadow-[0_10px_30px_rgba(17,24,39,0.15)] active:scale-[0.97] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? "Verifying..." : "Verify OTP Code"}
            </button>
          </form>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2 ml-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={20} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-[#F9FAFB] border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-[#111827] font-medium focus:bg-white focus:border-[#F59E0B] shadow-sm text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#111827] border-none bg-transparent cursor-pointer"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {newPassword && (
                <p
                  className={`text-xs mt-1.5 font-bold ${
                    strength === "strong"
                      ? "text-green-500"
                      : strength === "medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  Password strength: {strength}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2 ml-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={20} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-[#F9FAFB] border-2 border-transparent rounded-2xl outline-none transition-all duration-300 text-[#111827] font-medium focus:bg-white focus:border-[#F59E0B] shadow-sm text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#111827] border-none bg-transparent cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-red-500 text-xs font-bold mt-1.5">Passwords do not match</p>
              )}
            </div>

            <button
              disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
              className="w-full bg-[#111827] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 shadow-[0_10px_30px_rgba(17,24,39,0.15)] active:scale-[0.97] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? "Resetting Password..." : "Complete Password Reset"}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-150 text-red-500 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        {message && (
          <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-150 text-green-600 text-xs font-bold flex items-center gap-2">
            <span>✅</span>
            <span>{message}</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;