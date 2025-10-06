import React, { useState } from 'react'
import Header from '../Header/Header.tsx'
import Sidebar from '../Sidebar/Sidebar.tsx'
import Footer from '../Footer/Footer.tsx'
import { Outlet } from 'react-router-dom';

export default function MainContent() {
   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarMinimized(!isSidebarMinimized);
    };


    return (
        <div className="layout">
            <Header toggleSidebar={toggleSidebar} />
            <div className="middle-container">
                <Sidebar isMinimized={isSidebarMinimized} />
                <main className="multi-content-container">
                    <Outlet /> {/* Renders Dashboard or other child route content */}
                </main>
            </div>
            <Footer />
        </div>
    )
}

