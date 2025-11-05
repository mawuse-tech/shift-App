import React from "react";
import { IoClose } from "react-icons/io5";

const ShiftModal = ({ shift, onClose }) => {
  if (!shift) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <div className="bg-gradient-to-r from-[#e71919] to-[#580404] text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Shift Details</h2>
          <button onClick={onClose} className="text-white text-2xl">
            <IoClose />
          </button>
        </div>

        <div className="p-5 space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Name:</span> {shift.name}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {shift.role}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {shift.date}
          </p>
          <p>
            <span className="font-semibold">Shift Type:</span>{" "}
            {shift.shiftType}
          </p>
          <p>
            <span className="font-semibold">Time:</span> {shift.time}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {shift.location}
          </p>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#e71919] to-[#580404] text-white py-2 px-4 rounded-md hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
