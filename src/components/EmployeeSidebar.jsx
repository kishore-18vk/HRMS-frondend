import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Clock, DollarSign, User, Settings, Zap
} from 'lucide-react';

const employeeMenuItems = [
    { path: '/employee-dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { path: '/my-attendance', icon: Clock, label: 'My Attendance', badge: null },
    { path: '/my-payroll', icon: DollarSign, label: 'My Payroll', badge: null },
    { path: '/my-profile', icon: User, label: 'My Profile', badge: null },
    { path: '/employee-settings', icon: Settings, label: 'Settings', badge: null },
];

const EmployeeSidebar = ({ isOpen }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <Zap size={22} strokeWidth={2.5} />
                </div>
                {isOpen && <span className="logo-text">VORTEX</span>}
            </div>

            <nav className="sidebar-nav">
                {employeeMenuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        {isOpen && (
                            <>
                                <span>{item.label}</span>
                                {item.badge && <span className="nav-badge">{item.badge}</span>}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {isOpen && (
                <div className="sidebar-footer">
                    <div className="upgrade-card employee-card">
                        <div className="upgrade-icon">👤</div>
                        <div className="upgrade-text">
                            <span className="upgrade-title">Employee Portal</span>
                            <span className="upgrade-subtitle">Self-service access</span>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default EmployeeSidebar;
