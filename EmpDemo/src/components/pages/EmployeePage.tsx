import { useEffect, useState } from "react";
import NestedTab from "../customComponents/NestedTabs/NestedTab.tsx";
import BsLabel from "../baseComponents/BsLabel.tsx";
import '../assets/styles/layoutStyle.css';
import TopButtonList from "../customComponents/BtnList/TopButtonList.tsx";
import '../assets/styles/example.css';
import { AppDispatch, RootState } from "../redux/store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeGridTableData, } from "../redux/reducer/employeePageSlice.ts";
import { fetchUserRolePageGridTable } from "../redux/reducer/userRoleSlice.ts";
import { Spinner } from 'react-bootstrap';
import { fetchDepartmentPageGridTable } from "../redux/reducer/departmentSlice.ts";
import { getDetailsStructureData, getSingleEmployeeDetails } from "../redux/reducer/detailsPageSlice.ts";
import { TabsListArray } from "../data/AppData.ts";
import ComponentMap from "../customComponents/ComponentMap/ComponentMap.tsx";
import { getFormCommonDropdownData } from "../redux/reducer/combinedSlice.ts";

const EmployeePage = () => {

  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    selectedTabId,
    employeeRecordData,
    currentUserId,
  } = useSelector((state: RootState): {
    selectedTabId: number | null;
    employeeRecordData: any,
    currentUserId: any;
  } => ({
    selectedTabId: state.combined.selectedTab,
    employeeRecordData: state.employeePage.employeeRecordData,
    currentUserId: state.combined.currentUserId,
  }));


  useEffect(() => {
    switch (selectedTabId) {
      case 2:
        // To Open Employee List Tab
        const payload = employeeRecordData
        // EmployeeDetails is Redux State which contains the filter Data and Pagination Data
        dispatch(fetchEmployeeGridTableData(payload));
        break;

      case 3:
        // To Open Employee Detail Tab 
        const detailPayload = {
          "TabIds": String(selectedTabId),
          "UserId": currentUserId
        }
        dispatch(getDetailsStructureData(detailPayload));
        const detailsDataPayload = {
          "RowId": employeeRecordData?.EmployeeIdList?.[0]
        }
        dispatch(getSingleEmployeeDetails(detailsDataPayload));
        const dropdownPayload = {
          "TabId": selectedTabId
        }
        dispatch(getFormCommonDropdownData(dropdownPayload));
        break;

      case 5:
        // To Open User Role Tab
        dispatch(fetchUserRolePageGridTable());
        break;

      case 7:
        // To Open Department Tab
        dispatch(fetchDepartmentPageGridTable());
        break;

      default:
        break;
    }
  }, [selectedTabId, employeeRecordData]);


  // custom spinner
  const CustomSpinner = () => {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <Spinner animation="border" variant="primary" />
    </div>
  }


  // Function to render the component based on the selected tab ID
  const renderComponent = (tabId: number | undefined) => {
    if (loading) return <CustomSpinner />;
    if (tabId === undefined) return <>No Child available.</>;
    const tab = TabsListArray.find(t => t.Id === tabId);
    const componentId = tab?.ComponentID;
    const mappedComponents = ComponentMap(); // Get the component map
    if (componentId && mappedComponents[componentId]) {
      return mappedComponents[componentId];
    }
    return <div>No component mapped for this tab.</div>;
  };





  return (
    <>
      <div className="employeepage">
        <div className="header-container">
          <h5>
            <BsLabel text={"Employee Record"} />
          </h5>
          <TopButtonList />
        </div>
      </div>



      <div className="nested-component">
        <NestedTab childrenComponent={
          <div className="content-display">
            {renderComponent(selectedTabId || 2)}
          </div>
        } />
      </div>
    </>
  );
};

export default EmployeePage;
