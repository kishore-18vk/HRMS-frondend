import React, { useState, useEffect } from 'react';
import { Laptop, Monitor, Smartphone, Headphones, Key, Package, Plus, CheckCircle, Clock, X } from 'lucide-react';
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
      <div className="assets-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🖥️ Assets</h1>
          <p className="text-gray-500">Manage your assigned assets and requests</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Request Asset
        </button>
      </div>

      {/* Categories Stats */}
      <div className="asset-categories grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map(cat => {
          const Icon = getIcon(cat.name);
          return (
            <div key={cat.id} className="asset-cat-card bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm">
              <div className="cat-icon p-3 rounded-lg" style={{ background: `${cat.color}20`, color: cat.color }}>
                <Icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{cat.count}</h3>
                <p className="text-gray-500 text-sm">{cat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="assets-tabs flex gap-6 border-b border-gray-200 mb-6">
        <button className={`pb-2 ${activeTab === 'my-assets' ? 'border-b-2 border-indigo-500 text-indigo-600 font-bold' : 'text-gray-500'}`} onClick={() => setActiveTab('my-assets')}>All Assets</button>
        <button className={`pb-2 ${activeTab === 'requests' ? 'border-b-2 border-indigo-500 text-indigo-600 font-bold' : 'text-gray-500'}`} onClick={() => setActiveTab('requests')}>Requests</button>
      </div>

      {loading ? <p className="text-center p-8 text-gray-500">Loading...</p> : (
        <>
          {activeTab === 'my-assets' ? (
            <div className="my-assets-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.length === 0 && <p className="text-gray-500 col-span-2 text-center">No assets in inventory.</p>}
              {assets.map(asset => {
                const Icon = getIcon(asset.asset_type);
                return (
                  <div key={asset.id} className="asset-card bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-600"><Icon size={24} /></div>
                      <div>
                        <h3 className="font-bold text-gray-800">{asset.name}</h3>
                        <p className="text-xs text-gray-500">{asset.asset_type}</p>
                        <div className="flex gap-3 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><Key size={10} /> {asset.serial_number}</span>
                          <span className={`px-2 py-0.5 rounded-full border ${asset.condition === 'Excellent' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>{asset.condition}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs border ${asset.status === 'Assigned' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {asset.status}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="requests-list space-y-3">
              {requests.map(req => (
                <div key={req.id} className="request-item bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Package size={20} /></div>
                    <div>
                      <h4 className="font-bold text-gray-800">{req.asset_type} Request</h4>
                      <span className="text-xs text-gray-500">For: {req.employee_name} • {req.request_date}</span>
                      <p className="text-xs text-gray-400">Reason: {req.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs border ${
                      req.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                      req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {req.status}
                    </span>

                    {req.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate(req.id, 'Approved')} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => handleStatusUpdate(req.id, 'Rejected')} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject">
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {requests.length === 0 && <p className="text-gray-500 text-center py-4">No pending requests</p>}
            </div>
          )}
        </>
      )}

      {/* Request Modal */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="modal-header p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg">Request New Asset</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select className="w-full border rounded-lg p-2" onChange={(e) => setRequestForm({...requestForm, employee: e.target.value})} required>
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                <select className="w-full border rounded-lg p-2" value={requestForm.asset_type} onChange={(e) => setRequestForm({...requestForm, asset_type: e.target.value})}>
                  <option>Laptop</option><option>Monitor</option><option>Phone</option><option>Accessory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea className="w-full border rounded-lg p-2" rows="3" onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})} required></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;