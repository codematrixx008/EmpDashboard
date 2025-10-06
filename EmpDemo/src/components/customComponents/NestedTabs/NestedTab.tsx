import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/nestedTab.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setShowConfirmation, setSelectedTab } from "../../redux/reducer/combinedSlice.ts";
import { fetchNestedTabsData } from "../../redux/reducer/employeePageSlice.ts";
import { TabsListArray } from "../../data/AppData.ts";
import { useTranslation } from 'react-i18next';
import CustomTooltip from "../CustomTooltip/CustomTooltip.tsx";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";


interface Tab {
  Id: number;
  TabName: string;
  StrCode: string;
}

interface ApiData {
  TabList: {
    ParentTabID: number;
    ChildTabIDList: string;
  }[];
  SelectedTabID: number;
  DisabledTabIDList: string;
}

interface TransformedTab {
  id: number;
  label: string | undefined;
  strCode: string;
  isParent: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  children: {
    id: number;
    label: string | undefined;
    strCode: string;
    isDisabled: boolean;
    isSelected: boolean;
  }[] | "";
}


export default function NestedTab({ childrenComponent }) {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const [tabsData, setTabsData] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [showParentScroll, setShowParentScroll] = useState(false);
  const [showChildScroll, setShowChildScroll] = useState(false);

  const parentTabRef = useRef<HTMLDivElement | null>(null);
  const childTabRef = useRef<HTMLDivElement | null>(null);

  const {
    nestedTabsData,
    selectedTab,
    isDirty,
    editDisabled,
    currentUserId,
    activeModule,
    employeeRecordData,

  } = useSelector((state: RootState): {
    nestedTabsData: any,
    selectedTab: any,
    isDirty: any,
    editDisabled: any,
    currentUserId: any,
    activeModule: any,
    employeeRecordData: any,
  } => ({
    nestedTabsData: state.employeePage.nestedTabsData,
    selectedTab: state.combined.selectedTab,
    isDirty: state.combined.isDirty,
    editDisabled: state.combined.editDisabled,
    currentUserId: state.combined.currentUserId,
    activeModule: state.combined.activeModule,
    employeeRecordData: state.employeePage.employeeRecordData,

  }));

  const transformTabs = (apiData: ApiData, tabsList: Tab[]): TransformedTab[] => {
    const tabMap = new Map(tabsList.map(tab => [tab.Id, { TabName: tab.TabName, StrCode: tab.StrCode }]));
    const disabledIds = (apiData.DisabledTabIDList || "")
      .split(",")
      .filter(Boolean)
      .map(id => Number(id));

    return apiData.TabList.map(tab => {
      const childIds = tab.ChildTabIDList?.split(",").filter(Boolean);
      const children = childIds.length
        ? childIds.map(id => {
          const numId = Number(id);
          return {
            id: numId,
            label: tabMap.get(numId)?.TabName,
            strCode: tabMap.get(numId)?.StrCode || `TAB_${numId}`,
            isDisabled: disabledIds.includes(numId),
            isSelected: apiData.SelectedTabID === numId,
          };
        })
        : "";

      return {
        id: tab.ParentTabID,
        label: tabMap.get(tab.ParentTabID)?.TabName,
        strCode: tabMap.get(tab.ParentTabID)?.StrCode || `TAB_${tab.ParentTabID}`,
        isParent: true,
        isSelected: apiData.SelectedTabID === tab.ParentTabID,
        isDisabled: disabledIds.includes(tab.ParentTabID),
        children,
      };
    });
  };




  useEffect(() => {
    if (currentUserId && activeModule) {
      const payload = {
        "UserId": currentUserId,
        "ModuleId": activeModule
      }
      dispatch(fetchNestedTabsData(payload));
    }
  }, [currentUserId, activeModule, dispatch]);


  useEffect(() => {
    if (nestedTabsData && nestedTabsData.IsSuccessful && nestedTabsData.Data !== null) {
      const formattedTabs = transformTabs(nestedTabsData.Data, TabsListArray);
      setTabsData(formattedTabs);

      const selectedId = nestedTabsData.Data.SelectedTabID;
      let foundParentId: number | null = null;
      let foundChildId: number | null = null;

      for (const parent of formattedTabs) {
        if (parent.id === selectedId) {
          foundParentId = parent.id;
          foundChildId = Array.isArray(parent.children) ? parent.children[0]?.id || null : null;
          break;
        }
        if (Array.isArray(parent.children)) {
          for (const child of parent.children) {
            if (child.id === selectedId) {
              foundParentId = parent.id;
              foundChildId = child.id;
              break;
            }
          }
        }
      }

      setSelectedParentId(foundParentId);
      setSelectedChildId(foundChildId);
      // if (foundChildId) dispatch(setSelectedTab(foundChildId));
      // ✅ Updated dispatch logic
      if (foundChildId) {
        dispatch(setSelectedTab(foundChildId));
      } else if (foundParentId) {
        dispatch(setSelectedTab(foundParentId));
      }

    }
  }, [nestedTabsData]);

  const checkOverflow = (
    ref: React.RefObject<HTMLDivElement | null>,
    setShowScroll: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (ref.current) {
      setShowScroll(ref.current.scrollWidth > ref.current.clientWidth);
    } else {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    checkOverflow(parentTabRef, setShowParentScroll);
    checkOverflow(childTabRef, setShowChildScroll);
  }, [selectedParentId, selectedChildId, tabsData]);

  const scrollTabs = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === "left" ? -100 : 100, behavior: "smooth" });
    }
  };

  // select the tab on the basis of selectedTab
  useEffect(() => {
    if (!tabsData.length || selectedTab == null) return;

    let newParentId: number | null = null;
    let newChildId: number | null = null;

    for (const parent of tabsData) {
      /* ⇢ selected tab IS a parent  */
      if (parent.id === selectedTab) {
        newParentId = parent.id;
        newChildId =
          Array.isArray(parent.children) && parent.children.length
            ? parent.children[0].id
            : null;
        break;
      }
      /* ⇢ selected tab IS a child  */
      if (Array.isArray(parent.children)) {
        const hit = parent.children.find((c) => c.id === selectedTab);
        if (hit) {
          newParentId = parent.id;
          newChildId = hit.id;
          break;
        }
      }
    }
    setSelectedParentId((prev) => (prev !== newParentId ? newParentId : prev));
    setSelectedChildId((prev) => (prev !== newChildId ? newChildId : prev));
  }, [selectedTab, tabsData]);

  return (
    <div className="nested-tab-container">
      {/* Parent Tabs */}
      <div className="tab-navigation">
        <div ref={parentTabRef} className="scrollable-tabs">
          {tabsData.map((tab, index) => (
            <div
              style={{ overflow: "visible" }}
              key={tab.id}
              // title={t(`TABS.${tab.strCode}`)}
              className={`tab ${selectedParentId === tab.id ? "active-tab" : ""}
               ${tab.isDisabled ? "disabled-tab" : ""}`}
              onClick={() => {
                if (tab.isDisabled) return;
                if (isDirty) {
                  dispatch(setShowConfirmation(true));
                } else {
                  setSelectedParentId(tab.id);

                  if (tab.children.length > 0) {
                    const firstChildId = tab.children[0]?.id || null;
                    setSelectedChildId(firstChildId);
                    if (firstChildId) dispatch(setSelectedTab(firstChildId));
                  } else {
                    setSelectedChildId(null);
                    dispatch(setSelectedTab(tab?.id));
                  }
                }
              }}
            >
              {/* {t(`TABS.${tab.strCode}`)} */}
              <CustomTooltip tooltipText={t(`TABS.${tab.strCode}`)} placement="bottom">
                {t(`TABS.${tab.strCode}`)}
              </CustomTooltip>

              {/* <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-${tab.id}`} style={{ background: "transparent", boxShadow: "none" }}>
                    {t(`TABS.${tab.strCode}`)}
                  </Tooltip>
                }
              >
                <span>{t(`TABS.${tab.strCode}`)}</span>
              </OverlayTrigger> */}
            </div>
          ))}
        </div>

        {showParentScroll && (
          <div className="scroll-btn-container">
            <button className="scroll-btn" onClick={() => scrollTabs(parentTabRef, "left")}><ChevronLeft /></button>
            <button className="scroll-btn" onClick={() => scrollTabs(parentTabRef, "right")}><ChevronRight /></button>
          </div>
        )}
      </div>

      {/* Child Tabs */}
      {tabsData.find(tab => tab.id === selectedParentId)?.children && (

        <div className="tab-navigation child-tab-container">
          <div ref={childTabRef} className="scrollable-tabs">
            {tabsData
              .find(tab => tab.id === selectedParentId)
              ?.children.map(child => {
                const isChildIdCondition = child.id === 3;
                const isDisabledCondition = child.isDisabled || (isChildIdCondition && employeeRecordData?.EmployeeIdList?.length !== 1);

                return (
                  <div
                    key={child.id}
                    className={`tab ${selectedChildId === child.id ? "active-child-tab" : ""} 
                    ${isDisabledCondition ? "disabled-tab" : ""}`}
                    onClick={() => {
                      if (isDisabledCondition) return;
                      if (isDirty) {
                        dispatch(setShowConfirmation(true));
                      } else {
                        setSelectedChildId(child.id);
                        dispatch(setSelectedTab(child.id));
                      }
                    }}
                  >
                    <CustomTooltip tooltipText={t(`TABS.${child.strCode}`)} placement="bottom">
                      {t(`TABS.${child.strCode}`)}
                    </CustomTooltip >
                  </div>
                )
              })}
          </div>
          {showChildScroll && (
            <>
              <button className="scroll-btn" onClick={() => scrollTabs(childTabRef, "left")}><ChevronLeft /></button>
              <button className="scroll-btn" onClick={() => scrollTabs(childTabRef, "right")}><ChevronRight /></button>
            </>
          )}
        </div>
      )}


      {childrenComponent}
    </div>
  );
}


