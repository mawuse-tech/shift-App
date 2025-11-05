import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiMenu, FiX, FiUsers, FiClock, FiList, FiSettings, FiLogOut } from "react-icons/fi";
import { RiFileHistoryLine } from "react-icons/ri";
import Logout from "../sharedComponents/Logout";
import { useSelector } from "react-redux";

const WorkersDashboardLayout = () => {
    const capitalize = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    const { user } = useSelector((store) => store.loggedInUserData)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navLinks = [
        { name: "View my shift", path: "/workersDash", icon: <FiUsers /> },
        { name: "All Shifts", path: "/workersDash/colshifts", icon: <FiList /> },
        { name: "Notifications", path: "/workersDash/notice", icon: <RiFileHistoryLine /> },
        { name: "Settings", path: "/workersDash/setting", icon: <FiSettings /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#e71919] to-[#2e0101] flex justify-center items-center p-1">
            <div className="w-full max-w-7xl bg-white flex rounded-2xl overflow-hidden shadow-2xl relative">

                {/* Sidebar */}
                <aside
                    className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } md:translate-x-0 fixed md:static top-0 left-0 h-full 
          bg-white w-64 md:w-1/4 flex flex-col justify-between transition-transform duration-300 z-50 shadow-xl`}
                >
                    {/* Top Section: Admin Info + Nav */}
                    <div>
                        {/* Admin Info */}
                        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-[#e71919] to-[#580404] text-white shadow-md h-48 justify-center">
                            <img
                                src={`http://localhost:8000/${user.image}`}
                                alt={`${capitalize(user.firstName)} ${capitalize(user.lastName)}`}
                                className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-lg"
                            />
                            <h2 className="text-lg font-semibold mt-3"> {capitalize(user.firstName)} {capitalize(user.lastName)}</h2>
                            <p className="text-sm opacity-90">Staff Member</p>
                            <p className="text-sm opacity-90">{user.phoneNumber}</p>
                            <p className="text-xs opacity-75 mt-1 italic">{user.email}</p>
                        </div>


                        {/* Navigation Links */}
                        <nav className="flex flex-col mt-16 gap-4">
                            {navLinks.map((link, index) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    end={index === 0}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 text-left px-6 py-3 capitalize font-medium transition-all duration-200 ${isActive
                                            ? "bg-gradient-to-r from-[#e71919] to-[#2e0101] w-56 text-white shadow-md"
                                            : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                                        }`
                                    }
                                    onClick={() => setIsSidebarOpen(false)} // close on mobile
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    {link.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* Logout Button at Bottom */}
                    <div>
                        <Logout />
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-40 md:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}

                {/* Content Area */}
                <main className="flex-1 md:w-3/4 p-6 overflow-y-auto max-h-screen">
                    {/* Toggle Button for Mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-red-700 mb-4 text-3xl"
                    >
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>

                    {/* Dynamic Outlet Content */}
                    <div className="w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WorkersDashboardLayout;
