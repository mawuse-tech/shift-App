import React, { useState } from "react";
import { FiMail, FiLock, FiUser, FiImage, FiPhone } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux-store/features/register/registerThunk";
import toast from "react-hot-toast";
import { loggedInUserData } from "../redux-store/features/loggedInUserData/loggedInUserThunkData";

const SignUp = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((store) => store.registredUsers)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState(null)

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("firstName", firstName);
      data.append("lastName", lastName);
      data.append("email", email);
      data.append("phoneNumber", phoneNumber);
      data.append("password", password);

      if (image) {
        data.append("image", image);
      }

      const response = await dispatch(registerUser(data)).unwrap();

      // handle success response
      if (response.role === "admin") {
        toast.success(response.message);
        navigate("/adminDash");
      } else {
        toast.success(response.message);
        navigate("/workersDash");
      }

      // update logged-in user state
      dispatch(loggedInUserData());

    } catch (err) {
      console.error(err);
      toast.error(err || "Signup failed, please try again");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e71919] to-[#2e0101] relative overflow-hidden lg:gap-0 md:gap-0 gap-28">
      {/* Background circles for depth */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#e71919] opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#2e0101] opacity-30 rounded-full blur-3xl"></div>

      {/* Header text on background */}
      <div className="text-center text-white mb-5 z-10 mt-4">
        <h2 className="text-3xl font-semibold">Hello Welcome</h2>
        <p className="text-2xl">Sign Up!</p>
      </div>

      {/* White card */}
      <div className="w-full max-w-md bg-white rounded-t-[2.5rem] md:rounded-[.9rem] overflow-hidden mx-1">
        <div className="p-4 md:p-8">

          <form className="space-y-6" onSubmit={handleRegister}>
          {/* First & Last Name */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 text-sm font-medium">First Name</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                <FiUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">Last Name</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                <FiUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Email & Image */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 text-sm font-medium">Email</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium flex items-center">
                Upload Your Image <span className="text-xs text-gray-400 ml-1">(optional)</span>
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2">
                <FiImage className="text-gray-500 mr-2" />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-gray-600 text-sm bg-transparent"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0]
                    // console.log('-----', selectedFile)
                    setImage(selectedFile)
                  }}
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 text-sm font-medium">Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                <FiPhone className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="+233 55 123 4567"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium">Phone Number</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
                <FiPhone className="text-gray-500 mr-2" />
                <input
                  type="tel"
                  placeholder="+233 55 123 4567"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3 text-white font-semibold rounded bg-gradient-to-r from-[#e71919] to-[#2e0101] transition-all 
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
              `}
            >
              {loading ? "Signing Up..." : "SIGN UP"}
            </button>
          </div>
        </form>
          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/"
              className="text-[#e71919] font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
