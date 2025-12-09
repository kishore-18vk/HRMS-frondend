import React, { useState } from 'react';
import { FileText, Folder, Upload, Download, Eye, Trash2, Search, Filter, Grid, List, File, Image, FileSpreadsheet, MoreVertical } from 'lucide-react';

const folders = [
  { id: 1, name: 'Personal Documents', count: 12, icon: '📁', color: '#7c3aed' },
  { id: 2, name: 'Contracts', count: 5, icon: '📄', color: '#22c55e' },
  { id: 3, name: 'Certificates', count: 8, icon: '🏆', color: '#f59e0b' },
  { id: 4, name: 'Policies', count: 15, icon: '📋', color: '#ec4899' },
];

const files = [
  { id: 1, name: 'Employment Contract.pdf', type: 'pdf', size: '2.4 MB', date: 'Dec 5, 2024', category: 'Contracts' },
  { id: 2, name: 'ID Proof.jpg', type: 'image', size: '1.2 MB', date: 'Dec 3, 2024', category: 'Personal' },
  { id: 3, name: 'Salary Slip Nov.pdf', type: 'pdf', size: '456 KB', date: 'Dec 1, 2024', category: 'Payroll' },
  { id: 4, name: 'Tax Declaration.xlsx', type: 'excel', size: '890 KB', date: 'Nov 28, 2024', category: 'Finance' },
  { id: 5, name: 'Training Certificate.pdf', type: 'pdf', size: '1.8 MB', date: 'Nov 25, 2024', category: 'Certificates' },
  { id: 6, name: 'Leave Policy 2024.pdf', type: 'pdf', size: '320 KB', date: 'Nov 20, 2024', category: 'Policies' },
];

const getFileIcon = (type) => {
  switch(type) {
    case 'pdf': return <FileText size={24} style={{ color: '#ef4444' }} />;
    case 'image': return <Image size={24} style={{ color: '#22c55e' }} />;
    case 'excel': return <FileSpreadsheet size={24} style={{ color: '#22c55e' }} />;
    default: return <File size={24} style={{ color: '#6b7280' }} />;
  }
};

const Documents = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="documents-page page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><Folder size={28} /> Documents</h1>
          <p>Manage your files and documents</p>
        </div>
        <button className="btn-primary"><Upload size={18} /> Upload File</button>
      </div>

      {/* Quick Folders */}
      <div className="vortex-stats-row">
        {folders.map(folder => (
          <div key={folder.id} className="vortex-stat-item" style={{ '--stat-color': folder.color, cursor: 'pointer' }}>
            <div className="vortex-stat-icon" style={{ background: `${folder.color}20`, color: folder.color, fontSize: '1.5rem' }}>
              {folder.icon}
            </div>
            <div className="vortex-stat-info">
              <h3>{folder.count}</h3>
              <p>{folder.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Files Section */}
      <div className="vortex-page-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', flex: 1, maxWidth: '300px' }}>
            <Search size={18} style={{ color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search files..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'none', outline: 'none', width: '100%' }} />
          </div>
          <div className="vortex-tabs" style={{ marginBottom: 0 }}>
            <button className={`vortex-tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><Grid size={16} /></button>
            <button className={`vortex-tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={16} /></button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="vortex-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {filteredFiles.map(file => (
              <div key={file.id} className="vortex-grid-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px', background: 'var(--bg-secondary)', borderRadius: '10px', marginBottom: '0.8rem' }}>
                  {getFileIcon(file.type)}
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{file.size} • {file.date}</span>
                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.8rem' }}>
                  <button className="btn-sm secondary"><Eye size={14} /></button>
                  <button className="btn-sm secondary"><Download size={14} /></button>
                  <button className="btn-sm danger"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="vortex-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Size</th>
                <th style={{ textAlign: 'left', padding: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ textAlign: 'right', padding: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map(file => (
                <tr key={file.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {getFileIcon(file.type)}
                    <span style={{ fontWeight: 500 }}>{file.name}</span>
                  </td>
                  <td style={{ padding: '0.8rem' }}><span className="status-badge secondary">{file.category}</span></td>
                  <td style={{ padding: '0.8rem', color: 'var(--text-secondary)' }}>{file.size}</td>
                  <td style={{ padding: '0.8rem', color: 'var(--text-secondary)' }}>{file.date}</td>
                  <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                      <button className="btn-sm secondary"><Eye size={14} /></button>
                      <button className="btn-sm secondary"><Download size={14} /></button>
                      <button className="btn-sm danger"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Storage Info */}
      <div className="vortex-progress-card" style={{ marginTop: '1.5rem' }}>
        <div className="vortex-progress-info">
          <h2>Storage Used</h2>
          <p>2.4 GB of 5 GB used</p>
        </div>
        <div className="vortex-progress-bar">
          <div className="vortex-progress-track">
            <div className="vortex-progress-fill" style={{ width: '48%' }}></div>
          </div>
          <span className="vortex-progress-percent">48%</span>
        </div>
      </div>
    </div>
  );
};

export default Documents;

