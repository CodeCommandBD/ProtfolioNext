import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobileMenuOpen: false,
  activeSection: "home",
  isScrolled: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setScrolled: (state, action) => {
      state.isScrolled = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  openMobileMenu,
  setActiveSection,
  setScrolled,
} = uiSlice.actions;

export default uiSlice.reducer;
