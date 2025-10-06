import React, { useState, useEffect, useRef } from "react";
import { AppName, searchDropDownData } from '../../data/Data.ts';
import { Bell, CircleUserRound, Globe, House, Languages, LogOut, Plus, Search, User } from "lucide-react";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from '../../redux/store/store';
import "../../assets/styles/header.css";
import CustomTooltip from "../../customComponents/CustomTooltip/CustomTooltip.tsx";
import { useTranslation } from 'react-i18next';
import { LanguageList } from "../../data/AppData.ts";
import { setActiveModule } from "../../redux/reducer/combinedSlice.ts";
import Cookies from "js-cookie";

export default function Header({ toggleSidebar }) {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const {
    errorMsg
  } = useSelector((state: RootState) => ({
    errorMsg: state.error.errorMsg,
  }));


  useEffect(() => {
    // get the current language from the cache and set it
    const getCachedLanguageData = async () => {
      try {
        const cache = await caches.open("login-cache");
        const response = await cache.match("/selectedLanguage");
        if (response) {
          const data = await response.json();
          const langData = LanguageList.find(
            (lang) => lang.ID === data.SelectedLanguageId
          );
          if (langData) {
            changeLanguage(langData.LanguageCode);
          }
        }
      } catch (error) {
        console.error("Failed to get cached login data:", error);
      }
    };
    getCachedLanguageData();
  }, []);

  const changeDropdownLanguage = (ID:any, Code:any) => {
    // change current language and set the current language in cache
    changeLanguage(Code);
    caches.open("login-cache").then(cache => {
      const languageResponse = new Response(JSON.stringify({
        SelectedLanguageId: ID
      }), {
        headers: { "Content-Type": "application/json" }
      });
      cache.put("/selectedLanguage", languageResponse);
    });
  }


const handleLogout = async () => {
  try {
    // Remove cookies
    Cookies.remove("Token", { path: "/" });
    Cookies.remove("RefreshToken", { path: "/" });

    // Delete from cache
    const cacheNames = await caches.keys();
    for (const name of cacheNames) {
      if (name === "login-cache") {
        const cache = await caches.open(name);
        await cache.delete("/loginDetails");
        await cache.delete("/selectedLanguage");
      }
    }
  } catch (err) {
    console.error("Logout cleanup failed:", err);
  }

  navigate("/login");
};




  return (
    <header>
      <div className="header-main-container">
        <div className="header-main-left">
          <h3 className="header-name"> {AppName}</h3>

          <CustomTooltip tooltipText={t('HEADER.TOGGLE_SIDEBAR')}>
            <button className="header-btn" id="burger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </CustomTooltip>
        </div>

        <div className="icon-buttons">
          <CustomTooltip tooltipText={t('HEADER.NOTIFICATIONS')} placement="bottom">
            <button className="ct-dropdown-button">
              <Bell />
            </button>
          </CustomTooltip>

          {/*<CustomTooltip tooltipText={t('HEADER.PROFILE')}>
            <button className="ct-dropdown-button">
              <User />
            </button>
          </CustomTooltip> */}

          <Dropdown>
            <CustomTooltip tooltipText={t('HEADER.PROFILE')}>
              <Dropdown.Toggle variant="light" className="ct-dropdown-button">
                <User size={16} strokeWidth={2} />
              </Dropdown.Toggle>
            </CustomTooltip>

            <Dropdown.Menu>
              <Dropdown.Item href="#">
                <CircleUserRound size={16} style={{ marginRight: 8 }} />
                <span>Profile</span>
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={handleLogout}>
                <LogOut size={16} style={{ marginRight: 8 }} />
                <span>Log Out</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>
      </div>
    </header>

  );
}