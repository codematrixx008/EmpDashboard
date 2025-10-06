import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import { addNewEmployeeInList, clearAddNewEmployeeInList, clearDeleteEmployeeById, deleteEmployeeById, fetchEmployeeGridTableData, setEmployeeRecordData } from "../../redux/reducer/employeePageSlice.ts";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearSaveDetailsPageData, getDetailsStructureData, getSingleEmployeeDetails, saveDetailsPageData } from "../../redux/reducer/detailsPageSlice.ts";
import { getFormCommonDropdownData, setMasterDropdownDirty } from "../../redux/reducer/combinedSlice.ts";
import { use } from "i18next";


export const useEmployeeDetailService = () => {

    const dispatch = useDispatch<AppDispatch>();

    const {
        selectedTabId,
        currentUserId,
        masterDropdownDirty,
        updateDetailsFormData,
        employeeRecordData,
    } = useSelector((state: RootState): {
        selectedTabId: number | null;
        currentUserId: any;
        masterDropdownDirty: boolean;
        updateDetailsFormData: any;
        employeeRecordData: any,
    } => ({
        selectedTabId: state.combined.selectedTab,
        currentUserId: state.combined.currentUserId,
        masterDropdownDirty: state.combined.masterDropdownDirty,
        updateDetailsFormData: state.employeeDetails.updateDetailsFormData,
        employeeRecordData: state.employeePage.employeeRecordData,
    }));


    useEffect(() => {
        if (masterDropdownDirty) {
            // const detailPayload = {
            //     "TabIds": String(selectedTabId),
            //     "UserId": currentUserId
            // }
            // dispatch(getDetailsStructureData(detailPayload));
            const dropdownPayload = {
                "TabId": selectedTabId
            }
            dispatch(getFormCommonDropdownData(dropdownPayload));
            dispatch(setMasterDropdownDirty(false));
        }
    }, [masterDropdownDirty])

    useEffect(() => {
        if (updateDetailsFormData && updateDetailsFormData?.Message) {
            toast.success(updateDetailsFormData?.Message);
            dispatch(clearSaveDetailsPageData());

            const detailsDataPayload = {
                "RowId": employeeRecordData?.EmployeeIdList?.[0]
            }
            dispatch(getSingleEmployeeDetails(detailsDataPayload));
            dispatch(setMasterDropdownDirty(false));
        }
    }, [updateDetailsFormData])


    const handleFormDataSave = (values: any) => {
        const payload = {
            "Id": employeeRecordData?.EmployeeIdList?.[0],
            "EmployeeName": values?.EmployeeName || "",
            "Salary": values?.Salary || "",
            "DOB": values?.DOB || "",
            "GenderId": values?.Gender || "",
            "DepartmentId": values?.Department || "",
            "IsActive": values?.IsActive ? true : false,
            "Company": values?.Company || "",
            "Occupation": values?.Occupation || "",
            "JobTitle": values?.JobTitle || "",
        }
        dispatch(saveDetailsPageData(payload));
    }







    // return everything you want the caller to use
    return {
        handleFormDataSave,
    };
};