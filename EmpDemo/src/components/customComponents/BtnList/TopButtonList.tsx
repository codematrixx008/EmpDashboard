import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import { setButtonStates } from "../../redux/reducer/combinedSlice.ts";
import { getTabButtonListData } from "../../redux/reducer/employeePageSlice.ts";
import {
  FaUsers, FaCalendarAlt, FaBriefcase, FaChartBar, FaShieldAlt,
  FaMoneyBill, FaTools, FaCogs, FaWrench, FaLink,
  FaPlus, FaEdit, FaTrash, FaSearch, FaFileCsv,
  FaFileExcel, FaFilePdf, FaEye, FaSave, FaTimes,
  FaArrowLeft, FaArrowRight
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { MenuListArray } from "../../data/AppData.ts";
import { useTranslation } from 'react-i18next';
import CustomTooltip from "../CustomTooltip/CustomTooltip.tsx";

const iconMap: Record<string, any> = {
  FaUsers: <FaUsers />,
  FaCalendarAlt: <FaCalendarAlt />,
  FaBriefcase: <FaBriefcase />,
  FaChartBar: <FaChartBar />,
  FaShieldAlt: <FaShieldAlt />,
  FaMoneyBill: <FaMoneyBill />,
  FaTools: <FaTools />,
  FaCogs: <FaCogs />,
  FaWrench: <FaWrench />,
  FaLink: <FaLink />,
  FaPlus: <FaPlus style={{ color: "#6a1b9a" }} />,
  FaEdit: <FaEdit style={{ color: "#04B2D9" }} />,
  FaTrash: <FaTrash style={{ color: "#f38375" }} />,
  FaFileCsv: <FaFileCsv style={{ color: "#e65100" }} />,
  FaFileExcel: <FaFileExcel style={{ color: "#1e3a8a" }} />,
  FaFilePdf: <FaFilePdf style={{ color: "#F25E86" }} />,
  IoMdSettings: <IoMdSettings style={{ color: "#212121B3" }} />,
  GiHamburgerMenu: <GiHamburgerMenu style={{ color: "#000000" }} />,
  FaSave: <FaSave style={{ color: "#038C25" }} />,
  FaTimes: <FaTimes style={{ color: "#f38375" }} />,
  FaSearch: <FaSearch style={{ color: "#00796B" }} />,
  FaEye: <FaEye />,
  FaArrowLeft: <FaArrowLeft />,
  FaArrowRight: <FaArrowRight />
};



const TopButtonList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const [filteredButtons, setFilteredButtons] = useState<any[]>([]);

  const {
    buttonStates,
    editDisabled,
    deleteDisabled,
    saveDisabled,
    cancelDisabled,
    tabButtonListData,
    selectedTab,
    currentUserId,
  } = useSelector((state: RootState): {
    buttonStates: any;
    editDisabled: any;
    deleteDisabled: any;
    saveDisabled: any;
    cancelDisabled: any;
    tabButtonListData: any;
    selectedTab: any;
    currentUserId: any;
  } => ({
    buttonStates: state.combined.buttonStates,
    editDisabled: state.combined.editDisabled,
    deleteDisabled: state.combined.deleteDisabled,
    saveDisabled: state.combined.saveDisabled,
    cancelDisabled: state.combined.cancelDisabled,
    tabButtonListData: state.employeePage.tabButtonListData,
    selectedTab: state.combined.selectedTab,
    currentUserId: state.combined.currentUserId,
  }));


  useEffect(() => {
    if (selectedTab && currentUserId) {
      const payload = {
        "UserId": currentUserId,
        "SelectedTabId": selectedTab
      }
      dispatch(getTabButtonListData(payload));
      // call api to get the menu list data
    }
  }, [selectedTab, currentUserId]);


  useEffect(() => {
    if (tabButtonListData && tabButtonListData.IsSuccessful && tabButtonListData.Data !== null) {

      const rawMenuList = tabButtonListData.Data.MenuList; // e.g., "1-0,2-1,3-0"
      const dynamicInitialState: Record<string, boolean> = {};

      // Parse menuId and its status into a Map
      const enabledMap = rawMenuList.split(",").reduce((acc: Record<number, boolean>, item: string) => {
        const [id, status] = item.split("-").map(str => str.trim());
        acc[parseInt(id)] = status === "1";
        return acc;
      }, {});

      // Only show buttons that exist in the rawMenuList
      const processed = MenuListArray
        .filter(menu => enabledMap.hasOwnProperty(menu.ID)) // keep only mentioned IDs
        .map(menu => {
          const isEnabled = enabledMap[menu.ID];
          dynamicInitialState[menu.MenuName] = false;
          return {
            Id: menu.ID,
            Name: menu.MenuName,
            StrCode: menu.StrCode,
            Icon: menu.Icon,
            OrderNo: menu.Order,
            isEnabled,
          };
        })
        .sort((a, b) => a.OrderNo - b.OrderNo);

      setFilteredButtons(processed);
      dispatch(setButtonStates(dynamicInitialState));
    } else {
      setFilteredButtons([]);
    }
  }, [tabButtonListData, selectedTab, dispatch]);


  const popupColumnRef = useRef<HTMLDivElement>(null);
  const [showBtnVisiblePopUp, setShowBtnVisiblePopUp] = useState<boolean>(false);

  const handleMenuBtnVisiblePopup = () => {
    setShowBtnVisiblePopUp((prevState) => !prevState);
  };

  const handleClickOutsideColumns = (event: MouseEvent) => {
    if (popupColumnRef.current && !popupColumnRef.current.contains(event.target as Node)) {
      setShowBtnVisiblePopUp(false);
    }
  };

  useEffect(() => {
    if (showBtnVisiblePopUp) {
      document.addEventListener('mousedown', handleClickOutsideColumns);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideColumns);
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideColumns);
  }, [showBtnVisiblePopUp]);


  return (

    <div className="top-buttons-container" style={{ position: "relative" }}>

      {filteredButtons.map(({ Id, Name, Icon, isEnabled, StrCode }) => {
        const isDisabled = !isEnabled || buttonStates[Name] ||
          (Name === "Edit" && editDisabled) ||
          (Name === "Delete" && deleteDisabled) ||
          (Name === "Save" && saveDisabled) ||
          (Name === "Cancel" && cancelDisabled);
        return (
         <CustomTooltip tooltipText={t(`MENU_NAME.${StrCode}`)} key={Id}>
            <button
              key={Id}
              onClick={() => {
                if (Id == 13) {
                  handleMenuBtnVisiblePopup()
                } else {
                  dispatch(setButtonStates({ [Name]: true }))
                }
              }}
              disabled={isDisabled}
              className="top-buttons-single-btn"
              style={{
                backgroundColor: isDisabled ? "#e6e6e6" : "whitesmoke",
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              {iconMap[Icon] ?? null}
            </button>
          </CustomTooltip>
        );
      })}

      {showBtnVisiblePopUp && (
        <div ref={popupColumnRef} className="all-menus-top-btn-container">
          <div className="all-menu-inner-top-btn-container">
            {filteredButtons.filter((data: any) => data.Id !== 13).map(({ Id, Name, Icon, isEnabled, StrCode }) => {
              const isDisabled = !isEnabled || buttonStates[Name] ||
                (Name === "Edit" && editDisabled) ||
                (Name === "Delete" && deleteDisabled) ||
                (Name === "Save" && saveDisabled) ||
                (Name === "Cancel" && cancelDisabled);

              return (
                <button
                  key={Id}
                  className='all-menu-top-btn-container-btns'
                  onClick={() => dispatch(setButtonStates({ [Name]: true }))}
                  disabled={isDisabled}
                >
                  <span className='all-menu-top-btn-container-icon'>
                    {iconMap[Icon] ?? null}
                  </span>
                  <span className='all-menu-top-btn-container-text'>
                    {t(`MENU_NAME.${StrCode}`)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopButtonList;
