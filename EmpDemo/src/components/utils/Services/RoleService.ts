import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearDeleteUserRoleById, createNewUserRole, deleteUserRoleById, fetchUserRolePageGridTable, updateExistingUserRole } from "../../redux/reducer/userRoleSlice.ts";


export const useRoleService = () => {

  const dispatch = useDispatch<AppDispatch>();

  const {
    deleteUserRoleData,
    addedUserRoleData,
    updateUserRoleData,
  } = useSelector((state: RootState): {
     deleteUserRoleData: any,
    addedUserRoleData: any,
    updateUserRoleData: any,
  } => ({
     deleteUserRoleData: state.userRoles.deleteUserRoleData,
    addedUserRoleData: state.userRoles.addedUserRoleData,
    updateUserRoleData: state.userRoles.updateUserRoleData,
  }));




 // ======= User Role Functions start's ===========
   useEffect(() => {
     if (deleteUserRoleData && 'message' in deleteUserRoleData) {
       toast.success(String(deleteUserRoleData?.message));
       dispatch(clearDeleteUserRoleById());
       dispatch(fetchUserRolePageGridTable());
     }
   }, [deleteUserRoleData])
 
   useEffect(() => {
     if (addedUserRoleData && 'message' in addedUserRoleData) {
       toast.success(String(addedUserRoleData?.message));
       dispatch(fetchUserRolePageGridTable());
     }
   }, [addedUserRoleData])
 
   useEffect(() => {
     if (updateUserRoleData && 'message' in updateUserRoleData) {
       toast.success(String(updateUserRoleData?.message));
       dispatch(fetchUserRolePageGridTable());
     }
   }, [updateUserRoleData])
 
 
   const handleSendAddUserRole = (data: any) => {
     dispatch(createNewUserRole(data.UserRoleName));
   }
 
   const handleDeleteUserRole = (Id: number) => {
     dispatch(deleteUserRoleById(Id));
   }
 
   const handleUpdateUserRole = (Id: number, data: any) => {
     const payload = {
       Id: Id,
       UserRoleName: data.UserRoleName
     }
     dispatch(updateExistingUserRole(payload));
   }
   // ======= User Role Functions end's ===========


  


  
  // return everything you want the caller to use
  return {
    handleSendAddUserRole,
    handleDeleteUserRole,
    handleUpdateUserRole
  };
};