import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { setError } from "../reducer/errorSlice.ts";
import axiosInstance  from "../../../api/axiosInstance.ts";

const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;

interface UserRole {
  Id?: number;
  RoleName: string;
}


const userRoleSlice = createSlice({
  name: 'userRoles',
  initialState: {
    userRolePageGridColumn: [],
    userRolePageGridTable: [],
    addedUserRoleData: [],
    updateUserRoleData: [],
    deleteUserRoleData: null,

    
  },
  reducers: {
    setUserRolePageGridColumn: (state, action) => {
      state.userRolePageGridColumn = action.payload;
    },
    setUserRoleGridData: (state, action) => {
      state.userRolePageGridTable = action.payload;
    },
    setAddUserRole: (state, action) => {
      state.addedUserRoleData = action.payload;
    },
    setUpdateUserRole: (state, action) => {
      state.updateUserRoleData = action.payload;
    },
    setDeleteUserRole: (state, action) => {
      state.deleteUserRoleData = action.payload;
    },

   

  }
});


export const fetchUserRolePageGridTable = () => async (dispatch: any) => {
  try {
    const response = await axiosInstance.get(`${reactAppBaseUrl}/GetUserRoles`);
    dispatch(setUserRoleGridData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};

export const createNewUserRole = (userRole: UserRole) => async (dispatch: any) => { 
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/AddUserRole?UserRoleName=${userRole}`);
    dispatch(setAddUserRole(response.data));
  } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};

export const updateExistingUserRole = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/EditUserRole`, payload);
    dispatch(setUpdateUserRole(response.data));
   } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};

export const deleteUserRoleById = (Id: number) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/DeleteUserRole?id=${Id}`);
    dispatch(setDeleteUserRole(response.data));
  } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};
export const clearDeleteUserRoleById = () => async (dispatch: any) => {
  try {
    dispatch(setDeleteUserRole(null));
   } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};


export const {
  setUserRolePageGridColumn,
  setUserRoleGridData,
  setAddUserRole,
  setUpdateUserRole,
  setDeleteUserRole,

} = userRoleSlice.actions;

export default userRoleSlice.reducer;


