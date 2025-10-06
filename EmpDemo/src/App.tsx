import React, { useEffect, useState } from "react";
import "./components/assets/styles/baseComponents.css"
import Header from './components/layouts/Header/Header.tsx';
import Sidebar from './components/layouts/Sidebar/Sidebar.tsx';
import Footer from './components/layouts/Footer/Footer.tsx';
import MainContent from "./components/layouts/MainContent/MainContent.tsx";
import "./components/assets/styles/layout.css";
import "./components/assets/styles/layoutStyle.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/pages/Login/Login.tsx";
import Dashboard from "./components/pages/Dashboard.tsx";
import Demo from "./components/pages/Demo.tsx";
import EmployeePage from "./components/pages/EmployeePage.tsx";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "./components/redux/store/store.ts";
import ProtectedRoutes from "./components/customComponents/ProtectedRoutes/ProtectedRoutes.tsx";


const App = () => {
  const errorMsg = useSelector((state: RootState) => state.error.errorMsg) as { IsSuccessful: boolean; ErrorMessage: string } | null;
 

  useEffect(() => {
    // Display error message if it exists
    if (errorMsg && !errorMsg?.IsSuccessful) {
      toast.error(errorMsg?.ErrorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [errorMsg]);

  return (
    <>
 <Router>
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainContent />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employee-records" element={<EmployeePage />} />
          <Route path="demo" element={<Demo />} />
          <Route path="*" element={<div>No Data Found</div>} />
        </Route>
      </Route>
    </Routes>
  </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        // newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />
    </>
  );
}

export default App;