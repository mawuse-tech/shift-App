import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Modal from "../sharedComponents/Modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllShifts } from "../redux-store/features/allShifts/allShiftsThunk";
import api from "../config/axios";
import { removeShiftLocally } from "../redux-store/features/allShifts/allShiftsSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AllShifts = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { shifts, loading, error } = useSelector((store) => store.allShiftsData);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // Fetch all shifts on mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await dispatch(fetchAllShifts()).unwrap();
        //  console.log('----------',res)
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };
    fetchShifts();
  }, [dispatch]);

  //for instant removal of the shift in the modal
  useEffect(() => {
    if (selectedWorker) {
      const updatedWorker = shifts.find((w) => w.user_id === selectedWorker.user_id
      );
      if (updatedWorker) {
        setSelectedWorker(updatedWorker);
      }
    }
  }, [shifts]); //watches Redux shifts updates


  // Delete shift handler
  const handleDelete = async (shiftId) => {
    try {
      const res = await api.delete(`/shift/deleteShift/${shiftId}`);
      dispatch(removeShiftLocally(shiftId));
      toast.success(res.data.message || "Shift deleted successfully!");

      //Immediately refresh all shifts
      dispatch(fetchAllShifts())

    } catch (error) {
      console.error("Error deleting shift:", error);
      toast.error(error?.response?.data?.message || "Failed to delete shift.");
    } finally {
      setConfirmDelete(null);
      setOpenMenu(null);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  return (
    <div className="lg:p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        All Assigned Shifts
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl lg:p-4">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#e71919] to-[#2e0101] text-white">
              <th className="text-left p-3 rounded-tl-2xl">#</th>
              <th className="text-left p-3">Worker's Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Number</th>
              <th className="text-left p-3 rounded-tr-2xl">Shift Details</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(shifts) && shifts.length > 0 ? (
              shifts.map((worker, index) => (
                <tr
                  key={worker.user_id}
                  className="border-b hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="p-3 font-semibold text-gray-700">
                    {index + 1}
                  </td>
                  <td className="p-3 text-gray-600">
                    {capitalize(worker.firstName)} {capitalize(worker.lastName)}
                  </td>
                  <td className="p-3 text-gray-600">{worker.email}</td>

                  <td className="p-3 text-gray-600">{worker.phoneNumber}</td>

                  <td className="p-3">
                    <button
                      onClick={() => setSelectedWorker(worker)}
                      className="flex items-center gap-2 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition"
                    >
                      <FiEye /> View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No shifts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Shift Modal */}
      {selectedWorker && (
        <Modal
          title={`${capitalize(selectedWorker.firstName)} ${capitalize(
            selectedWorker.lastName
          )}'s Shifts`}
          onClose={() => setSelectedWorker(null)}
        >
          {selectedWorker.shifts && selectedWorker.shifts.length > 0 ? (
            (() => {
              // Sort shifts by date (most recent first)
              const sortedShifts = [...selectedWorker.shifts].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              );

              // Take only the 7 most recent
              const recentShifts = sortedShifts.slice(0, 7);

              return (
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2">Day</th>
                      <th className="py-2">Shift Type</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentShifts.map((shift) => (
                      <tr key={shift.shift_id} className="border-b text-gray-700">
                        <td className="py-2">{shift.day}</td>
                        <td className="py-2">{shift.shift_type}</td>
                        <td className="py-2">{shift.date}</td>
                        <td className="py-2 flex gap-4">
                          <button
                            onClick={() =>
                              navigate(`/adminDash/edit/${shift.shift_id}`, {
                                state: { shift },
                              })
                            }
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <FiEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(shift.shift_id)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()
          ) : (
            <p className="text-gray-500">No shifts assigned yet.</p>
          )}
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <Modal
          title="Confirm Deletion"
          onClose={() => setConfirmDelete(null)}
          onConfirm={() =>
            handleDelete(
              confirmDelete.shifts && confirmDelete.shifts.length > 0
                ? confirmDelete.shifts[0].shift_id
                : null
            )
          }
          showConfirm
          confirmText="Delete"
        >
          <p>
            Are you sure you want to delete{" "}
            <strong>
              {capitalize(confirmDelete.firstName)}{" "}
              {capitalize(confirmDelete.lastName)}
            </strong>
            ’s shift?
          </p>
        </Modal>
      )}
    </div>
  );
};

export default AllShifts;
