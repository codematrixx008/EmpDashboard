import { configureStore } from "@reduxjs/toolkit";
import combinedSlice from "../reducer/combinedSlice.ts";
import loginSlice from "../reducer/loginSlice.ts";
import errorSlice from "../reducer/errorSlice.ts";
import employeePageSlice from "../reducer/employeePageSlice.ts";
import detailsPageSlice from "../reducer/detailsPageSlice.ts";
import roleSlice from "../reducer/roleSlice.ts";
import userRoleSlice from "../reducer/userRoleSlice.ts";
import departmentSlice from "../reducer/departmentSlice.ts";

export const store = configureStore({
  reducer: {
    combined: combinedSlice,
    error: errorSlice,
    login: loginSlice,
    employeePage: employeePageSlice,
    employeeDetails: detailsPageSlice,
    role: roleSlice,
    userRoles: userRoleSlice,
    department: departmentSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;