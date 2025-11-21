import React, { useEffect, useState } from "react";
import api from "../config/axios";

const MyShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchMyShifts = async () => {
      try {
        const res = await api.get("/shift/myShift");
        // Sort by date (newest first)
        const sorted = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setShifts(sorted);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    fetchMyShifts();
  }, []);

  // Helper: group array into chunks of size n (7 days = 1 week)
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  // Sort days inside each week (Mon → Sun)
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

  // Group shifts into weekly chunks
  const weeklyShifts = chunkArray(shifts, 7);

  // Only show the most recent week when showAll is false
  const visibleWeeks = showAll ? weeklyShifts : weeklyShifts.slice(0, 1);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        My Shift Schedule
      </h2>

      {shifts.length === 0 ? (
        <p className="text-gray-500">No shifts assigned yet.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Day</th>
              <th className="p-3 text-left">Shift Type</th>
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
                  {/* Colored header row for start of week */}
                  <tr className="bg-gradient-to-r from-[#e71919] to-[#2e0101] text-white font-semibold">
                    <td colSpan="3" className="p-3">
                      {weekLabel} — {startDate} → {endDate}
                    </td>
                  </tr>

                  {/* Normal shift rows */}
                  {sortByDay(week).map((shift, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(shift.date)
                          .toISOString()
                          .split("T")[0]}
                      </td>
                      <td className="p-3">{shift.day}</td>
                      <td className="p-3">{shift.shift_type}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Toggle button */}
      {weeklyShifts.length > 1 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-red-600 hover:underline"
        >
          {showAll ? "Show Recent Only" : "View Old Shifts"}
        </button>
      )}
    </div>
  );
};

export default MyShifts;
