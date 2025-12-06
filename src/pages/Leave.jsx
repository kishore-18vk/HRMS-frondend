import { useState } from 'react';
import { Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const leaveRequests = [
  { id: 1, name: 'John Doe', type: 'Annual Leave', from: '2024-12-10', to: '2024-12-15', days: 5, status: 'Pending', reason: 'Family vacation' },
  { id: 2, name: 'Jane Smith', type: 'Sick Leave', from: '2024-12-05', to: '2024-12-06', days: 2, status: 'Approved', reason: 'Medical appointment' },
  { id: 3, name: 'Mike Johnson', type: 'Annual Leave', from: '2024-12-20', to: '2024-12-25', days: 5, status: 'Pending', reason: 'Christmas holiday' },
  { id: 4, name: 'Emily Brown', type: 'Personal Leave', from: '2024-12-08', to: '2024-12-08', days: 1, status: 'Approved', reason: 'Personal matters' },
  { id: 5, name: 'David Wilson', type: 'Annual Leave', from: '2024-12-12', to: '2024-12-14', days: 3, status: 'Rejected', reason: 'Trip planning' },
];

const leaveStats = [
  { label: 'Pending', value: 8, color: '#f59e0b' },
  { label: 'Approved', value: 24, color: '#22c55e' },
  { label: 'Rejected', value: 3, color: '#ef4444' },
];

const Leave = () => {
  const [filter, setFilter] = useState('All');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      default: return 'warning';
    }
  };

  const filteredRequests = filter === 'All' 
    ? leaveRequests 
    : leaveRequests.filter(r => r.status === filter);

  return (
    <div className="leave-page">
      <div className="page-header">
        <div>
          <h1>Leave Management</h1>
          <p>Manage employee leave requests</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} /> Request Leave
        </button>
      </div>

      <div className="leave-stats">
        {leaveStats.map((stat) => (
          <div key={stat.label} className="leave-stat-card" style={{ borderLeftColor: stat.color }}>
            <h3>{stat.value}</h3>
            <p>{stat.label} Requests</p>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3>Leave Requests</h3>
          <div className="filter-tabs">
            {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
              <button 
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td><strong>{request.name}</strong></td>
                <td>{request.type}</td>
                <td>{request.from}</td>
                <td>{request.to}</td>
                <td>{request.days}</td>
                <td>{request.reason}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)} {request.status}
                  </span>
                </td>
                <td>
                  {request.status === 'Pending' && (
                    <div className="action-buttons">
                      <button className="btn-sm success">Approve</button>
                      <button className="btn-sm danger">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;

