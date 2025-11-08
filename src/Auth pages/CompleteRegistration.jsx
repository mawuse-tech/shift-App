import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../config/axios";
import { FiPhone, FiLock, FiImage } from "react-icons/fi";

const CompleteRegistration = () => {
  const [params] = useSearchParams();
  const token = params.get("token"); // token from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Verification token is missing. Please check your email link.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match ❌");
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("token", token);
      data.append("password", formData.password);
      data.append("phoneNumber", formData.phoneNumber);
      if (image) data.append("image", image);

      const res = await api.post("/auth/complete-register", data);
      toast.success(res.data.message || "Account setup completed ✅");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e71919] to-[#2e0101] relative overflow-hidden">
      <div className="text-center text-white mb-8 z-10">
        <h2 className="text-3xl font-semibold">Hello, Welcome</h2>
        <p className="text-xl">Complete Your Registration</p>
      </div>

      <div className="max-w-2xl w-full p-10 bg-white shadow rounded-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Phone Number & Image */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Phone Number</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                <FiPhone className="text-gray-500 mr-2" />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Upload Image */}
            <div>
              <label className="text-gray-700 text-sm font-medium flex items-center">
                Upload Profile Picture <span className="text-xs text-gray-400 ml-1">(optional)</span>
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2">
                <FiImage className="text-gray-500 mr-2" />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-gray-600 text-sm bg-transparent"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Confirm Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded bg-gradient-to-r from-[#e71919] to-[#2e0101] transition-all
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {loading ? "Completing..." : "COMPLETE REGISTRATION"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;
