import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Coffee, Calendar, LogIn, LogOut, Timer, Search } from 'lucide-react';
import { attendanceAPI } from '../services/api';

const ICON_MAP = { 'check': CheckCircle, 'x': XCircle, 'coffee': Coffee, 'clock': Clock };

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [summaryStats, setSummaryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { loadData(); }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [records, stats] = await Promise.all([
        attendanceAPI.getAll(selectedDate),
        attendanceAPI.getStats(selectedDate)
      ]);
      setAttendanceRecords(records);
      setSummaryStats(stats);
    } catch (error) {
      console.error("Error loading attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'Present': 'success', 'Absent': 'danger', 'On Leave': 'warning', 'Late': 'late', 'Working': 'primary' };
    return colors[status] || 'secondary';
  };

  const filteredRecords = attendanceRecords.filter(r =>
    r.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <div className="attendance-modern">
      {/* Header */}
      <div className="attendance-header">
        <div className="header-left">
          <h1>Attendance</h1>
          <p>Track and manage employee attendance</p>
        </div>
        <div className="header-right">
          <div className="live-time-badge">
            <Clock size={16} />
            <span>{formatTime(currentTime)}</span>
          </div>
          <div className="date-picker-modern">
            <Calendar size={16} />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="attendance-stats">
        {summaryStats.map((stat, index) => {
          const Icon = ICON_MAP[stat.icon] || CheckCircle;
          return (
            <div key={index} className="att-stat-card">
              <div className="att-stat-icon" style={{ background: `linear-gradient(135deg, ${stat.color}40 0%, ${stat.color}20 100%)` }}>
                <Icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="att-stat-info">
                <span className="att-stat-value">{stat.value}</span>
                <span className="att-stat-label">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="attendance-table-card">
        <div className="table-toolbar">
          <div className="table-title">
            <h3>Attendance Log</h3>
            <span className="record-count">{filteredRecords.length} records</span>
          </div>
          <div className="table-actions">
            <div className="search-input">
              <Search size={16} />
              <input type="text" placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th><LogIn size={14} /> Check In</th>
                <th><LogOut size={14} /> Check Out</th>
                <th><Timer size={14} /> Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading-cell"><div className="loader-small"></div>Loading...</td></tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="emp-avatar">{record.employee_name?.charAt(0) || 'E'}</div>
                        <div className="emp-info">
                          <strong>{record.employee_name}</strong>
                          <span>{record.employee_id}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="date-cell">{record.date}</span></td>
                    <td><span className="time-cell checkin">{record.check_in || '--:--'}</span></td>
                    <td><span className="time-cell checkout">{record.check_out || '--:--'}</span></td>
                    <td><span className="hours-cell">{record.working_hours || '0h 0m'}</span></td>
                    <td><span className={`status-pill ${getStatusColor(record.status)}`}>{record.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="empty-cell">No attendance records found for this date.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;