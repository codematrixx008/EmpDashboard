import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setError } from "./errorSlice.ts";
import axiosInstance  from "../../../api/axiosInstance.ts";

const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;

const roleSlice = createSlice({
  name: "role",
  initialState: {
    rolePermissionList: [],
    rolePermissionGridData: [],
    roleGridHeaderData: [],
    postRolePermissionsSuccData: [],
  },
  reducers: {
    setRolePermissionList: (state, action) => {
      state.rolePermissionList = action.payload;
    },
    setRolePermissionGridData: (state, action) => {
      state.rolePermissionGridData = action.payload;
    },
    setRoleGridHeaderData: (state, action) => {
      state.roleGridHeaderData = action.payload;
    },
    setPostRolePermissionsSuccData: (state, action) => {
      state.postRolePermissionsSuccData = action.payload;
    },
  },
});


export const getRolePermissionList = () => async (dispatch: any) => {
  try {
    const response = await axiosInstance.get(`${reactAppBaseUrl}/GetUserRoles`);
    dispatch(setRolePermissionList(response.data));
    dispatch(setError(null));
  } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};

export const getRolePermissionById = (id: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.get(`${reactAppBaseUrl}/GetRolePermissionByRoleId?roleId=${id}`);
    dispatch(setRolePermissionGridData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};    

export const postRolePermissionsData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/UpdateRolePermissions`, payload);
    dispatch(setPostRolePermissionsSuccData(response.data));
    dispatch(setError(null));
   } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};

export const clearPostRolePermissionsData = () => async (dispatch: any) => {
  try {
    dispatch(setPostRolePermissionsSuccData([]));
    dispatch(setError(null));
   } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};


export const {
  setRolePermissionList,
  setRolePermissionGridData,
  setRoleGridHeaderData,
  setPostRolePermissionsSuccData,
} = roleSlice.actions;

export default roleSlice.reducer;