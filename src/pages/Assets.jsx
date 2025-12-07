import React, { useState, useEffect } from 'react';
import { Laptop, Monitor, Smartphone, Headphones, Key, Package, Plus, CheckCircle, Clock, X, ChevronRight, Sparkles } from 'lucide-react';
import { assetsAPI, employeeAPI } from '../services/api';

const Assets = () => {
  const [activeTab, setActiveTab] = useState('my-assets');
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({ employee: '', asset_type: 'Laptop', reason: '' });
  const [employees, setEmployees] = useState([]);

  const categoryColors = ['#7c3aed', '#06b6d4', '#f43f5e', '#f97316'];

  // Fetch Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assetsData, statsData, requestsData, empData] = await Promise.all([
        assetsAPI.getAll(),
        assetsAPI.getStats(),
        assetsAPI.getRequests(),
        employeeAPI.getAll()
      ]);
      setAssets(assetsData);
      setStats(statsData);
      setRequests(requestsData);
      setEmployees(empData);
    } catch (error) {
      console.error("Error loading assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await assetsAPI.createRequest(requestForm);
      setIsModalOpen(false);
      loadData();
      alert("Request submitted successfully!");
    } catch (error) {
      alert("Failed to submit request.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if(!window.confirm(`Are you sure you want to ${newStatus} this request?`)) return;
    try {
      await assetsAPI.updateRequestStatus(id, newStatus);
      loadData();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const getIcon = (name) => {
    if(name === 'Laptops' || name === 'Laptop') return Laptop;
    if(name === 'Monitors' || name === 'Monitor') return Monitor;
    if(name === 'Phones' || name === 'Phone') return Smartphone;
    return Headphones;
  };

  return (
    <div className="assets-page page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><Package size={28} /> Assets</h1>
          <p>Manage your assigned assets and requests</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Request Asset
        </button>
      </div>

      {/* Categories Stats */}
      <div className="vortex-stats-row">
        {stats.map((cat, index) => {
          const Icon = getIcon(cat.name);
          const colors = ['#7c3aed', '#06b6d4', '#f43f5e', '#f97316'];
          const color = colors[index % colors.length];
          return (
            <div key={cat.id} className="vortex-stat-item" style={{ '--stat-color': color }}>
              <div className="vortex-stat-icon" style={{ background: `${color}20`, color: color }}>
                <Icon size={24} />
              </div>
              <div className="vortex-stat-info">
                <h3>{cat.count}</h3>
                <p>{cat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="vortex-tabs">
        <button className={`vortex-tab ${activeTab === 'my-assets' ? 'active' : ''}`} onClick={() => setActiveTab('my-assets')}>All Assets</button>
        <button className={`vortex-tab ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Requests</button>
      </div>

      {loading ? <div className="loading"><div className="loader"></div></div> : (
        <>
          {activeTab === 'my-assets' ? (
            <div className="vortex-grid">
              {assets.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: 'span 2', padding: '2rem' }}>No assets in inventory.</p>}
              {assets.map(asset => {
                const Icon = getIcon(asset.asset_type);
                return (
                  <div key={asset.id} className="vortex-grid-card">
                    <div className="vortex-grid-header">
                      <div className="vortex-grid-avatar" style={{ background: 'var(--gradient-primary)' }}>
                        <Icon size={22} />
                      </div>
                      <div className="vortex-grid-title">
                        <h3>{asset.name}</h3>
                        <p>{asset.asset_type}</p>
                      </div>
                    </div>
                    <div className="vortex-grid-details">
                      <div className="vortex-detail-row">
                        <span className="label"><Key size={12} /> Serial</span>
                        <span className="value">{asset.serial_number}</span>
                      </div>
                      <div className="vortex-detail-row">
                        <span className="label">Condition</span>
                        <span className={`value ${asset.condition === 'Excellent' ? 'text-green' : 'text-orange'}`}>{asset.condition}</span>
                      </div>
                      <div className="vortex-detail-row">
                        <span className="label">Status</span>
                        <span className={`status-badge ${asset.status === 'Assigned' ? 'success' : 'secondary'}`}>{asset.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="vortex-page-card">
              {requests.map(req => (
                <div key={req.id} className="vortex-list-item">
                  <div className="vortex-list-icon bg-purple">
                    <Package size={20} />
                  </div>
                  <div className="vortex-list-content">
                    <h4>{req.asset_type} Request</h4>
                    <p>For: {req.employee_name}</p>
                    <div className="vortex-list-meta">
                      <span><Clock size={12} /> {req.request_date}</span>
                      <span>Reason: {req.reason}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${
                    req.status === 'Approved' ? 'success' :
                    req.status === 'Rejected' ? 'danger' : 'warning'
                  }`}>
                    {req.status === 'Approved' && <CheckCircle size={12} />}
                    {req.status === 'Pending' && <Clock size={12} />}
                    {req.status}
                  </span>
                  {req.status === 'Pending' && (
                    <div className="action-buttons" style={{ marginLeft: '0.5rem' }}>
                      <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(req.id, 'Approved'); }} className="btn-sm success">✓</button>
                      <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(req.id, 'Rejected'); }} className="btn-sm danger">✕</button>
                    </div>
                  )}
                </div>
              ))}
              {requests.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No pending requests</p>}
            </div>
          )}
        </>
      )}

      {/* Request Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2><Sparkles size={18} /> Request New Asset</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleRequestSubmit}>
              <div className="form-group">
                <label>Employee</label>
                <select onChange={(e) => setRequestForm({...requestForm, employee: e.target.value})} required>
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Asset Type</label>
                <select value={requestForm.asset_type} onChange={(e) => setRequestForm({...requestForm, asset_type: e.target.value})}>
                  <option>Laptop</option>
                  <option>Monitor</option>
                  <option>Phone</option>
                  <option>Accessory</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reason for Request</label>
                <textarea placeholder="Describe why you need this asset..." rows="3" onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})} required></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;