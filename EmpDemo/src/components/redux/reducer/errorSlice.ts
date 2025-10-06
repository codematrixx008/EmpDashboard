import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    errorMsg: null,
  },
  reducers: {
    setError: (state, action) => {
      state.errorMsg = action.payload;
    },
    clearError: (state) => {
      state.errorMsg = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
