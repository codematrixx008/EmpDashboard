//! api is missing (change the url)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { setError } from "../reducer/errorSlice.ts";
import axiosInstance  from "../../../api/axiosInstance.ts";

interface User {
    id?: number;
    EmployeeName: string;
    Salary: number;
    DOB: number;
    Gender: string;
    IsActive: boolean;
    Department: string;
}

interface UserState {
    UsersDetails: User[];
}

const initialState: UserState = {
    UsersDetails: [],
};

const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;

const UserSlice = createSlice({
    name: 'Users',
    initialState,
    reducers: {
        setUserDetails: (state, action: PayloadAction<User[]>) => {
            state.UsersDetails = action.payload;
        },
        setAddUser: (state, action: PayloadAction<User>) => {
            state.UsersDetails.push(action.payload);
        },
        setUpdateUser: (state, action: PayloadAction<User>) => {
            const index = state.UsersDetails.findIndex(User => User.id === action.payload.id);
            if (index !== -1) {
                state.UsersDetails[index] = action.payload;
            }
        },
        setRemoveUser: (state, action: PayloadAction<number>) => {
            state.UsersDetails = state.UsersDetails.filter(User => User.id !== action.payload);
        },
    },
});

//  actions - get all user roles
export const fetchUsersDetails = () => async (dispatch: any) => {
    try {
        const response = await axiosInstance.get<User[]>(`${reactAppBaseUrl}/GetUsers`);
        dispatch(setUserDetails(response.data));
        dispatch(setError(null));
    } catch (error: any) {
        dispatch(setError(error?.response?.data || "Error"));
    }
};

// add new User
export const createNewUser = (RoleName: User) => async (dispatch: any) => {
    try {
        const response = await axiosInstance.post<User>(`${reactAppBaseUrl}/AddUser`, { RoleName });
        dispatch(setAddUser(response.data));
    } catch (error: any) {
        dispatch(setError(error?.response?.data || "Error"));
    }
};

// update User
export const updateExistingUser = (payload: any) => async (dispatch: any) => {
    try {
        const response = await axiosInstance.put<User>(`${reactAppBaseUrl}/UpdateUser`, payload);
        dispatch(setUpdateUser(response.data));
    } catch (error: any) {
        dispatch(setError(error?.response?.data || "Error"));
     }
};

// delete User



export const {
    setUserDetails,
    setAddUser,
    setUpdateUser,
    setRemoveUser,
} = UserSlice.actions;

export default UserSlice.reducer;