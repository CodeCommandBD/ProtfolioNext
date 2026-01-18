"use client";

import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/lib/redux/slices/modalSlice";
import Modal from "@/components/Modal";

const GlobalModal = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, type, confirmText, showCancel } = useSelector(
    (state) => state.modal,
  );

  const handleClose = () => {
    dispatch(closeModal());
  };

  // Note: For "onConfirm", since we can't store functions in Redux,
  // complex confirmation logic (like deleting an item)
  // should ideally be kept local to the component triggering it,
  // OR we use a callback pattern if we really want it global.
  // For this implementation, we will use the GlobalModal primarily for
  // Success/Error alerts which don't need complex callbacks.
  //
  // If we need a global "Confirm Delete", we might need a separate Context
  // or a non-serializable middleware, but keeping it local is cleaner for Next.js.

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      message={message}
      type={type}
      confirmText={confirmText}
      showCancel={showCancel}
      onConfirm={handleClose} // Default behavior is just close
    />
  );
};

export default GlobalModal;
