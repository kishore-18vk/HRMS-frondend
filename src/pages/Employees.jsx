import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Mail, Phone, Edit, Trash2, X } from 'lucide-react';
import { employeeAPI } from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', employee_id: '', gender: 'Male',
    email: '', phone: '', department: '', designation: '', date_of_joining: '', is_active: true
  });

  const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

  useEffect(() => {
    fetchEmployees();
  }, [selectedDept]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const filters = selectedDept !== 'All' ? { department: selectedDept } : {};
      const data = await employeeAPI.getAll(filters);
      setEmployees(data);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await employeeAPI.update(editingEmployee.id, formData);
      } else {
        await employeeAPI.create(formData);
      }
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      first_name: emp.first_name, last_name: emp.last_name, employee_id: emp.employee_id,
      gender: emp.gender, email: emp.email, phone: emp.phone, department: emp.department,
      designation: emp.designation, date_of_joining: emp.date_of_joining, is_active: emp.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: '', last_name: '', employee_id: '', gender: 'Male',
      email: '', phone: '', department: '', designation: '', date_of_joining: '', is_active: true
    });
  };

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getAvatar = (emp) => `${emp.first_name?.[0] || ''}${emp.last_name?.[0] || ''}`;

  if (loading) return <div className="loading">Loading employees...</div>;

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>Manage your team members and their information</p>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingEmployee(null); setShowModal(true); }}>
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {departments.map(dept => (
            <button key={dept} className={`filter-tab ${selectedDept === dept ? 'active' : ''}`} onClick={() => setSelectedDept(dept)}>{dept}</button>
          ))}
        </div>
      </div>

      <div className="employees-grid">
        {filteredEmployees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          filteredEmployees.map(emp => (
            <div key={emp.id} className="employee-card">
              <div className="employee-header">
                <div className="employee-avatar">{getAvatar(emp)}</div>
                <button className="more-btn"><MoreVertical size={18} /></button>
              </div>
              <h3>{emp.first_name} {emp.last_name}</h3>
              <p className="employee-position">{emp.designation}</p>
              <span className="employee-dept">{emp.department}</span>
              <div className={`employee-status ${emp.is_active ? 'active' : 'leave'}`}>{emp.is_active ? 'Active' : 'Inactive'}</div>
              <div className="employee-contact">
                <a href={`mailto:${emp.email}`}><Mail size={16} /></a>
                <a href={`tel:${emp.phone}`}><Phone size={16} /></a>
              </div>
              <div className="employee-actions">
                <button className="btn-icon" onClick={() => handleEdit(emp)}><Edit size={16} /></button>
                <button className="btn-icon danger" onClick={() => handleDelete(emp.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>First Name</label><input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required /></div>
                <div className="form-group"><label>Last Name</label><input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Employee ID</label><input type="text" value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} required /></div>
                <div className="form-group"><label>Gender</label><select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
                <div className="form-group"><label>Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Department</label><input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required /></div>
                <div className="form-group"><label>Designation</label><input type="text" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} required /></div>
              </div>
              <div className="form-group"><label>Date of Joining</label><input type="date" value={formData.date_of_joining} onChange={(e) => setFormData({...formData, date_of_joining: e.target.value})} required /></div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingEmployee ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

