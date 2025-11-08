import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignShift } from "../redux-store/features/assignShift/assignShiftThunk";
import toast from "react-hot-toast";
import { fetchAllWorkers } from "../redux-store/features/allWorkers/fetchAllWorkersThunk";
import { FiTrash } from "react-icons/fi";
import { generateShiftDates } from "../helpers/shiftWithDate";


const AssignShift = () => {
  const { loading, error } = useSelector((store) => store.assignShiftData);
  const { workers } = useSelector((store) => store.allWorkers);
  const dispatch = useDispatch();

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const [worker, setWorker] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [shift, setShift] = useState({
    day: "",
    shift_type: "",
    start_time: "",
    end_time: "",
  });
  const [shifts, setShifts] = useState([]);

  //  Fetch all workers on load
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

  // Add a new shift
 const handleAddShift = () => {
  if (!shift.day || !shift.shift_type) {
    toast.error("Please select both day and shift type", { duration: 6000 });
    return;
  }

  if (!worker) {
    toast.error("Please select a worker first", { duration: 6000 });
    return;
  }

  if (!weekStart) {
    toast.error("Please select a week start date first", { duration: 6000 });
    return;
  }

  //  Only check if the start day and start date match for the FIRST shift
  if (shifts.length === 0) {
    const chosenDate = new Date(weekStart);
    
    //Convert the selected start date into a day name
    const actualDay = chosenDate.toLocaleString("en-US", { weekday: "long" });

    if (shift.day !== actualDay) {
      toast.error(
        `The selected week start date (${weekStart}) is a ${actualDay}. Please make sure the start day and date match.`,
        { duration: 9000 }
      );
      return;
    }
  }

  // Prevent duplicate day entry
  const dayAlreadyAdded = shifts.some((s) => s.day === shift.day);
  if (dayAlreadyAdded) {
    toast.error(`${shift.day} has already been added`, { duration: 6000 });
    return;
  }

  // Prevent more than 7 days
  if (shifts.length >= 7) {
    toast.error("You can only assign 7 days per week", { duration: 6000 });
    return;
  }

  //  Add shift
  setShifts([...shifts, { ...shift, user_id: Number(worker) }]);
  setShift({ day: "", shift_type: "" });
};
;

  //  Submit all shifts
  const handleSubmit = async () => {
    if (!worker || !weekStart) {
      toast.error("Please select a worker and a week start date");
      return;
    }

    if (shifts.length < 7) {
      toast.error("Please assign all 7 days before submitting");
      return;
    }

    //  Use helper to calculate correct real calendar dates
    const shiftsWithDates = generateShiftDates(shifts, weekStart, worker);

    try {
      const res = await dispatch(
        assignShift({ user_id: Number(worker), shifts: shiftsWithDates })
      ).unwrap();

      setShifts([]);
      setWeekStart("");
      toast.success(res.message || "Shifts assigned successfully!");
    } catch (error) {
      toast.error(error || "Failed to assign shifts");
      console.log(error);
    }
  };

  //  Delete a shift from preview
  const handleDeleteShift = (indexToDelete) => {
    setShifts(shifts.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="p-4 lg:py-6 lg:px-20 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Assign Shifts</h1>

      {error ? (
        <p className="text-center text-red-600 font-semibold py-6">
          Failed to load or assign shifts. Please try again later.
        </p>
      ) : (
        <>
          {/* Worker + Week Start */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-medium">Select Worker</label>
              <select
                className="w-full p-3 rounded border border-gray-200"
                value={worker}
                onChange={(e) => setWorker(e.target.value)}
              >
                <option value="">Select Worker</option>
                {workers.map((w, index) => (
                  <option key={index} value={w.user_id}>
                    {capitalize(w.firstName)} {capitalize(w.lastName)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Pick Start Date for the Week
              </label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="p-3 rounded border border-gray-200 w-full"
              />
            </div>
          </div>

          {/* Shift Inputs */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <select
              value={shift.day}
              onChange={(e) => setShift({ ...shift, day: e.target.value })}
              className="p-3 rounded border border-gray-200"
            >
              <option value="">Select Day</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>

            <select
              value={shift.shift_type}
              onChange={(e) => setShift({ ...shift, shift_type: e.target.value })}
              className="p-3 rounded border border-gray-200"
            >
              <option value="">Select Shift</option>
              <option>Morning</option>
              <option>Mid</option>
              <option>Afternoon</option>
              <option>Off</option>
            </select>
          </div>

          <button
            onClick={handleAddShift}
            disabled={loading}
            className={`w-full py-2 rounded mb-4 ${
              loading
                ? "bg-red-600 cursor-not-allowed text-white"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {loading ? "Adding..." : "Add Shift"}
          </button>

          {/* Preview Shifts */}
          {shifts.length > 0 && (
            <div className="mb-4 border-t pt-4">
              <h2 className="font-medium mb-2">Preview Shifts:</h2>
              <ul className="space-y-2">
                {shifts.map((s, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded"
                  >
                    <span>
                      {s.day} — {s.shift_type}
                    </span>
                    <button
                      onClick={() => handleDeleteShift(index)}
                      className="bg-red-100 text-red-500 hover:bg-red-200 rounded-full p-1 ml-3"
                      title="Delete shift"
                    >
                      <FiTrash size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {shifts.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 rounded text-white ${
                loading
                  ? "bg-gradient-to-br from-[#e71919] to-[#2e0101] cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-900 hover:opacity-90"
              }`}
            >
              {loading ? "Assigning..." : "Assign All Shifts"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AssignShift;
