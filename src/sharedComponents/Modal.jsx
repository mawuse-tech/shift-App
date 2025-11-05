import React from "react";

const Modal = ({ title, children, onClose, onConfirm, confirmText = "Confirm", showConfirm = false }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-4 rounded-xl shadow-2xl w-[100%] md:w-[500px] relative">
                {/* Title */}
                {title && (
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
                )}

                {/* Modal Body */}
                <div className="text-gray-700">{children}</div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
                    >
                        Close
                    </button>

                    {showConfirm && (
                        <button
                            onClick={onConfirm}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
