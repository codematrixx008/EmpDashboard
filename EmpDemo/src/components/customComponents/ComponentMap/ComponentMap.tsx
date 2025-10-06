import { useEmployeeService } from "../../utils/Services/EmployeeService.ts";
import RolePermission from "../../pages/RolePermission/RolePermission.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store.ts";
import { useRoleService } from "../../utils/Services/RoleService.ts";
import { useDepartmentService } from "../../utils/Services/DepartmentService.ts";
import Details from "../../pages/Details.tsx";
import PageGrid from "../PageGrid/PageGrid.tsx";
import { useEmployeeDetailService } from "../../utils/Services/EmployeeDetailService.ts";
import ReportsList from "../ReportsList/ReportsList.tsx";

const ComponentMap = (): Record<number, React.ReactElement> => {

  const {
    employeePageGridTable,
    detailsFormColumnsData,
    singleEmployeeDetailsData,
    userRolePageGridTable,
    departmentPageGridTable,
  } = useSelector((state: RootState) => ({
    employeePageGridTable: state.employeePage.employeePageGridTable,

    detailsFormColumnsData: state.employeeDetails.detailsFormColumnsData,
    singleEmployeeDetailsData: state.employeeDetails.singleEmployeeDetailsData,

    userRolePageGridTable: state.userRoles.userRolePageGridTable,
    departmentPageGridTable: state.department.departmentPageGridTable,
  }));

  // Employee Page Custom Functions
  const {
    handleSendAddEmployee,
    handleDeleteEmployee,
    handleUpdateEmployee,
    handleFilterEmployee,
    handleFilterEmployeeReset,
  } = useEmployeeService();

  // Detail Page Custom Functions
  const {
    handleFormDataSave,
  } = useEmployeeDetailService();

  // User Role Page Custom Functions
  const {
    handleSendAddUserRole,
    handleDeleteUserRole,
    handleUpdateUserRole,
  } = useRoleService();

  // Department Page Custom Functions
  const {
    handleSendAddDepartment,
    handleDeleteDepartment,
    handleUpdateDepartment,
  } = useDepartmentService();



  return {
    100: (
      <ReportsList
        key="reportList"
      />
    ),
    101: (
      <PageGrid
        key="employeeList"
        bodyData={employeePageGridTable}
        handleSendAdd={handleSendAddEmployee}
        handleSendUpdate={handleUpdateEmployee}
        handleSendDelete={handleDeleteEmployee}
        handleSendFilter={handleFilterEmployee}
        handleSendFilterReset={handleFilterEmployeeReset}
      />
    ),
    102: (
      <div key="details-wrapper" className="responsive-grid">
        <Details key="details1"
          formColumnsData={detailsFormColumnsData}
          formEmployeeData={singleEmployeeDetailsData}
          handleSendSaveData={handleFormDataSave}
          />
      </div>
    ),
    103: (
      <PageGrid
        key="roleList"
        bodyData={userRolePageGridTable}
        handleSendAdd={handleSendAddUserRole}
        handleSendDelete={handleDeleteUserRole}
        handleSendUpdate={handleUpdateUserRole}
      />
    ),
    104: (
      <RolePermission />
    ),
    105: (
      <PageGrid
        key="departmentList"
        bodyData={departmentPageGridTable}
        handleSendAdd={handleSendAddDepartment}
        handleSendDelete={handleDeleteDepartment}
        handleSendUpdate={handleUpdateDepartment}
      />
    ),
  };
};
export default ComponentMap;