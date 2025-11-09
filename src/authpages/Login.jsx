import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux-store/features/login/loginThunk";
import { loggedInUserData } from "../redux-store/features/loggedInUserData/loggedInUserThunkData";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((store) => store.loggedInUsers);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();
      toast.success(response.message || "Logged in successfully!");
      dispatch(loggedInUserData());
      alert("Cookie check: " + document.cookie);

      if (response.role === "admin") navigate("/adminDash");
      else navigate("/workersDash");
    } catch (err) {
      toast.error(err || "Login failed, please try again");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e71919] to-[#2e0101] p-4">

      {/* Header */}
      <div className="text-center text-white mb-6">
        <h2 className="text-3xl font-semibold">Welcome Back</h2>
        <p className="text-2xl">Sign In!</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleLogin} className="flex flex-col space-y-5">

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center font-medium">{error}</div>
          )}

          {/* Email */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
              <FiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none text-gray-700 text-sm bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Password</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full outline-none text-gray-700 text-sm bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 text-white font-semibold rounded-lg bg-gradient-to-br from-[#e71919] to-[#2e0101] transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>

          {/* Forgot Password */}
          <div className="text-right mt-2">
            <a
              href="/forgot-password"
              className="text-[#e71919] text-sm font-semibold hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
