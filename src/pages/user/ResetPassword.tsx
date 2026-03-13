import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ correct import
import { Eye, EyeOff } from "lucide-react";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = () => {
    const p = formData.newPassword;
    if (p.length < 6) return "weak";
    if (p.match(/[A-Z]/) && p.match(/[0-9]/) && p.length >= 8) return "strong";
    return "medium";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isValid =
    formData.email &&
    formData.newPassword.length >= 6 &&
    formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError("Please fix the errors first");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/resetpassword", // ✅ must match backend
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(res.data.message);
      setError("");
      setLoading(false);

      // ✅ redirect to login after success
      navigate("/login");
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] p-6">
      <div className="w-full max-w-md bg-[#F9FAFB] rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Reset Password</h1>
        <p className="text-gray-500 mb-6">
          Create a new secure password for your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative mt-1">
              <input
                type={showPass ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.newPassword && (
              <p
                className={`text-xs mt-1 ${strength === "strong"
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

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword &&
              formData.confirmPassword !== formData.newPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
          </div>

          {/* BUTTON */}
          <button
            disabled={!isValid || loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${isValid
              ? "bg-[#F59E0B] hover:bg-amber-600 text-white"
              : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {message && <p className="text-green-600 text-sm mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;