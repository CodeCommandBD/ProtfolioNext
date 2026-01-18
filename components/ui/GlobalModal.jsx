"use client";

import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/lib/redux/slices/modalSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const GlobalModal = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, type, confirmText, showCancel, onConfirm } =
    useSelector((state) => state.modal);

  // Handle Hydration mismatch for createPortal
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    if (onConfirm) {
      // Note: Functions strictly can't be passed in Redux payload (non-serializable).
      // If the user setup relies on this, it might break.
      // However, previous code suggested "local confirmation" or "simple global alerts".
      // We will safeguard this.
      // *Correction*: The previous `GlobalModal` code had a comment about this limitation.
      // If `onConfirm` callback is needed for "Delete", it usually needs local state.
      // But let's support the UI handling at least.
      onConfirm();
    }
    handleClose();
  };

  if (!mounted) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck className="text-green-500 text-3xl" />;
      case "warning":
        return <FiAlertTriangle className="text-yellow-500 text-3xl" />;
      case "error":
        return <FiX className="text-red-500 text-3xl" />;
      default:
        return <FiInfo className="text-blue-500 text-3xl" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-500/50";
      case "warning":
        return "border-yellow-500/50";
      case "error":
        return "border-red-500/50";
      default:
        return "border-blue-500/50";
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative bg-[#0f0f14] border ${getBorderColor()} w-full max-w-md p-6 rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Glow Effect */}
            <div
              className={`absolute top-0 right-0 p-20 opacity-20 blur-3xl rounded-full translate-x-10 -translate-y-10 ${
                type === "error"
                  ? "bg-red-600"
                  : type === "success"
                    ? "bg-green-600"
                    : "bg-blue-600"
              }`}
            ></div>

            <div className="relative z-10 flex flex-col items-center text-center gap-4">
              <div
                className={`p-4 rounded-full bg-white/5 border border-white/10 ${
                  type === "success"
                    ? "text-green-400"
                    : type === "error"
                      ? "text-red-400"
                      : "text-blue-400"
                }`}
              >
                {getIcon()}
              </div>

              <h3 className="text-xl font-bold text-white tracking-wide">
                {title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">{message}</p>

              <div className="flex gap-3 mt-4 w-full">
                {showCancel && (
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
                    type === "error"
                      ? "bg-gradient-to-r from-red-600 to-red-500"
                      : type === "warning"
                        ? "bg-gradient-to-r from-yellow-600 to-orange-500"
                        : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }`}
                >
                  {confirmText || "Okay"}
                </button>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default GlobalModal;
