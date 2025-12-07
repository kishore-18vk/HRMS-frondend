import React, { useState } from 'react';
import { FileText, Folder, Upload, Download, Eye, Trash2, Search, Filter, Grid, List, File, Image, FileSpreadsheet, MoreVertical } from 'lucide-react';

const folders = [
  { id: 1, name: 'Personal Documents', count: 12, icon: '📁', color: '#6366f1' },
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
    case 'pdf': return <FileText size={24} className="file-icon pdf" />;
    case 'image': return <Image size={24} className="file-icon image" />;
    case 'excel': return <FileSpreadsheet size={24} className="file-icon excel" />;
    default: return <File size={24} className="file-icon" />;
  }
};

const Documents = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="documents-page">
      {/* Header */}
      <div className="docs-header">
        <div>
          <h1>📁 Documents</h1>
          <p>Manage your files and documents</p>
        </div>
        <button className="btn-upload"><Upload size={18} /> Upload File</button>
      </div>

      {/* Quick Folders */}
      <div className="folders-grid">
        {folders.map(folder => (
          <div key={folder.id} className="folder-card" style={{ borderLeftColor: folder.color }}>
            <div className="folder-icon">{folder.icon}</div>
            <div className="folder-info">
              <h3>{folder.name}</h3>
              <p>{folder.count} files</p>
            </div>
          </div>
        ))}
      </div>

      {/* Files Section */}
      <div className="files-section">
        <div className="files-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search files..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="toolbar-right">
            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><Grid size={18} /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={18} /></button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="files-grid">
            {filteredFiles.map(file => (
              <div key={file.id} className="file-card">
                <div className="file-preview">{getFileIcon(file.type)}</div>
                <div className="file-info">
                  <h4>{file.name}</h4>
                  <span>{file.size} • {file.date}</span>
                </div>
                <div className="file-actions">
                  <button className="action-btn"><Eye size={16} /></button>
                  <button className="action-btn"><Download size={16} /></button>
                  <button className="action-btn delete"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="files-list">
            <table className="files-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(file => (
                  <tr key={file.id}>
                    <td className="file-name-cell">
                      {getFileIcon(file.type)}
                      <span>{file.name}</span>
                    </td>
                    <td><span className="category-badge">{file.category}</span></td>
                    <td>{file.size}</td>
                    <td>{file.date}</td>
                    <td className="actions-cell">
                      <button><Eye size={16} /></button>
                      <button><Download size={16} /></button>
                      <button className="delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="storage-card">
        <div className="storage-info">
          <h3>Storage Used</h3>
          <p>2.4 GB of 5 GB used</p>
        </div>
        <div className="storage-bar">
          <div className="storage-fill" style={{ width: '48%' }}></div>
        </div>
        <span className="storage-percent">48%</span>
      </div>
    </div>
  );
};

export default Documents;

