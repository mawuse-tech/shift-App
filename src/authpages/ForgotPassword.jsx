import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import api from "../config/axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleLogin(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post("/auth/forgotPassword", { email });
            console.log("===", response.data);

            toast.success("Check your email for password reset instructions");
            setEmail(""); // clear input
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong. Try again.";
            setError(message);
            toast.error(message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e71919] to-[#2e0101] relative overflow-hidden lg:gap-0 md:gap-0 gap-28">
            {/* Background circles for depth */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-[#e71919] opacity-30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#310316] opacity-30 rounded-full blur-3xl"></div>

            {/* Header text */}
            <div className="text-center text-white mb-5 z-10 mt-4">
                <h2 className="text-3xl font-semibold">Input your email</h2>
                <p className="text-2xl">To reset your password</p>
            </div>

            {/* White card */}
            <div className="w-full max-w-md bg-white rounded-t-[2.5rem] md:rounded-[.9rem] overflow-hidden mx-1">
                <div className="p-4 md:p-8">
                    <form onSubmit={handleLogin} className="flex flex-col space-y-6">
                        <div>
                            {/* ✅ Error message display */}
                            {error && (
                                <div className="text-red-600 text-sm text-center font-medium mb-2">
                                    {error}
                                </div>
                            )}

                            <label className="text-gray-700 text-sm font-semibold">
                                Email
                            </label>
                            <div className="flex items-center border-b border-gray-400 py-2">
                                <FiMail className="text-gray-500 mr-2" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full outline-none text-gray-700 text-sm bg-transparent"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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
                            {loading ? "Submiting..." : "SUBMIT"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default ForgotPassword;