import { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Mail, Phone, Edit, Trash2 } from 'lucide-react';

const employeesData = [
  { id: 1, name: 'John Doe', email: 'john@company.com', phone: '+1 234 567 890', department: 'Engineering', position: 'Senior Developer', status: 'Active', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', phone: '+1 234 567 891', department: 'Marketing', position: 'Marketing Manager', status: 'Active', avatar: 'JS' },
  { id: 3, name: 'Mike Johnson', email: 'mike@company.com', phone: '+1 234 567 892', department: 'Sales', position: 'Sales Executive', status: 'Active', avatar: 'MJ' },
  { id: 4, name: 'Emily Brown', email: 'emily@company.com', phone: '+1 234 567 893', department: 'HR', position: 'HR Specialist', status: 'On Leave', avatar: 'EB' },
  { id: 5, name: 'David Wilson', email: 'david@company.com', phone: '+1 234 567 894', department: 'Finance', position: 'Accountant', status: 'Active', avatar: 'DW' },
  { id: 6, name: 'Sarah Davis', email: 'sarah@company.com', phone: '+1 234 567 895', department: 'Engineering', position: 'UI/UX Designer', status: 'Active', avatar: 'SD' },
  { id: 7, name: 'Chris Miller', email: 'chris@company.com', phone: '+1 234 567 896', department: 'Engineering', position: 'DevOps Engineer', status: 'Active', avatar: 'CM' },
  { id: 8, name: 'Lisa Anderson', email: 'lisa@company.com', phone: '+1 234 567 897', department: 'Marketing', position: 'Content Writer', status: 'Active', avatar: 'LA' },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

  const filteredEmployees = employeesData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>Manage your team members and their information</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {departments.map(dept => (
            <button 
              key={dept}
              className={`filter-tab ${selectedDept === dept ? 'active' : ''}`}
              onClick={() => setSelectedDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="employees-grid">
        {filteredEmployees.map(emp => (
          <div key={emp.id} className="employee-card">
            <div className="employee-header">
              <div className="employee-avatar">{emp.avatar}</div>
              <button className="more-btn"><MoreVertical size={18} /></button>
            </div>
            <h3>{emp.name}</h3>
            <p className="employee-position">{emp.position}</p>
            <span className="employee-dept">{emp.department}</span>
            <div className={`employee-status ${emp.status === 'Active' ? 'active' : 'leave'}`}>
              {emp.status}
            </div>
            <div className="employee-contact">
              <a href={`mailto:${emp.email}`}><Mail size={16} /></a>
              <a href={`tel:${emp.phone}`}><Phone size={16} /></a>
            </div>
            <div className="employee-actions">
              <button className="btn-icon"><Edit size={16} /></button>
              <button className="btn-icon danger"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;

