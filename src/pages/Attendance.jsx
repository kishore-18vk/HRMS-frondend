import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Coffee, Calendar } from 'lucide-react';

const attendanceRecords = [
  { id: 1, name: 'John Doe', date: '2024-12-06', checkIn: '09:00', checkOut: '18:00', status: 'Present', hours: '9h 0m' },
  { id: 2, name: 'Jane Smith', date: '2024-12-06', checkIn: '09:15', checkOut: '18:30', status: 'Present', hours: '9h 15m' },
  { id: 3, name: 'Mike Johnson', date: '2024-12-06', checkIn: '08:45', checkOut: '17:45', status: 'Present', hours: '9h 0m' },
  { id: 4, name: 'Emily Brown', date: '2024-12-06', checkIn: '-', checkOut: '-', status: 'On Leave', hours: '-' },
  { id: 5, name: 'David Wilson', date: '2024-12-06', checkIn: '09:30', checkOut: '18:00', status: 'Late', hours: '8h 30m' },
  { id: 6, name: 'Sarah Davis', date: '2024-12-06', checkIn: '-', checkOut: '-', status: 'Absent', hours: '-' },
  { id: 7, name: 'Chris Miller', date: '2024-12-06', checkIn: '09:00', checkOut: '17:30', status: 'Early Leave', hours: '8h 30m' },
  { id: 8, name: 'Lisa Anderson', date: '2024-12-06', checkIn: '09:00', checkOut: '-', status: 'Working', hours: '-' },
];

const summaryStats = [
  { label: 'Present', value: 142, icon: CheckCircle, color: '#22c55e' },
  { label: 'Absent', value: 6, icon: XCircle, color: '#ef4444' },
  { label: 'On Leave', value: 8, icon: Coffee, color: '#f59e0b' },
  { label: 'Late', value: 4, icon: Clock, color: '#6366f1' },
];

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'danger';
      case 'On Leave': return 'warning';
      case 'Late': return 'info';
      case 'Early Leave': return 'info';
      case 'Working': return 'primary';
      default: return '';
    }
  };

  return (
    <div className="attendance-page">
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

      <div className="summary-cards">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="summary-card">
            <div className="summary-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="summary-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3>Today's Attendance</h3>
        </div>
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
            {attendanceRecords.map((record) => (
              <tr key={record.id}>
                <td><strong>{record.name}</strong></td>
                <td>{record.date}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td>{record.hours}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;

