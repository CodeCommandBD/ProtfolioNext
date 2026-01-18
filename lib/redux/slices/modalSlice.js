import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info", // "info", "success", "error", "warning"
  confirmText: "OK",
  showCancel: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title || "";
      state.message = action.payload.message || "";
      state.type = action.payload.type || "info";
      state.confirmText = action.payload.confirmText || "OK";
      state.showCancel = action.payload.showCancel || false;
    },
    closeModal: (state) => {
      state.isOpen = false;
      // We don't reset other state to avoid flickering during close animation
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
