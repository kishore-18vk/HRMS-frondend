import React, { useState } from 'react';
import { Laptop, Monitor, Smartphone, Headphones, Key, Package, Plus, Search, Filter, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const assetCategories = [
  { id: 1, name: 'Laptops', count: 45, icon: Laptop, color: '#6366f1' },
  { id: 2, name: 'Monitors', count: 60, icon: Monitor, color: '#22c55e' },
  { id: 3, name: 'Phones', count: 30, icon: Smartphone, color: '#f59e0b' },
  { id: 4, name: 'Accessories', count: 85, icon: Headphones, color: '#ec4899' },
];

const myAssets = [
  { id: 1, name: 'MacBook Pro 14"', type: 'Laptop', serial: 'MBP-2024-001', status: 'assigned', assignedDate: 'Jan 15, 2024', condition: 'Excellent' },
  { id: 2, name: 'Dell UltraSharp 27"', type: 'Monitor', serial: 'DEL-MON-042', status: 'assigned', assignedDate: 'Jan 15, 2024', condition: 'Good' },
  { id: 3, name: 'iPhone 15 Pro', type: 'Phone', serial: 'IPH-2024-089', status: 'assigned', assignedDate: 'Feb 1, 2024', condition: 'Excellent' },
  { id: 4, name: 'Magic Keyboard', type: 'Accessory', serial: 'APL-KB-156', status: 'assigned', assignedDate: 'Jan 15, 2024', condition: 'Good' },
];

const pendingRequests = [
  { id: 1, asset: 'External Monitor', type: 'Monitor', requestDate: 'Dec 5, 2024', status: 'pending' },
  { id: 2, asset: 'Wireless Mouse', type: 'Accessory', requestDate: 'Dec 3, 2024', status: 'approved' },
];

const getAssetIcon = (type) => {
  switch(type) {
    case 'Laptop': return <Laptop size={24} />;
    case 'Monitor': return <Monitor size={24} />;
    case 'Phone': return <Smartphone size={24} />;
    default: return <Headphones size={24} />;
  }
};

const Assets = () => {
  const [activeTab, setActiveTab] = useState('my-assets');

  return (
    <div className="assets-page">
      {/* Header */}
      <div className="assets-header">
        <div>
          <h1>🖥️ Assets</h1>
          <p>Manage your assigned assets and requests</p>
        </div>
        <button className="btn-request"><Plus size={18} /> Request Asset</button>
      </div>

      {/* Categories */}
      <div className="asset-categories">
        {assetCategories.map(cat => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="asset-cat-card">
              <div className="cat-icon" style={{ background: `${cat.color}20`, color: cat.color }}><Icon size={28} /></div>
              <div className="cat-info">
                <h3>{cat.count}</h3>
                <p>{cat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="assets-tabs">
        <button className={activeTab === 'my-assets' ? 'active' : ''} onClick={() => setActiveTab('my-assets')}>My Assets</button>
        <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Requests</button>
      </div>

      {activeTab === 'my-assets' ? (
        <div className="my-assets-grid">
          {myAssets.map(asset => (
            <div key={asset.id} className="asset-card">
              <div className="asset-icon">{getAssetIcon(asset.type)}</div>
              <div className="asset-details">
                <h3>{asset.name}</h3>
                <p className="asset-type">{asset.type}</p>
                <div className="asset-meta">
                  <span><Key size={12} /> {asset.serial}</span>
                  <span className={`condition ${asset.condition.toLowerCase()}`}>{asset.condition}</span>
                </div>
                <p className="assigned-date">Assigned: {asset.assignedDate}</p>
              </div>
              <div className="asset-status assigned"><CheckCircle size={16} /> Assigned</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="requests-list">
          <h3>My Requests</h3>
          {pendingRequests.map(req => (
            <div key={req.id} className="request-item">
              <div className="request-info">
                <Package size={24} />
                <div>
                  <h4>{req.asset}</h4>
                  <span>{req.type} • Requested on {req.requestDate}</span>
                </div>
              </div>
              <span className={`request-status ${req.status}`}>
                {req.status === 'pending' ? <Clock size={14} /> : <CheckCircle size={14} />}
                {req.status === 'pending' ? 'Pending' : 'Approved'}
              </span>
            </div>
          ))}
          {pendingRequests.length === 0 && <p className="no-requests">No pending requests</p>}
        </div>
      )}
    </div>
  );
};

export default Assets;

