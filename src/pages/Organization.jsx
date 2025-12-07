import React, { useState } from 'react';
import { Building2, Users, MapPin, Globe, Phone, Mail, ChevronDown, ChevronRight, User } from 'lucide-react';

const companyInfo = {
  name: 'Horilla Technologies',
  industry: 'Information Technology',
  founded: '2020',
  employees: 150,
  locations: 3,
  website: 'www.horilla.com'
};

const departments = [
  { id: 1, name: 'Engineering', head: 'John Smith', employees: 45, color: '#6366f1', icon: '💻' },
  { id: 2, name: 'Product', head: 'Sarah Johnson', employees: 12, color: '#22c55e', icon: '🎯' },
  { id: 3, name: 'Design', head: 'Mike Chen', employees: 8, color: '#f59e0b', icon: '🎨' },
  { id: 4, name: 'Marketing', head: 'Emily Davis', employees: 15, color: '#ec4899', icon: '📢' },
  { id: 5, name: 'HR', head: 'Lisa Brown', employees: 6, color: '#14b8a6', icon: '👥' },
  { id: 6, name: 'Finance', head: 'David Wilson', employees: 10, color: '#8b5cf6', icon: '💰' },
];

const orgTree = [
  { id: 1, name: 'CEO - Robert Johnson', role: 'Chief Executive Officer', children: [
    { id: 2, name: 'CTO - John Smith', role: 'Chief Technology Officer', children: [
      { id: 5, name: 'Dev Lead - Alex Turner', role: 'Development Lead' },
      { id: 6, name: 'QA Lead - Maria Garcia', role: 'Quality Assurance Lead' },
    ]},
    { id: 3, name: 'CFO - David Wilson', role: 'Chief Financial Officer' },
    { id: 4, name: 'COO - Sarah Johnson', role: 'Chief Operating Officer' },
  ]}
];

const TreeNode = ({ node, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node" style={{ marginLeft: level * 40 }}>
      <div className="tree-item" onClick={() => hasChildren && setExpanded(!expanded)}>
        {hasChildren && (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        <div className="tree-avatar"><User size={18} /></div>
        <div className="tree-info">
          <h4>{node.name}</h4>
          <span>{node.role}</span>
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="tree-children">
          {node.children.map(child => <TreeNode key={child.id} node={child} level={level + 1} />)}
        </div>
      )}
    </div>
  );
};

const Organization = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="organization-page">
      {/* Header */}
      <div className="org-header">
        <div className="org-logo"><Building2 size={32} /></div>
        <div className="org-info">
          <h1>{companyInfo.name}</h1>
          <p>{companyInfo.industry} • Founded {companyInfo.founded}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="org-stats">
        <div className="org-stat"><Users size={24} /><div><h3>{companyInfo.employees}</h3><p>Employees</p></div></div>
        <div className="org-stat"><Building2 size={24} /><div><h3>{departments.length}</h3><p>Departments</p></div></div>
        <div className="org-stat"><MapPin size={24} /><div><h3>{companyInfo.locations}</h3><p>Locations</p></div></div>
        <div className="org-stat"><Globe size={24} /><div><h3>{companyInfo.website}</h3><p>Website</p></div></div>
      </div>

      {/* Tabs */}
      <div className="org-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Departments</button>
        <button className={activeTab === 'hierarchy' ? 'active' : ''} onClick={() => setActiveTab('hierarchy')}>Org Chart</button>
      </div>

      {activeTab === 'overview' ? (
        /* Departments Grid */
        <div className="departments-grid">
          {departments.map(dept => (
            <div key={dept.id} className="dept-card">
              <div className="dept-header" style={{ background: `linear-gradient(135deg, ${dept.color}20 0%, ${dept.color}10 100%)` }}>
                <span className="dept-icon">{dept.icon}</span>
                <h3>{dept.name}</h3>
              </div>
              <div className="dept-body">
                <div className="dept-stat">
                  <Users size={16} />
                  <span>{dept.employees} Members</span>
                </div>
                <div className="dept-head">
                  <div className="head-avatar" style={{ background: dept.color }}>{dept.head.charAt(0)}</div>
                  <div>
                    <p className="head-name">{dept.head}</p>
                    <p className="head-role">Department Head</p>
                  </div>
                </div>
              </div>
              <button className="view-dept-btn" style={{ color: dept.color }}>View Department →</button>
            </div>
          ))}
        </div>
      ) : (
        /* Organization Hierarchy Tree */
        <div className="org-tree-container">
          <h3>Organization Hierarchy</h3>
          <div className="org-tree">
            {orgTree.map(node => <TreeNode key={node.id} node={node} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Organization;

