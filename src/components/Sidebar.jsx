import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Clock, Calendar, DollarSign,
  Briefcase, Award, FileText, Settings, CalendarDays,
  UserPlus, ClipboardList, Building, Zap
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { path: '/employees', icon: Users, label: 'Employees', badge: null },
  { path: '/recruitment', icon: UserPlus, label: 'Recruitment', badge: '3' },
  { path: '/onboarding', icon: ClipboardList, label: 'Onboarding', badge: null },
  { path: '/attendance', icon: Clock, label: 'Attendance', badge: null },
  { path: '/leave', icon: Calendar, label: 'Leave', badge: '5' },
  { path: '/holidays', icon: CalendarDays, label: 'Holidays', badge: null },
  { path: '/payroll', icon: DollarSign, label: 'Payroll', badge: null },
  { path: '/assets', icon: Briefcase, label: 'Assets', badge: null },
  { path: '/performance', icon: Award, label: 'Performance', badge: null },
  { path: '/documents', icon: FileText, label: 'Documents', badge: null },
  { path: '/organization', icon: Building, label: 'Organization', badge: null },
  { path: '/settings', icon: Settings, label: 'Settings', badge: null },
];

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap size={22} strokeWidth={2.5} />
        </div>
        {isOpen && <span className="logo-text">VORTEX</span>}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
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
          <div className="upgrade-card">
            <div className="upgrade-icon">⚡</div>
            <div className="upgrade-text">
              <span className="upgrade-title">Vortex Pro</span>
              <span className="upgrade-subtitle">Unlock all features</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

