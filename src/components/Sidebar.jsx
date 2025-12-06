import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Clock, Calendar, DollarSign,
  Briefcase, Award, FileText, Settings, CalendarDays,
  UserPlus, ClipboardList, Building
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/employees', icon: Users, label: 'Employees' },
  { path: '/recruitment', icon: UserPlus, label: 'Recruitment' },
  { path: '/onboarding', icon: ClipboardList, label: 'Onboarding' },
  { path: '/attendance', icon: Clock, label: 'Attendance' },
  { path: '/leave', icon: Calendar, label: 'Leave' },
  { path: '/holidays', icon: CalendarDays, label: 'Holidays' },
  { path: '/payroll', icon: DollarSign, label: 'Payroll' },
  { path: '/assets', icon: Briefcase, label: 'Assets' },
  { path: '/performance', icon: Award, label: 'Performance' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/organization', icon: Building, label: 'Organization' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">H</div>
        {isOpen && <span className="logo-text">HORILLA</span>}
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

