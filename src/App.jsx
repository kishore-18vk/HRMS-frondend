import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Recruitment from './pages/Recruitment';
import Payroll from './pages/Payroll';
import Settings from './pages/Settings';
import Holidays from './pages/Holidays';
import Onboarding from './pages/Onboarding';
import Performance from './pages/Performance';
import Documents from './pages/Documents';
import Organization from './pages/Organization';
import Assets from './pages/Assets';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="recruitment" element={<Recruitment />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leave" element={<Leave />} />
            <Route path="holidays" element={<Holidays />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="assets" element={<Assets />} />
            <Route path="performance" element={<Performance />} />
            <Route path="documents" element={<Documents />} />
            <Route path="organization" element={<Organization />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
