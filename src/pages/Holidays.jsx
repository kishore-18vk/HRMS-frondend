import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, X } from 'lucide-react';
import { holidayAPI } from '../services/api';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({
    name: '', start_date: '', end_date: '', recurring: false, description: ''
  });

  useEffect(() => { fetchHolidays(); }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const data = await holidayAPI.getAll();
      setHolidays(data);
    } catch (err) {
      setError('Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHoliday) {
        await holidayAPI.update(editingHoliday.id, formData);
      } else {
        await holidayAPI.create(formData);
      }
      setShowModal(false);
      setEditingHoliday(null);
      resetForm();
      fetchHolidays();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await holidayAPI.delete(id);
        fetchHolidays();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({ name: holiday.name, start_date: holiday.start_date, end_date: holiday.end_date, recurring: holiday.recurring, description: holiday.description || '' });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', start_date: '', end_date: '', recurring: false, description: '' });
  };

  if (loading) return <div className="loading">Loading holidays...</div>;

  return (
    <div className="holidays-page">
      <div className="page-header">
        <div><h1>Holidays</h1><p>Manage company holidays</p></div>
        <button className="btn-primary" onClick={() => { resetForm(); setEditingHoliday(null); setShowModal(true); }}>
          <Plus size={18} /> Add Holiday
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr><th>Holiday Name</th><th>Start Date</th><th>End Date</th><th>Recurring</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {holidays.length === 0 ? (
              <tr><td colSpan="6">No holidays found</td></tr>
            ) : (
              holidays.map(holiday => (
                <tr key={holiday.id}>
                  <td><strong>{holiday.name}</strong></td>
                  <td>{holiday.start_date}</td>
                  <td>{holiday.end_date}</td>
                  <td>{holiday.recurring ? 'Yes' : 'No'}</td>
                  <td>{holiday.description || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleEdit(holiday)}><Edit size={16} /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(holiday.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingHoliday ? 'Edit Holiday' : 'Add Holiday'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Holiday Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Start Date</label><input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} required /></div>
                <div className="form-group"><label>End Date</label><input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} required /></div>
              </div>
              <div className="form-group checkbox-group">
                <label><input type="checkbox" checked={formData.recurring} onChange={(e) => setFormData({...formData, recurring: e.target.checked})} /> Recurring Holiday</label>
              </div>
              <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3"></textarea></div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingHoliday ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Holidays;

