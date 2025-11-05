import { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaPhone, FaLock, } from "react-icons/fa";
import { FiImage, FiMail, FiPhone, FiUser, FiLock as FiLockOutline, FiLock } from "react-icons/fi";
import api from "../config/axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updatedUserData } from "../redux-store/features/loggedInUserData/loggedInUserDataSlice";

const SettingsPage = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { user } = useSelector((store) => store.loggedInUserData)
  // console.log('hello', user)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [image, setImage] = useState(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user?.firstName || '')
      setLastName(user?.lastName || '')
      setEmail(user?.email || '')
      setPhoneNumber(user?.phoneNumber || '')
      setImage(user?.image || null)
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const formData = new FormData()
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email)
    formData.append("phoneNumber", phoneNumber);
    formData.append("image", image);

    try {
      const response = await api.put('/worker/updateProfile', formData)
      console.log('.............', response.data)

      if (response.data) {
        // console.log(response.data)
        toast.success(response.data.message)

        dispatch(updatedUserData(response.data.user))
        return response.data
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
    }

  };

  const handleChangePassword = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (newPassword !== confirmPassword) {
    toast.error("New and confirm password must match");
    setLoading(false);
    return;
  }

  try {
    const response = await api.post("/auth/changePassword",{oldPassword, newPassword,});

    toast.success(response.data.message);
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-3">
        Settings
      </h2>

      {/* Update Form */}
      <div className="bg-white shadow-md rounded-xl p-8 lg:px-20">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
          Update Your Information
        </h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
          <div className="grid md:grid-cols-1 gap-6">
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-white shadow-md rounded-xl p-8 mt-10 lg:px-20">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
          Change Password
        </h3>

        <form onSubmit={handleChangePassword}
          className="space-y-6"
        >
          {/* Old Password */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Current Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full outline-none text-gray-700 text-sm bg-transparent"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value) }
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              New Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full outline-none text-gray-700 text-sm bg-transparent"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Confirm New Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-[#e71919] transition">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Re-enter new password"
                className="w-full outline-none text-gray-700 text-sm bg-transparent"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SettingsPage;
