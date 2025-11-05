import React, { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux-store/features/login/loginThunk";
import { loggedInUserData } from "../redux-store/features/loggedInUserData/loggedInUserThunkData";

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { error, loading } = useSelector((store) => store.loggedInUsers)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await dispatch(loginUser({ email, password })).unwrap();
            // console.log('====', response)
            if (response.role === "admin") {
                toast.success(response.message)
                navigate("/adminDash");
            } else {
                toast.success(response.message)
                navigate("/workersDash");
            }
            dispatch(loggedInUserData())
        } catch (error) {
            toast.error(error || "Login failed, please try again"); // error comes from rejectWithValue
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e71919] to-[#2e0101] relative overflow-hidden lg:gap-0 md:gap-0 gap-28">
            {/* Background circles */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-[#e71919] opacity-30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#310316] opacity-30 rounded-full blur-3xl"></div>

            {/* Header */}
            <div className="text-center text-white mb-5 z-10 mt-4">
                <h2 className="text-3xl font-semibold">Welcome Back</h2>
                <p className="text-2xl">Sign In!</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-t-[2.5rem] md:rounded-[.9rem] overflow-hidden mx-1 shadow-lg">
                <div className="p-4 md:p-8">
                    <form onSubmit={handleLogin} className="flex flex-col space-y-6">

                        {/* ✅ Error message display */}
                        {error && (
                            <div className="text-red-600 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-1 gap-6">
                                   <div>
                                     <label className="text-gray-700 text-sm font-medium">Email</label>
                                     <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                                       <FiUser className="text-gray-500 mr-2" />
                                       <input
                                         type="text"
                                         placeholder="Enter your first name"
                                         className="w-full outline-none text-gray-700 text-sm bg-transparent"
                                         value={email}
                                         onChange={(e) => setEmail(e.target.value)}
                                       />
                                     </div>
                                   </div>
                       
                                   <div>
                                     <label className="text-gray-700 text-sm font-medium">Password</label>
                                     <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                                       <FiUser className="text-gray-500 mr-2" />
                                       <input
                                         type="password"
                                         placeholder="Enter your last name"
                                         className="w-full outline-none text-gray-700 text-sm bg-transparent"
                                         value={password}
                                         onChange={(e) => setPassword(e.target.value)}
                                       />
                                     </div>
                                   </div>
                                 </div>

                        {/* ✅ Loading spinner on button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-2 py-3 text-white font-semibold rounded bg-gradient-to-r from-[#e71919] to-[#2e0101] transition-all 
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
              `}
                        >
                            {loading ? "Signing in..." : "SIGN IN"}
                        </button>

                        {/* Footer */}
                        <div className="text-right flex gap-10">
                            <p className="text-center text-gray-600 text-sm">
                                Don’t have an account?{" "}
                                <a
                                    href="signup"
                                    className="text-[#e71919] font-semibold hover:underline"
                                >
                                    Sign Up
                                </a>
                            </p>

                            <a
                                href="/forgot-password"
                                className="text-[#e71919] text-sm font-semibold hover:underline"
                            >
                                Forgot Password?
                            </a>
                        </div>

                        {/* OR divider */}
                        <div className="flex items-center my-1">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-3 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Google login */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 border border-gray-400 rounded py-3 text-gray-700 font-medium hover:bg-gray-100 transition-all"
                        >
                            <FcGoogle size={22} />
                            Sign in with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
