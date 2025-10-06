import { createSlice } from "@reduxjs/toolkit";
import axiosInstance  from "../../../api/axiosInstance.ts";
import { setError } from "./errorSlice.ts";

const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;


interface DetailsPageState {
  addressHeaderData: any[];  
  addressTableData: any[];
  addAddressGridData: any[];
  editAddressGridData: any[];
  deleteAddressGridData: any[];
  detailsFormColumnsData: any[];
  singleEmployeeDetailsData: any[];
  updateDetailsFormData: any[] | null;
}

const initialState: DetailsPageState = {
  addressHeaderData: [],
  addressTableData: [],
  addAddressGridData: [],
  editAddressGridData: [],
  deleteAddressGridData: [],
  detailsFormColumnsData: [],
  singleEmployeeDetailsData: [],
  updateDetailsFormData: [],
};

const detailPageSlice = createSlice({
  name: "employeeDetails",
  initialState,
  reducers: {
    setAddressHeaderData: (state, action) => {
      state.addressHeaderData = action.payload;
    },
    setAddressTableData: (state, action) => {
      state.addressTableData = action.payload;
    },
    setAddAddressGridData: (state, action) => {
      state.addAddressGridData = action.payload;
    },
    setEditAddressGridData: (state, action) => {
      state.editAddressGridData = action.payload;
    },
    setDeleteAddressGridData: (state, action) => {
      state.deleteAddressGridData = action.payload;
    },



    setDetailsFormColumnsData: (state, action) => {
      state.detailsFormColumnsData = action.payload;
    },
    getSingleEmployeeDetailsData: (state, action) => {
      state.singleEmployeeDetailsData = action.payload;
    },
    setUpdateDetailsFormData: (state, action) => {
      state.updateDetailsFormData = action.payload;
    },




  },
});



export const fetchAddressHeaderData = () => async (dispatch: any) => {
  try {
    const response = await axiosInstance.get(`${reactAppBaseUrl}/ValidateUser0000`);
    dispatch(setAddressHeaderData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

export const fetchAddressTableData = () => async (dispatch: any) => {
  try {
    const response = await axiosInstance.get(`${reactAppBaseUrl}/ValidateUser0000`);
    dispatch(setAddressTableData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

// Add address data 
export const handleAddAddressGridData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/AddAddress`, payload);
    dispatch(setAddAddressGridData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

// clear
export const clearHandleAddAddressGridData = () => async (dispatch: any) => {
  try {
    dispatch(setAddAddressGridData([]));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

export const handleEditAddressGridData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/UpdateAddress`, payload);
    dispatch(setEditAddressGridData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

// clear
export const clearHandleEditAddressGridData = () => async (dispatch: any) => {
  try {
    dispatch(setEditAddressGridData([]));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};


export const handleDeleteAddressGridData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/DeleteAddress`, payload);
    dispatch(setDeleteAddressGridData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

// clear
export const clearHandleDeleteAddressGridData = () => async (dispatch: any) => {
  try {
    dispatch(setDeleteAddressGridData([]));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

// ==========================================




export const getDetailsStructureData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/GetDetailStructure`, payload);
    dispatch(setDetailsFormColumnsData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};

export const getSingleEmployeeDetails = (payload: any) => async (dispatch: any) => { 
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/GetDetailPageData`, payload);
    dispatch(getSingleEmployeeDetailsData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};


export const saveDetailsPageData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/UpdateEmployee`, payload);
    dispatch(setUpdateDetailsFormData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};
export const clearSaveDetailsPageData = () => async (dispatch: any) => {
  try {
    dispatch(setUpdateDetailsFormData(null));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
};


// ==========================================



export const {
  setAddressHeaderData,
  setAddressTableData,
  setAddAddressGridData,
  setEditAddressGridData,
  setDeleteAddressGridData,

  setDetailsFormColumnsData,
  getSingleEmployeeDetailsData,
  setUpdateDetailsFormData,
} = detailPageSlice.actions;

export default detailPageSlice.reducer;
