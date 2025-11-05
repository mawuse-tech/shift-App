import React, { useEffect, useState } from "react";
import api from "../config/axios";
import { useSelector } from "react-redux";
import { FiBell, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Example: getting logged-in user from redux
    const { user } = useSelector((store) => store.loggedInUserData);
    const user_id = user?.user_id

    useEffect(() => {
        if (!user_id) return;

        const fetchNotifications = async () => {
            try {
                const res = await api.get(`/notice/${user_id}`);
                // Sort by newest first (though backend already does it)
                const sorted = res.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setNotifications(sorted);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user_id]);

    const handleDelete = async (noticeId) => {
        try {
            const res = await api.delete(`/notice/deleteNotice/${noticeId}`);
            toast.success(res.data.message || "Notification deleted successfully!");

            // ✅ Instantly remove the deleted item from the local state
            setNotifications((prev) => prev.filter((n) => n.id !== noticeId));
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast.error(error?.response?.data?.message || "Failed to delete notification.");
        }
    };


    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiBell className="text-red-600" /> Notifications
                </h1>
            </div>

            {/* Loader */}
            {loading && (
                <p className="text-gray-500 text-center">Loading notifications...</p>
            )}

            {/* Empty State */}
            {!loading && notifications.length === 0 && (
                <div className="text-center py-12">
                    <FiBell className="mx-auto text-gray-400" size={48} />
                    <p className="text-gray-500 mt-4">No notifications yet.</p>
                </div>
            )}

            {/* Notification List */}
            <div className="space-y-4">
                {notifications.map((n, index) => (
                    <div
                        key={index}
                        className="relative flex items-start gap-3 p-4 rounded-lg shadow-sm border transition border-red-200 hover:shadow-md hover:bg-red-50"
                    >
                        {/* ❌ Delete Button */}
                        <button
                            onClick={() => handleDelete(n.id)} // 🔹 call delete function
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition"
                            title="Delete notification"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="flex-shrink-0">
                            {n.read ? (
                                <CheckCircle className="text-gray-400" size={20} />
                            ) : (
                                <FiBell className="text-red-600" size={20} />
                            )}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-gray-800 font-semibold text-sm sm:text-base">
                                {n.title}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default NotificationPage;
