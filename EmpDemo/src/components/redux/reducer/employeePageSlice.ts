import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setError } from "./errorSlice.ts";

import axiosInstance  from "../../../api/axiosInstance.ts";

const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;

const employeePageSlice = createSlice({
  name: "employeePage",
  initialState: {
    nestedTabsData: [],
    employeePageGridTable: [],
    tabButtonListData: [],
    deletedEmployeeData: null,
    updateEmployeeGridData: null,
    updateGridSettingsStatus: [] as any[],

    gridPaginationData: {
      PageSize: 20,
      PageNo: 1,
      BtnFunction: null
    },

    employeeRecordData: { 
      EmployeeIdList: [],
      EmployeeData: {
        Id: null,
        EmployeeName: "",
        SalaryFrom: null,
        SalaryTo: null,
        Salary: 0,
        SalaryFilterCondition: "",
        DOBFrom: null,
        DOBTo: null,
        GenderIds: "",
        DepartmentIds: "",
        IsActive: null,
        AddressId: null
      },
      PageSize: 20,
      PageNo: 1,
      BtnFunction: "",
    }
  },
  reducers: {
    setNestedTabsData: (state, action) => {
      state.nestedTabsData = action.payload;
    },
    setEmployeePageGridTable: (state, action) => {
      state.employeePageGridTable = action.payload;
    },
    setTabButtonListData: (state, action) => {
      state.tabButtonListData = action.payload;
    },
    setDeletedEmployeeData: (state, action) => {
      state.deletedEmployeeData = action.payload;
    },
    setUpdateEmployeeGridData: (state, action) => {
      state.updateEmployeeGridData = action.payload;
    },

    setUpdateGridSettingsStatus: (state, action: { payload: any[] }) => {
      state.updateGridSettingsStatus = action.payload;
    },

    setGridPaginationData: (state, action) => {
      const payload = action.payload || {};
      state.gridPaginationData = {
        PageSize: payload.PageSize,
        PageNo: payload.PageNo,
        BtnFunction: payload.BtnFunction ?? null
      };
    },

    setEmployeeRecordData: (state, action) => {
      const payload = action.payload || {};
      state.employeeRecordData = {
        EmployeeIdList: payload.EmployeeIdList ?? [],
        EmployeeData: {
          Id: null,
          EmployeeName: payload.EmployeeData?.EmployeeName ?? "",
          SalaryFrom: payload.EmployeeData?.SalaryFrom ?? null,
          SalaryTo: payload.EmployeeData?.SalaryTo ?? null,
          Salary: payload.EmployeeData?.Salary ?? 0,
          SalaryFilterCondition: payload.EmployeeData?.SalaryFilterCondition ?? "",
          DOBFrom: payload.EmployeeData?.DOBFrom ?? null,
          DOBTo: payload.EmployeeData?.DOBTo ?? null,
          GenderIds: payload.EmployeeData?.GenderIds ?? "",
          DepartmentIds: payload.EmployeeData?.DepartmentIds ?? "",
          IsActive: payload.EmployeeData?.IsActive ?? null,
          AddressId: payload.EmployeeData?.AddressId ?? null
        },
        PageSize: payload.PageSize ?? 20,
        PageNo: payload.PageNo ?? 1,
        BtnFunction: payload?.BtnFunction ?? "",
      };
    },


  },
});



export const fetchNestedTabsData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/GetTabs`, payload);
    dispatch(setNestedTabsData(response.data));
    dispatch(setError(null));

  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

export const fetchEmployeeGridTableData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/GetEmployeeData`, payload);
    dispatch(setEmployeePageGridTable(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
}; 

export const getTabButtonListData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post("/GetMenuForTab", payload);
    dispatch(setTabButtonListData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

export const deleteEmployeeById = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/DeleteEmployee`, payload);
    dispatch(setDeletedEmployeeData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

export const clearDeleteEmployeeById = () => async (dispatch: any) => {
  try {
    dispatch(setDeletedEmployeeData(null));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};


export const addNewEmployeeInList = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/AddEmployee`, payload);
    dispatch(setUpdateEmployeeGridData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

export const clearAddNewEmployeeInList = () => async (dispatch: any) => {
  try {
    dispatch(setUpdateEmployeeGridData(null));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};


// update grid settings
export const updateGridSettings = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/UpdateGridSettings`, payload);
    dispatch(setUpdateGridSettingsStatus(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};
export const clearUpdateGridSettings = () => async (dispatch: any) => {
  try {
    dispatch(setUpdateGridSettingsStatus([]));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};


export const {
  setNestedTabsData,
  setEmployeePageGridTable,
  setTabButtonListData,
  setDeletedEmployeeData,
  setUpdateEmployeeGridData,
  setUpdateGridSettingsStatus,
  setGridPaginationData,
  setEmployeeRecordData,
} = employeePageSlice.actions;

export default employeePageSlice.reducer;
