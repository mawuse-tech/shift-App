import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedWorker } from "../redux-store/features/shiftHistory/shiftHistorySlice";
import { fetchWorkerHistory } from "../redux-store/features/shiftHistory/shiftHistoryThunk";
import { fetchAllWorkers } from "../redux-store/features/allWorkers/fetchAllWorkersThunk";

const AdminHistoryPage = () => {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();

  const { workers } = useSelector((store) => store.allWorkers);
  const { selectedWorker, shifts, loading } = useSelector((store) => store.shiftHistory
  );

  // Fetch all workers on mount
  useEffect(() => {
    dispatch(fetchAllWorkers());
  }, [dispatch]);

  // Handle worker selection
  const handleSelectWorker = async (e) => {
    const workerId = e.target.value;
    dispatch(setSelectedWorker(workerId));

    if (workerId) {
      dispatch(fetchWorkerHistory(workerId));
    }
  };

  // Helper to group into 7-day chunks
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const sortByDay = (list) =>
    [...list].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

  const weeklyShifts = chunkArray(shifts, 7);
  const visibleWeeks = showAll ? weeklyShifts : weeklyShifts.slice(0, 1);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6 text-gray-800">
        Worker Shift History
      </h1>

      {/* Worker dropdown */}
      <div className="mb-6">
        <label className="mr-3 font-semibold">Select Worker:</label>
        <select
          value={selectedWorker || ""}
          onChange={handleSelectWorker}
          className="border p-2 rounded-md"
        >
          <option value="">-- Select a Worker --</option>
          {workers.map((w, index) => (
            <option key={index} value={w.user_id}>
              {w.firstName} {w.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-600">Loading shift history...</p>}

      {/* Display Shifts */}
      {!loading && shifts.length > 0 ? (
        <div>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border">Date</th>
                <th className="p-3 text-left border">Day</th>
                <th className="p-3 text-left border">Shift Type</th>
              </tr>
            </thead>
            <tbody>
              {visibleWeeks.map((week, weekIndex) => {
                const weekLabel = `Week ${
                  weeklyShifts.length - weekIndex
                }`;
                const startDate = new Date(
                  week[week.length - 1].date
                )
                  .toISOString()
                  .split("T")[0];
                const endDate = new Date(week[0].date)
                  .toISOString()
                  .split("T")[0];

                return (
                  <React.Fragment key={weekIndex}>
                    <tr className="bg-gradient-to-r from-[#e71919] to-[#2e0101] text-white font-semibold">
                      <td colSpan="3" className="p-3">
                        {weekLabel} — {startDate} → {endDate}
                      </td>
                    </tr>

                    {sortByDay(week).map((shift, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 border">
                          {new Date(shift.date).toISOString().split("T")[0]}
                        </td>
                        <td className="p-3 border">{shift.day}</td>
                        <td className="p-3 border">{shift.shift_type}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {weeklyShifts.length > 1 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-red-600 hover:underline"
            >
              {showAll ? "Show Recent Only" : "View Older Shifts"}
            </button>
          )}
        </div>
      ) : (
        !loading &&
        selectedWorker && (
          <p className="text-gray-600">No shift history found for this worker.</p>
        )
      )}
    </div>
  );
};

export default AdminHistoryPage;
