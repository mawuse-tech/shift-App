import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../config/axios";
import { FiUser, FiMail, FiShield } from "react-icons/fi";

const InviteWorker = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "worker",
  });

  const [loading, setLoading] = useState(false); // <-- loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- start loading

    try {
      const res = await api.post("/auth/invite-worker", formData);
      toast.success(res.data.message || "Invitation sent successfully!");

      // Reset fields
      setFormData({ firstName: "", lastName: "", email: "", role: "worker" });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to send invitation ");
    } finally {
      setLoading(false); // <-- stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Invite a Worker</h2>

        <form onSubmit={handleInvite} className="space-y-5">

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 text-sm font-medium">First Name</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-gray-400 transition">
                <FiUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Last Name</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-gray-400 transition">
                <FiUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full outline-none text-gray-700 text-sm bg-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Email</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-gray-400 transition">
              <FiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none text-gray-700 text-sm bg-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Role</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-gray-400 transition">
              <FiShield className="text-gray-400 mr-2" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full outline-none text-gray-700 text-sm bg-transparent"
              >
                <option value="worker">Worker</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading} // disable while loading
            className={`w-full py-3 mt-2 text-white font-semibold rounded-lg bg-gradient-to-br from-[#e71919] to-[#2e0101] transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
          >
            {loading ? "Sending..." : "Send Invitation"} {/* show loading text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteWorker;
