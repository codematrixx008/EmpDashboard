import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import { addNewEmployeeInList, clearAddNewEmployeeInList, clearDeleteEmployeeById, deleteEmployeeById } from "../../redux/reducer/employeePageSlice.ts";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { createNewDepartment, deleteDepartmentById, fetchDepartmentPageGridTable, updateExistingDepartment } from "../../redux/reducer/departmentSlice.ts";
import { clearDeleteUserRoleById } from "../../redux/reducer/userRoleSlice.ts";


export const useDepartmentService = () => {

  const dispatch = useDispatch<AppDispatch>();

  const {
    addDepartmentData,
    updateDepartmentData,
    deleteDepartmentData,
  } = useSelector((state: RootState): {
     addDepartmentData: any,
    updateDepartmentData: any,
    deleteDepartmentData: any;
  } => ({
    addDepartmentData: state.department.addDepartmentData,
    updateDepartmentData: state.department.updateDepartmentData,
    deleteDepartmentData: state.department.deleteDepartmentData,
  }));



 //!========== Department Functions start ===========

  useEffect(() => {
    if (addDepartmentData && 'message' in addDepartmentData) {
      toast.success(String(addDepartmentData?.message));
      dispatch(fetchDepartmentPageGridTable());
    }
  }, [addDepartmentData])

  useEffect(() => {
    if (updateDepartmentData && 'message' in updateDepartmentData) {
      toast.success(String(updateDepartmentData?.message));
      dispatch(fetchDepartmentPageGridTable());
    }
  }, [updateDepartmentData])

  useEffect(() => {
    if (deleteDepartmentData && 'message' in deleteDepartmentData) {
      toast.success(String(deleteDepartmentData?.message));
      dispatch(fetchDepartmentPageGridTable());
      dispatch(clearDeleteUserRoleById());
    }
  }, [deleteDepartmentData])

  //! send (department) data to api
  const handleSendAddDepartment = (data: any) => {
    dispatch(createNewDepartment(data));
  }

  const handleDeleteDepartment = (Id: number) => {
    dispatch(deleteDepartmentById(Id));
  }

  const handleUpdateDepartment = (Id: number, data: any) => {
    const payload = {
      Id: Id,
      DepartmentName: data.DepartmentName
    }
    dispatch(updateExistingDepartment(payload, Id));
  }
  //!========== Department Functions End ===========


  


  
  // return everything you want the caller to use
  return {
    handleSendAddDepartment,
    handleDeleteDepartment,
    handleUpdateDepartment
  };
};