"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "OK",
  showCancel = false,
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="w-12 h-12 text-green-500 mb-4" />;
      case "error":
        return <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />;
      case "warning":
        return <FiAlertCircle className="w-12 h-12 text-yellow-500 mb-4" />;
      default:
        return <FiInfo className="w-12 h-12 text-blue-500 mb-4" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case "success":
        return "from-green-500/20 to-emerald-500/10";
      case "error":
        return "from-red-500/20 to-orange-500/10";
      case "warning":
        return "from-yellow-500/20 to-orange-500/10";
      default:
        return "from-blue-500/20 to-purple-500/10";
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
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`relative bg-[#0f0f14] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Background Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50`}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <FiX size={20} />
            </button>

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              {getIcon()}

              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

              <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>

              <div className="flex gap-3 w-full">
                {showCancel && (
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;
