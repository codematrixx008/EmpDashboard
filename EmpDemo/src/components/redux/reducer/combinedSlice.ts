import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance.ts";
import { setError } from "./errorSlice.ts";

const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;

interface TabState {
  selectedTab: number | null;
  selectedParentTab: number | null;
}
const initialSelectedTabState: TabState = {
  selectedTab: null,
  selectedParentTab: null,
};

const combinedSlice = createSlice({
  name: "combined",
  initialState: {
    buttonName: "",
    buttonStates: {},
    editDisabled: false,
    deleteDisabled: false,
    saveDisabled: false,
    cancelDisabled: false,
    isDirty: false,
    showConfirmation: false,
    isDirtyTargetPath: {},

    selectedTab: initialSelectedTabState.selectedTab,
    selectedParentTab: initialSelectedTabState.selectedTab,


    gridSchemaCommonHeaderData: { Columns: [], Configuration: {} },
    formCommonDropdownData: { MasterDropdownData: [] },
    commonMasterDropdownData: [],
    masterDropdownDirty: false,
    activeModule: null as number | null,
    currentUserId: null,
  },
  reducers: {
    setButtonName: (state, action: PayloadAction<string>) => {
      state.buttonName = action.payload;
    },

    setButtonStates: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.buttonStates = {
        ...state.buttonStates,
        ...action.payload,
      };
    },
    setIsEditDisabled: (state, action: PayloadAction<boolean>) => {
      state.editDisabled = action.payload;
    },
    setIsDeleteDisabled: (state, action: PayloadAction<boolean>) => {
      state.deleteDisabled = action.payload;
    },
    setSaveDisabled: (state, action: PayloadAction<boolean>) => {
      state.saveDisabled = action.payload;
    },
    setCancelDisabled: (state, action: PayloadAction<boolean>) => {
      state.cancelDisabled = action.payload;
    },
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    setIsDirtyTargetPath: (state, action: PayloadAction<object>) => {
      state.isDirtyTargetPath = action.payload;
    },
    setShowConfirmation: (state, action: PayloadAction<boolean>) => {
      state.showConfirmation = action.payload;
    },

    setSelectedParentTab: (state, action: PayloadAction<number | null>) => {
      state.selectedParentTab = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<number | null>) => {
      state.selectedTab = action.payload;
    },
    setCommonMasterDropdownData: (state, action) => {
      state.commonMasterDropdownData = action.payload;
    },




    setGridSchemaCommonHeaderData: (state, action) => {
      state.gridSchemaCommonHeaderData = action.payload;
    },
    setFormCommonDropdownData: (state, action) => {
      state.formCommonDropdownData = action.payload;
    },
    setMasterDropdownDirty: (state, action) => {
      state.masterDropdownDirty = action.payload;
    },
    setActiveModule: (state, action: PayloadAction<number | null>) => {
      state.activeModule = action.payload;
    },
    setCurrentUserId: (state, action: any) => {
      state.currentUserId = action.payload;
    },



  },
});


export const getGridCommonHeaderData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/GetColumnHeaderSchema`, payload);
    dispatch(setGridSchemaCommonHeaderData(response.data));
    dispatch(setError(null));
    // }
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
}; //new

export const getFormCommonDropdownData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/GetMasterDropdownData`, payload);
    dispatch(setFormCommonDropdownData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
}; //new


export const getCommonMasterDropdownData = (payload: any) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post(`${reactAppBaseUrl}/ManageDropdownItems`, payload);
    dispatch(setCommonMasterDropdownData(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error?.response?.data || "Error"));
  }
}; //new







export const {
  setButtonName,
  setButtonStates,
  setIsDirty,
  setShowConfirmation,
  setIsDirtyTargetPath,
  setCommonMasterDropdownData,

  setSelectedParentTab,
  setSelectedTab,
  setIsEditDisabled,
  setIsDeleteDisabled,
  setSaveDisabled,
  setCancelDisabled,
  setGridSchemaCommonHeaderData,
  setFormCommonDropdownData,
  setMasterDropdownDirty,
  setActiveModule,
  setCurrentUserId,
} = combinedSlice.actions;

export default combinedSlice.reducer;
