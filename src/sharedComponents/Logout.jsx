import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import api from '../config/axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import {loggedInUserData } from '../redux-store/features/loggedInUserData/loggedInUserThunkData'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    async function logoutUser() {
        try {
            const response = await api.post('/auth/logout')
            
            if (response.data.success) {
                toast.success(response.data.message)
                
                // Clear Redux state and reset user data
                dispatch(loggedInUserData(null))

                // Navigate to login or home page
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <div>
            <div className="p-2 mt-2 border-t border-gray-100">
                <button
                    onClick={logoutUser}
                    className="flex items-center gap-3 w-full text-left text-red-700 hover:text-white hover:bg-gradient-to-r hover:from-[#e71919] hover:to-[#2e0101] transition-all duration-300 px-4 py-3 rounded-md shadow-md"
                >
                    <FiLogOut className="text-lg" />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Logout
