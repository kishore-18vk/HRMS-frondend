import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Coffee, Calendar } from 'lucide-react';
import { attendanceAPI } from '../services/api'; // Import your API helper

// Map icon strings from backend to components
const ICON_MAP = {
  'check': CheckCircle,
  'x': XCircle,
  'coffee': Coffee,
  'clock': Clock
};

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [summaryStats, setSummaryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default to today's date
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch Data
  useEffect(() => {
    loadData();
  }, [selectedDate]); // Re-run when date changes

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
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'danger';
      case 'On Leave': return 'warning';
      case 'Late': return 'info'; // Use info style for Late
      case 'Working': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <div className="attendance-page page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Track and manage employee attendance</p>
        </div>
        <div className="date-picker">
          <Calendar size={18} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        {summaryStats.map((stat, index) => {
          const Icon = ICON_MAP[stat.icon] || CheckCircle;
          return (
            <div key={index} className="summary-card">
              <div className="summary-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="summary-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Attendance Log ({selectedDate})</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.employee_name}</strong><br/>
                      <span style={{fontSize: '0.8em', color: '#666'}}>{record.employee_id}</span>
                    </td>
                    <td>{record.date}</td>
                    <td>{record.check_in || '-'}</td>
                    <td>{record.check_out || '-'}</td>
                    <td>{record.working_hours || '-'}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#888'}}>No records found for this date.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;