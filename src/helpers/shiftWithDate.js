// utils/generateShiftDates.js
export const generateShiftDates = (shifts, startDate, worker) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return shifts.map((shift) => {
    const start = new Date(startDate);
    const startDayIndex = start.getDay();
    const targetDayIndex = daysOfWeek.indexOf(shift.day);

    let diff = targetDayIndex - startDayIndex;
    if (diff < 0) diff += 7;

    const shiftDate = new Date(start);
    shiftDate.setDate(start.getDate() + diff);

    return {
      ...shift,
      date: shiftDate.toISOString().split("T")[0],
      user_id: Number(worker),
    };
  });
};
