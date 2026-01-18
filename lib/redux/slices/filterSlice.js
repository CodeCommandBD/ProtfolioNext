import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategory: "all", // 'all' | 'web' | 'mobile' | 'fullstack'
  searchQuery: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCategory = "all";
      state.searchQuery = "";
    },
  },
});

export const { setCategory, setSearchQuery, resetFilters } =
  filterSlice.actions;
export default filterSlice.reducer;
