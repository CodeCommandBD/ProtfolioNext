import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import uiReducer from "./slices/uiSlice";
import filterReducer from "./slices/filterSlice";
import modalReducer from "./slices/modalSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      ui: uiReducer,
      filter: filterReducer,
      modal: modalReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};
