import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllShifts } from "../redux-store/features/allShifts/allShiftsThunk";
import api from "../config/axios";
import toast from "react-hot-toast";

const EditShiftPage = () => {
    const { shift_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { shifts, loading, error } = useSelector(
        (store) => store.allShiftsData
    );

    const [shift, setShift] = useState({
        day: "",
        shift_type: "",
        date: "",
        user_id: "",
    });

    const [saving, setSaving] = useState(false);

    // Load current shift
    useEffect(() => {
        if (Array.isArray(shifts) && shifts.length > 0) {
            const allShifts = shifts.flatMap((worker) =>
                worker.shifts.map((s) => ({
                    ...s,
                    user_id: worker.user_id,
                }))
            );

            const currentShift = allShifts.find(
                (s) => s.shift_id === parseInt(shift_id)
            );

            if (currentShift) {
                setShift({
                    day: currentShift.day || "",
                    shift_type: currentShift.shift_type || "",
                    date: currentShift.date || "",
                    user_id: currentShift.user_id || "",
                });
            }
        }
    }, [shift_id, shifts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShift({ ...shift, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            await api.put(`/shift/editShift/${shift_id}`, shift);
            toast.success("Shift updated successfully!");
            dispatch(fetchAllShifts());
            navigate("/adminDash/allshifts");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to update shift.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 lg:p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">Edit Shift</h1>

            {error && (
                <p className="text-center text-red-600 font-semibold py-6">
                    Failed to load shift details. Please try again later.
                </p>
            )}

            {!loading && !error && (
                <>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">

                        {/* Inline select with explicit values */}
                        <select
                            name="day"
                            value={shift.day}
                            onChange={handleChange}
                            className="p-3 rounded border"
                        >
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>

                        <select
                            name="shift_type"
                            value={shift.shift_type}
                            onChange={handleChange}
                            className="p-3 rounded border"
                        >
                            <option value="">Select Shift</option>
                            <option value="Morning">Morning</option>
                            <option value="Mid">Mid</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Off">Off</option>
                        </select>

                        <input
                            type="date"
                            name="date"
                            value={shift.date}
                            onChange={handleChange}
                            className="p-3 rounded border"
                        />
                    </div>

                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className={`w-full py-2 rounded text-white ${saving
                                ? "bg-red-800 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#e71919] to-[#2e0101] hover:opacity-90"
                            }`}
                    >
                        {saving ? "Updating..." : "Update Shift"}
                    </button>
                </>
            )}
        </div>
    );
};

export default EditShiftPage;
