import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployeeSidebar from '../components/EmployeeSidebar';
import Header from '../components/Header';

const EmployeeLayout = () => {
    const { isAuthenticated, user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If admin tries to access employee layout, redirect to admin dashboard
    if (user?.role === 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <EmployeeSidebar isOpen={sidebarOpen} />
            <div className="main-content">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default EmployeeLayout;
