import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, Coffee, AlertCircle, Download } from 'lucide-react';
import { attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyAttendance = () => {
    const { user } = useAuth();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7) // YYYY-MM format
    );
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        totalHours: '0h 0m'
    });

    useEffect(() => {
        loadAttendance();
    }, [selectedMonth]);

    const loadAttendance = async () => {
        setLoading(true);
        try {
            const report = await attendanceAPI.getReport(selectedMonth);
            if (Array.isArray(report)) {
                setAttendanceRecords(report);
                calculateStats(report);
            } else if (report.records) {
                setAttendanceRecords(report.records);
                setStats(report.stats || calculateStats(report.records));
            }
        } catch (err) {
            console.error('Error loading attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (records) => {
        const stats = {
            present: 0,
            absent: 0,
            late: 0,
            halfDay: 0,
            totalHours: 0
        };

        records.forEach(record => {
            if (record.status === 'Present') stats.present++;
            else if (record.status === 'Absent') stats.absent++;
            else if (record.status === 'Late') stats.late++;
            else if (record.status === 'Half Day') stats.halfDay++;

            // Parse working hours
            if (record.working_hours) {
                const match = record.working_hours.match(/(\d+)h\s*(\d+)m/);
                if (match) {
                    stats.totalHours += parseInt(match[1]) + parseInt(match[2]) / 60;
                }
            }
        });

        stats.totalHours = `${Math.floor(stats.totalHours)}h ${Math.round((stats.totalHours % 1) * 60)}m`;
        setStats(stats);
        return stats;
    };

    const getStatusColor = (status) => {
        const colors = {
            'Present': 'success',
            'Absent': 'danger',
            'Late': 'warning',
            'Half Day': 'orange',
            'On Leave': 'info',
            'Working': 'primary'
        };
        return colors[status] || 'secondary';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present': return <CheckCircle size={16} />;
            case 'Absent': return <XCircle size={16} />;
            case 'Late': return <AlertCircle size={16} />;
            case 'Half Day': return <Coffee size={16} />;
            case 'On Leave': return <Calendar size={16} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className="page-content my-attendance-page">
            <div className="page-header">
                <div>
                    <h1>My Attendance</h1>
                    <p>View your attendance history and statistics</p>
                </div>
                <div className="header-actions">
                    <div className="month-picker">
                        <Calendar size={18} />
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid four-cols">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.present}</h3>
                        <p>Present Days</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                        <XCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.absent}</h3>
                        <p>Absent Days</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#f9731620', color: '#f97316' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.late + stats.halfDay}</h3>
                        <p>Late / Half Days</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#7c3aed20', color: '#7c3aed' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalHours}</h3>
                        <p>Total Hours</p>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="table-card">
                <div className="table-header">
                    <h3>Attendance Records - {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                    <span className="record-count">{attendanceRecords.length} records</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Working Hours</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center p-4">
                                        <div className="loader-small"></div> Loading...
                                    </td>
                                </tr>
                            ) : attendanceRecords.length > 0 ? (
                                attendanceRecords.map((record, index) => (
                                    <tr key={record.id || index}>
                                        <td>
                                            <span className="date-cell">
                                                {new Date(record.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="time-cell checkin">{record.check_in || '--:--'}</span>
                                        </td>
                                        <td>
                                            <span className="time-cell checkout">{record.check_out || '--:--'}</span>
                                        </td>
                                        <td>
                                            <span className="hours-cell">{record.working_hours || '0h 0m'}</span>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${getStatusColor(record.status)}`}>
                                                {getStatusIcon(record.status)} {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-cell">
                                        No attendance records found for this month.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyAttendance;
