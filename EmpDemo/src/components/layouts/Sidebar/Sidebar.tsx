import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/layoutStyle.css";
import { AppDispatch, RootState } from "../../redux/store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { setActiveModule, setCurrentUserId, setIsDirtyTargetPath, setShowConfirmation } from "../../redux/reducer/combinedSlice.ts";
import * as FaIcons from "react-icons/fa";
import "../../assets/styles/sidebar.css";
import CustomTooltip from "../../customComponents/CustomTooltip/CustomTooltip.tsx";
import { ModulesList } from "../../data/AppData.ts";
import { useTranslation } from 'react-i18next';

export default function Sidebar({ isMinimized }) {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [sideBarMenu, setSideBarMenu] = useState(ModulesList);
  const [loginUserData, setLoginUserData] = useState<any>({})


  const {
    isDirty,
    isDirtyTargetPath,
    activeModule,
    errorMsg,
  } = useSelector((state: RootState) => ({
    isDirty: state.combined.isDirty,
    isDirtyTargetPath: state.combined.isDirtyTargetPath,
    activeModule: state.combined.activeModule,
    errorMsg: state.error.errorMsg,

  }));

  useEffect(() => {
    const getCachedLoginData = async () => { 
      try {
        const cache = await caches.open("login-cache");
        const response = await cache.match("/loginDetails");
        if (response) {
          const data = await response.json();
          dispatch(setCurrentUserId(data?.UserID));
          setLoginUserData(data); // sets the data into state
        }
      } catch (error) {
        console.error("Failed to get cached login data:", error);
      }
    };

     const matchedItem = sideBarMenu.find(item => item.Route === window.location.pathname);
    if (matchedItem) {
      dispatch(setActiveModule(matchedItem.Id as any));
    }

    getCachedLoginData();
  }, [dispatch]);

  const handleNavigation = (route: string, moduleId: any) => {
    if (isDirty) {
      dispatch(setShowConfirmation(true));
      dispatch(setIsDirtyTargetPath({ route, moduleId }));
    } else {
      navigate(route);
      dispatch(setActiveModule(moduleId));
    }
  };


  const CustomSidebarModuleButton = ({ text, icon, route, moduleId }) => {
    const IconComponent = FaIcons[icon];

    return (
      <div onClick={() => handleNavigation(route, moduleId)} 
      className={`menu-button ${activeModule === moduleId ? "active-menu" : ""} 
      ${isMinimized ? "menu-button-content" : ""}`}>
        <span className="sidebar-menu-icon">{IconComponent && <IconComponent />}</span>
        {!isMinimized && <span className="menu-text">{t(`Modules.${text}`)}</span>}
      </div>
    );
  }; 

  return (
   <aside id="sidebar" className={`sidebar-container ${isMinimized ? "minimized" : ""}`}>
      <div className="sidebar-menu-section">
        {sideBarMenu
          .filter(item => loginUserData?.ModuleIdList?.includes(item.Id))
          .map((item: any) => {
            const menuButton = (
              <CustomSidebarModuleButton
                key={item.Id}
                text={item.StrCode}
                icon={item.Icon}
                route={item.Route}
                moduleId={item.Id}
              />
            );

            return isMinimized ? (
              <CustomTooltip tooltipText={t(`Modules.${item.StrCode}`)} key={item.Id} placement="right">
                {menuButton}
              </CustomTooltip>
            ) : (
              <React.Fragment key={item.Id}>{menuButton}</React.Fragment>
            );
          })}
      </div>
    </aside>
  );
}