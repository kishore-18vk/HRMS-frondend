import { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { leaveAPI } from '../services/api'; // Ensure this path is correct

const Leave = () => {
  // ============ STATE ============
  const [filter, setFilter] = useState('All');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 

  // State for the "Request Leave" form
  const [formData, setFormData] = useState({
    employee: '', 
    leave_type: 'Annual Leave',
    start_date: '',
    end_date: '',
    reason: ''
  });

  // ============ API CALLS ============

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveAPI.getAll();
      setLeaves(data);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveAPI.create(formData);
      setShowModal(false);
      setFormData({ employee: '', leave_type: 'Annual Leave', start_date: '', end_date: '', reason: '' });
      fetchLeaves();
      alert("Leave Request Submitted Successfully!");
    } catch (error) {
      alert("Error submitting request: " + error.message);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if(!window.confirm(`Are you sure you want to ${newStatus} this request?`)) return;

    try {
      await leaveAPI.update(id, { status: newStatus });
      fetchLeaves(); 
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ============ HELPERS ============

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
    ? leaves 
    : leaves.filter(r => r.status === filter);

  const stats = {
    pending: leaves.filter(r => r.status === 'Pending').length,
    approved: leaves.filter(r => r.status === 'Approved').length,
    rejected: leaves.filter(r => r.status === 'Rejected').length,
  };

  // ============ RENDER ============
  return (
    <div className="leave-page">
      <div className="page-header">
        <div>
          <h1>Leave Management</h1>
          <p>Manage employee leave requests</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Request Leave
        </button>
      </div>

      <div className="leave-stats">
        <div className="leave-stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <h3>{stats.pending}</h3>
          <p>Pending Requests</p>
        </div>
        <div className="leave-stat-card" style={{ borderLeftColor: '#22c55e' }}>
          <h3>{stats.approved}</h3>
          <p>Approved Requests</p>
        </div>
        <div className="leave-stat-card" style={{ borderLeftColor: '#ef4444' }}>
          <h3>{stats.rejected}</h3>
          <p>Rejected Requests</p>
        </div>
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

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
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
                  {/* === UPDATED COLUMN TO SHOW ID === */}
                  <td>
                    <strong>{request.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{request.employee}</div>
                  </td>
                  
                  <td>{request.leave_type}</td>
                  <td>{request.start_date}</td>
                  <td>{request.end_date}</td>
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
                        <button className="btn-sm success" onClick={() => handleStatusUpdate(request.id, 'Approved')}>Approve</button>
                        <button className="btn-sm danger" onClick={() => handleStatusUpdate(request.id, 'Rejected')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>New Leave Request</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee ID (Optional)</label>
                <input 
                  type="text" 
                  name="employee" 
                  value={formData.employee} 
                  onChange={handleInputChange} 
                  placeholder="Leave empty to auto-fill" 
                />
              </div>

              <div className="form-group">
                <label>Leave Type</label>
                <select name="leave_type" value={formData.leave_type} onChange={handleInputChange}>
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Personal Leave</option>
                  <option>Maternity/Paternity Leave</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>From Date</label>
                  <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <textarea name="reason" rows="3" value={formData.reason} onChange={handleInputChange} placeholder="Describe the reason..." required></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;