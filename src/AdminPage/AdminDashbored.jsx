import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllWorkers } from "../redux-store/features/allWorkers/fetchAllWorkersThunk";
import { removeWorkerLocally } from "../redux-store/features/allWorkers/fetchAllWorkersSlice";
import api from "../config/axios";
import toast from "react-hot-toast";
import Modal from "../sharedComponents/Modal";

const AdminDashboard = () => {
  const { workers, loading, error } = useSelector((store) => store.allWorkers);
  console.log('workers', workers)
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        await dispatch(fetchAllWorkers()).unwrap();
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, [dispatch]);

  const handleDeleteClick = (worker) => {
    setWorkerToDelete(worker);
    setShowModal(true);
  };

  const confirmDelete = async () => {

    if (!workerToDelete) return;

    try {
      const res = await api.delete(`worker/removeWorker/${workerToDelete}`);
      dispatch(removeWorkerLocally(workerToDelete));
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error removing worker:", error);
      toast.error(error?.response?.data?.message || "Failed to remove worker.");
    } finally {
      setShowModal(false);
      setWorkerToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setWorkerToDelete(null);
  };

  return (
    <div className="overflow-x-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-red-700">Welcome Back!</h1>

      {/* 🔄 Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ❌ Error Message */}
      {error && (
        <p className="text-center text-red-600 font-semibold py-6">
          Failed to load workers. Please try again later.
        </p>
      )}

      {/* ✅ When not loading and no error */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          {workers.length > 0 ? (
            <table className="min-w-full bg-white text-left text-sm md:text-base">
              <thead className="bg-gradient-to-r from-[#e71919] to-[#2e0101] text-white">
                <tr>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Number</th>
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-red-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg flex items-center justify-center bg-gray-200 text-gray-600 font-semibold text-lg">
                        {worker.image ? (
                          <img
                            src={`http://localhost:8000/${worker.image}`}
                            alt={`${capitalize(worker.firstName)} ${capitalize(worker.lastName)}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          // Show initials
                          <>
                            {`${worker.firstName?.[0]?.toUpperCase() || ""}${worker.lastName?.[0]?.toUpperCase() || ""}`}
                          </>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {capitalize(worker.firstName)} {capitalize(worker.lastName)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{worker.email}</td>
                    <td className="py-4 px-4 text-gray-600">{worker.phoneNumber}</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleDeleteClick(worker.user_id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Remove Employee
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // No workers message
            <p className="text-center text-gray-500 py-10 text-lg">
              No workers found.
            </p>
          )}
        </div>
      )}

      {/* Shared Modal */}
      {showModal && (
        <Modal
          title="Confirm Deletion"
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          showConfirm={true}
          confirmText="Delete"
        >
          <p>
            Are you sure you want to remove this worker{" "}
            <span className="font-semibold text-red-600">
              {capitalize(workerToDelete.firstName)} {capitalize(workerToDelete.lastName)}
            </span>
            ?
          </p>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
