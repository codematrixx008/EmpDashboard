import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import { addNewEmployeeInList, clearAddNewEmployeeInList, clearDeleteEmployeeById, deleteEmployeeById, fetchEmployeeGridTableData, setEmployeeRecordData } from "../../redux/reducer/employeePageSlice.ts";
import { useEffect } from "react";
import { toast } from "react-toastify";


export const useEmployeeService = () => {

  const dispatch = useDispatch<AppDispatch>();

  const {
    deletedEmployeeData,
    updateEmployeeGridData,
    gridPaginationData,
    employeeRecordData
  } = useSelector((state: RootState): {
    deletedEmployeeData: { message: string } | null;
    updateEmployeeGridData: any,
    gridPaginationData: any,
    employeeRecordData: any,
  } => ({
    deletedEmployeeData: state.employeePage.deletedEmployeeData,
    updateEmployeeGridData: state.employeePage.updateEmployeeGridData,
    gridPaginationData: state.employeePage.gridPaginationData,
    employeeRecordData: state.employeePage.employeeRecordData,
  }));




  // ============== Employee List Functions start's ============
  const handleGetEmployeeGridTableData = () => {
    const payload = employeeRecordData;
    dispatch(fetchEmployeeGridTableData(payload));
  }

  useEffect(() => {
    if (deletedEmployeeData && deletedEmployeeData?.message) {
      toast.success(deletedEmployeeData?.message);
      dispatch(clearDeleteEmployeeById());

      handleGetEmployeeGridTableData();
    }
  }, [deletedEmployeeData])

  useEffect(() => {
    if (updateEmployeeGridData && updateEmployeeGridData?.message) {
      toast.success(updateEmployeeGridData?.message);
      dispatch(clearAddNewEmployeeInList());

      handleGetEmployeeGridTableData();
    }
  }, [updateEmployeeGridData])

  useEffect(() => {
    if (gridPaginationData) {
      dispatch(setEmployeeRecordData({
        "PageSize": gridPaginationData?.PageSize,
        "PageNo": gridPaginationData?.PageNo,
        "BtnFunction": gridPaginationData?.BtnFunction,
      }));
    }
  }, [gridPaginationData])

  const handleFilterEmployee = (values: any) => {
    dispatch(setEmployeeRecordData({
      EmployeeData: {
        "Id": null,
        "EmployeeName": values?.EmployeeName || "",
        "SalaryFrom": values?.SalaryFrom || null,
        "SalaryTo": values?.SalaryTo || null,
        "Salary": values?.Salary || 0,
        "SalaryFilterCondition": values?.SalaryFilterCondition || "",
        "DOBFrom": values?.DOBFrom ? values?.DOBFrom : null,
        "DOBTo": values?.DOBTo ? values?.DOBTo : null,
        "GenderIds": values?.GenderIds ? String(values?.GenderIds) : "",
        "DepartmentIds": values?.DepartmentIds || "",
        // "IsActive": values?.IsActive || null,
        "IsActive": values?.IsActive == undefined ? null : values?.IsActive ? true : false,
      }
    }));
  }

  const handleFilterEmployeeReset = () => {
    dispatch(setEmployeeRecordData({
      EmployeeData: {
        "Id": null,
        "EmployeeName": "",
        "SalaryFrom": null,
        "SalaryTo": null,
        "Salary": 0,
        "SalaryFilterCondition": "",
        "DOBFrom": null,
        "DOBTo": null,
        "GenderIds": "",
        "DepartmentIds": "",
        "IsActive": null,
      }
    }));
  }

  const handleSendAddEmployee = (values: any) => {
    dispatch(addNewEmployeeInList(values));
  }

  const handleDeleteEmployee = (ids: number) => {
    const payload = {
      "Ids": ids,
    }
    dispatch(deleteEmployeeById(payload));
  }

  const handleUpdateEmployee = (row: any, values: any) => {
    return null;
  }
  // ============== Employee List Functions end's ============






  // return everything you want the caller to use
  return {
    handleSendAddEmployee,
    handleFilterEmployee,
    handleFilterEmployeeReset,
    handleDeleteEmployee,
    handleUpdateEmployee
  };
};