import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance  from "../../../api/axiosInstance.ts";
import { setError } from "../reducer/errorSlice.ts";

const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;

interface Department {
    Id?: number;
    DepartmentName: string;
}

interface DepartmentState {
    departmentPageGridColumn: any[];
    departmentPageGridTable: Department[];
    addDepartmentData: Department[];
    updateDepartmentData: Department[];
    deleteDepartmentData: Department[];
    hideDepartmentData: Department[];
    unhideDepartmentData: Department[];

}

const initialState: DepartmentState = {
    departmentPageGridColumn: [],
    departmentPageGridTable: [],
    addDepartmentData: [],
    updateDepartmentData: [],
    deleteDepartmentData: [],
     hideDepartmentData: [],
    unhideDepartmentData: []


};

const departmentSlice = createSlice({
    name: 'department',
    initialState,
    reducers: {
        setDepartmentPageGridColumn: (state, action) => {
            state.departmentPageGridColumn = action.payload;
        },
        setDepartmentDetails: (state, action: PayloadAction<Department[]>) => {
            state.departmentPageGridTable = action.payload;
        },
        setAddDepartment: (state, action: PayloadAction<Department[]>) => {
            state.addDepartmentData = action.payload;
        },
        setUpdateDepartment: (state, action: PayloadAction<Department[]>) => {
            state.updateDepartmentData = action.payload;
        },
        setDeleteDepartment: (state, action) => {
            state.deleteDepartmentData = action.payload;
        },
        setHideDepartment: (state, action) => {
            state.hideDepartmentData = action.payload;
        },
        setUnhideDepartment: (state, action) => {
            state.unhideDepartmentData = action.payload;
        },
    },
});



//  actions - get all department
export const fetchDepartmentPageGridTable = () => async (dispatch: any) => {
    try {
         const payload: { "Id": number, "Action": string } = {
            "Id": 0,
            "Action": ""
        }
        const response = await axiosInstance.post<Department[]>(`${reactAppBaseUrl}/DepartmentsList`, payload);
        dispatch(setDepartmentDetails(response.data));
        dispatch(setError(null));
    } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};

// add new Department
export const createNewDepartment = (payload: Department) => async (dispatch: any) => {
    try {
        const response = await axiosInstance.post<Department[]>(`${reactAppBaseUrl}/AddDepartmentsList`, payload);
        dispatch(setAddDepartment(response.data));
    } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};

// update Department
export const updateExistingDepartment = (payload: Department, Id: number) => async (dispatch: any) => {
    try {
        const response = await axiosInstance.post<Department[]>(`${reactAppBaseUrl}/UpdateDepartmentsList/${Id}`, payload);
        dispatch(setUpdateDepartment(response.data));
    } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};

// delete Department
export const deleteDepartmentById = (Id: number) => async (dispatch: any) => {
    try {
        const response = await axiosInstance.post(`${reactAppBaseUrl}/DeleteDepartmentsList/${Id}`);
        dispatch(setDeleteDepartment(response.data));
    } catch (error: any) {
     dispatch(setError(error?.response?.data || "Error"));
  }
};


//  hide Department
export const hideDepartmentById = (payload: any) => async (dispatch: any) => {
    try {
        const response = await axiosInstance.post(`${reactAppBaseUrl}/DepartmentsList`,payload);
        dispatch(setHideDepartment(response.data));
    } catch (error: any) {
        dispatch(setError(error?.response?.data || "Error"));
    }
};

export const unhideDepartmentById = (payload: any) => async (dispatch: any) => {
    try {
        const response = await axiosInstance.post(`${reactAppBaseUrl}/DepartmentsList`, payload);
        dispatch(setUnhideDepartment(response.data));
    } catch (error: any) {
        dispatch(setError(error?.response?.data || "Error"));
    }
}

export const {
    setDepartmentPageGridColumn,
    setDepartmentDetails,
    setAddDepartment,
    setUpdateDepartment,
    setDeleteDepartment,
    setHideDepartment,
    setUnhideDepartment
} = departmentSlice.actions;

export default departmentSlice.reducer;