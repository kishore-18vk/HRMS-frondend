import React, { useEffect, useState } from 'react';
import {
    Clock, Play, LogOut, Coffee, Calendar, DollarSign, User,
    CheckCircle, XCircle, AlertCircle, Sparkles, Activity
} from 'lucide-react';
import { attendanceAPI, payrollAPI, employeeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
    const { user } = useAuth();

    // Clock & Check-in States
    const [currentTime, setCurrentTime] = useState(new Date());
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [workingTime, setWorkingTime] = useState('00:00:00');
    const [onBreak, setOnBreak] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Payroll & Profile
    const [latestPayroll, setLatestPayroll] = useState(null);
    const [profile, setProfile] = useState(null);

    // 1. Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Working time counter
    useEffect(() => {
        let interval;
        if (todayAttendance?.check_in && !todayAttendance?.check_out && !onBreak) {
            interval = setInterval(() => {
                const checkInTime = new Date(todayAttendance.check_in_datetime);
                const diff = Math.floor((new Date() - checkInTime) / 1000);
                const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
                const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
                const secs = String(diff % 60).padStart(2, '0');
                setWorkingTime(`${hrs}:${mins}:${secs}`);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [todayAttendance, onBreak]);

    // 3. Fetch initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [attendance, payroll] = await Promise.all([
                attendanceAPI.getToday(),
                payrollAPI.getByEmployee(user?.employee_id)
            ]);

            setTodayAttendance(attendance);
            if (Array.isArray(payroll) && payroll.length > 0) {
                setLatestPayroll(payroll[0]);
            } else {
                setLatestPayroll(payroll);
            }
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        setActionLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await attendanceAPI.checkIn();
            setTodayAttendance(result);
            setSuccess('Checked in successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to check in');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setActionLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await attendanceAPI.checkOut();
            setTodayAttendance(result);
            setSuccess('Checked out successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to check out');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBreak = () => setOnBreak(!onBreak);

    const formatTime = (date) => date.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });

    const formatDate = (date) => date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present': return <CheckCircle size={18} className="text-green" />;
            case 'Absent': return <XCircle size={18} className="text-red" />;
            case 'Working': return <Activity size={18} className="text-blue" />;
            case 'Half Day': return <AlertCircle size={18} className="text-orange" />;
            default: return <Clock size={18} />;
        }
    };

    const isCheckedIn = todayAttendance?.check_in && !todayAttendance?.check_out;
    const isCheckedOut = todayAttendance?.check_in && todayAttendance?.check_out;

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-vortex employee-dashboard">
            {/* Welcome & Time Widget */}
            <div className="vortex-top">
                <div className="welcome-card">
                    <div className="welcome-content">
                        <span className="welcome-badge"><Sparkles size={14} /> Welcome back</span>
                        <h1>Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name || 'Employee'}! 👋</h1>
                        <p>{formatDate(currentTime)}</p>
                    </div>
                    <div className="welcome-illustration">
                        <User size={80} strokeWidth={1} />
                    </div>
                </div>

                {/* Check In/Out Widget */}
                <div className="checkin-card">
                    <div className="checkin-header">
                        <div className="live-clock-vortex">
                            <Clock size={18} />
                            <span>{formatTime(currentTime)}</span>
                        </div>
                        <span className={`status-pill ${isCheckedIn ? 'active' : ''}`}>
                            {isCheckedIn ? '● Working' : isCheckedOut ? '● Completed' : '○ Not Started'}
                        </span>
                    </div>
                    <div className="checkin-body">
                        {isCheckedIn ? (
                            <>
                                <div className="timer-display">
                                    <span className="timer-label">Today's Work</span>
                                    <span className="timer-value">{workingTime}</span>
                                </div>
                                <div className="checkin-meta">
                                    <Clock size={14} /> Started at {todayAttendance?.check_in}
                                </div>
                            </>
                        ) : isCheckedOut ? (
                            <>
                                <div className="timer-display">
                                    <span className="timer-label">Completed</span>
                                    <span className="timer-value">{todayAttendance?.working_hours || '0h 0m'}</span>
                                </div>
                                <div className="checkin-meta">
                                    <CheckCircle size={14} /> Day completed at {todayAttendance?.check_out}
                                </div>
                            </>
                        ) : (
                            <div className="not-checked">
                                <span className="timer-label">Ready to start your day?</span>
                                <span className="timer-value">--:--:--</span>
                            </div>
                        )}
                    </div>

                    {error && <div className="checkin-error">{error}</div>}
                    {success && <div className="checkin-success">{success}</div>}

                    <div className="checkin-actions">
                        {!todayAttendance?.check_in ? (
                            <button
                                className="btn-checkin-vortex"
                                onClick={handleCheckIn}
                                disabled={actionLoading}
                            >
                                <Play size={16} /> {actionLoading ? 'Checking In...' : 'Check In'}
                            </button>
                        ) : !todayAttendance?.check_out ? (
                            <>
                                <button
                                    className={`btn-break-vortex ${onBreak ? 'active' : ''}`}
                                    onClick={handleBreak}
                                >
                                    <Coffee size={16} /> {onBreak ? 'Resume' : 'Break'}
                                </button>
                                <button
                                    className="btn-checkout-vortex"
                                    onClick={handleCheckOut}
                                    disabled={actionLoading}
                                >
                                    <LogOut size={16} /> {actionLoading ? 'Checking Out...' : 'Check Out'}
                                </button>
                            </>
                        ) : (
                            <div className="day-complete-badge">
                                <CheckCircle size={16} /> Day Complete
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="vortex-stats employee-stats">
                <div className="vortex-stat-card" style={{ '--card-gradient': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}>
                    <div className="stat-icon-wrap">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{todayAttendance?.working_hours || '0h 0m'}</span>
                        <span className="stat-title">Hours Today</span>
                    </div>
                </div>

                <div className="vortex-stat-card" style={{ '--card-gradient': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
                    <div className="stat-icon-wrap">
                        {getStatusIcon(todayAttendance?.status)}
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{todayAttendance?.status || 'Not Marked'}</span>
                        <span className="stat-title">Today's Status</span>
                    </div>
                </div>

                <div className="vortex-stat-card" style={{ '--card-gradient': 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)' }}>
                    <div className="stat-icon-wrap">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{formatCurrency(latestPayroll?.net_salary)}</span>
                        <span className="stat-title">Last Pay</span>
                    </div>
                </div>

                <div className="vortex-stat-card" style={{ '--card-gradient': 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' }}>
                    <div className="stat-icon-wrap">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <span className={`stat-number ${latestPayroll?.status === 'Paid' ? 'text-green' : 'text-orange'}`}>
                            {latestPayroll?.status || 'N/A'}
                        </span>
                        <span className="stat-title">Payroll Status</span>
                    </div>
                </div>
            </div>

            {/* Quick Links Grid */}
            <div className="vortex-grid employee-grid">
                <div className="vortex-card">
                    <div className="card-header">
                        <h3><Clock size={18} /> Today's Summary</h3>
                    </div>
                    <div className="summary-content">
                        <div className="summary-row">
                            <span>Check-in Time</span>
                            <strong>{todayAttendance?.check_in || '--:--'}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Check-out Time</span>
                            <strong>{todayAttendance?.check_out || '--:--'}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Total Hours</span>
                            <strong>{todayAttendance?.working_hours || '0h 0m'}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Status</span>
                            <span className={`status-badge ${todayAttendance?.status === 'Present' ? 'success' : 'warning'}`}>
                                {todayAttendance?.status || 'Not Marked'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="vortex-card">
                    <div className="card-header">
                        <h3><DollarSign size={18} /> Latest Payroll</h3>
                    </div>
                    <div className="summary-content">
                        {latestPayroll ? (
                            <>
                                <div className="summary-row">
                                    <span>Pay Period</span>
                                    <strong>{latestPayroll.pay_date || 'Current'}</strong>
                                </div>
                                <div className="summary-row">
                                    <span>Basic Salary</span>
                                    <strong>{formatCurrency(latestPayroll.basic_salary)}</strong>
                                </div>
                                <div className="summary-row">
                                    <span>Net Salary</span>
                                    <strong className="text-green">{formatCurrency(latestPayroll.net_salary)}</strong>
                                </div>
                                <div className="summary-row">
                                    <span>Status</span>
                                    <span className={`status-badge ${latestPayroll.status === 'Paid' ? 'success' : 'warning'}`}>
                                        {latestPayroll.status}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="no-data">No payroll records found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
