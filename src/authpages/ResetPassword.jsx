import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/axios";
import { FiLock } from "react-icons/fi";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleResetPassword(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Input validations
        if (!password) {
            toast.error("Password cannot be empty");
            setError("Password cannot be empty");
            setLoading(false);
            return;
        }

        if (!confirmPassword) {
            toast.error("Confirm password cannot be empty");
            setError("Confirm password cannot be empty");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords must match");
            setError("Passwords must match");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post(`/auth/resetPassword/${token}`, { password });

            if (res.status === 200) {
                toast.success(res.data.message || "Password reset successful!");
                navigate("/");
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Something went wrong. Try again.";
            console.log(error);
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e71919] to-[#2e0101] relative overflow-hidden lg:gap-0 md:gap-0 gap-28">
            {/* Background circles */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-[#e71919] opacity-30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#310316] opacity-30 rounded-full blur-3xl"></div>

            {/* Header text */}
            <div className="text-center text-white mb-5 z-10 mt-4">
                <h2 className="text-3xl font-semibold">Reset your password</h2>
                <p className="text-2xl">Input your new password</p>
            </div>

            {/* White card */}
            <div className="w-full max-w-md bg-white rounded-t-[2.5rem] md:rounded-[.9rem] overflow-hidden mx-1">
                <div className="p-4 md:p-8">
                    <form onSubmit={handleResetPassword} className="flex flex-col space-y-6">
                        {/* ✅ Error display */}
                        {error && (
                            <div className="text-red-600 text-sm text-center font-medium mb-2">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-gray-700 text-sm font-semibold">
                                New Password
                            </label>
                            <div className="flex items-center border-b border-gray-400 py-2">
                                <FiLock className="text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    placeholder="*********"
                                    className="w-full outline-none text-gray-700 text-sm bg-transparent"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-gray-700 text-sm font-semibold">
                                Confirm Password
                            </label>
                            <div className="flex items-center border-b border-gray-400 py-2">
                                <FiLock className="text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    placeholder="********"
                                    className="w-full outline-none text-gray-700 text-sm bg-transparent"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* ✅ Button with loading effect */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-2 py-3 text-white font-semibold rounded bg-gradient-to-r from-[#e71919] to-[#2e0101] transition-all 
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
              `}
                        >
                            {loading ? "Setting password..." : "Click to set"}
                        </button>
                    </form>
                    <p className="text-center text-gray-600 text-sm mt-6">
            Token expired or invalid? Return{" "}
            <a
              href="/forgot-password"
              className="text-[#e71919] font-semibold hover:underline"
            >
              Forgot password
            </a>
          </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
