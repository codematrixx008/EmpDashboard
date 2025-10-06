import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setError } from "./errorSlice.ts";

const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loginDetailsData: null,
  },
  reducers: {
    setLoginDetails: (state, action) => {
      state.loginDetailsData = action.payload;
    },
  },
}); 

export const fetchLoginData = (token:any) => async (dispatch: any) => {
  try {    
    const response = await axios.post(`${reactAppBaseUrl}/LoginUser`, token);
    dispatch(setLoginDetails(response.data));
    dispatch(setError(null));
   } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};


export const { 
    setLoginDetails,
} = loginSlice.actions;

export default loginSlice.reducer;
