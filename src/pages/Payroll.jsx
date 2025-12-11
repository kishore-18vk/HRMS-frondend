import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Calendar, TrendingUp, X, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { payrollAPI } from '../services/api';

const Payroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listData, statsData] = await Promise.all([
        payrollAPI.getAll(),
        payrollAPI.getStats()
      ]);
      setPayrollData(listData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading payroll:", error);
      setError('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    if (!window.confirm("Generate payroll for all active employees?")) return;
    try {
      const result = await payrollAPI.runPayroll();
      setSuccess(result.message || 'Payroll generated successfully');
      setTimeout(() => setSuccess(''), 3000);
      loadData();
    } catch (error) {
      setError("Failed: " + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleStatusChange = async (payrollId, currentStatus, newStatus) => {
    // Validation: Cannot set Paid twice
    if (currentStatus === 'Paid' && newStatus === 'Paid') {
      setError('This payroll is already marked as Paid');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validation: Status cannot be empty
    if (!newStatus) {
      setError('Please select a valid status');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setStatusLoading(payrollId);
    setError('');

    try {
      await payrollAPI.setStatus(payrollId, newStatus);
      setSuccess(`Payroll status updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);

      // Update local state
      setPayrollData(prev => prev.map(record =>
        record.id === payrollId ? { ...record, status: newStatus } : record
      ));
    } catch (err) {
      setError(err.message || 'Failed to update status');
      setTimeout(() => setError(''), 5000);
    } finally {
      setStatusLoading(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  return (
    <div className="payroll-page page-content">
      <div className="page-header">
        <div>
          <h1>Payroll</h1>
          <p>Manage employee salaries and payments</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline"><Download size={18} /> Export</button>
          <button className="btn-primary" onClick={handleRunPayroll}>Run Payroll</button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="notification error">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="notification success">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      <div className="stats-grid three-cols">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card large">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <DollarSign size={28} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3>Payroll Records</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic Salary</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="8" className="text-center p-4">Loading...</td></tr> :
                payrollData.map((record) => (
                  <tr key={record.id}>
                    <td><span className="text-gray-500 text-sm">{record.employee_id}</span></td>
                    <td><strong>{record.employee_name} {record.employee_last_name}</strong></td>
                    <td>{record.department}</td>
                    <td>{formatCurrency(record.basic_salary)}</td>
                    <td><strong>{formatCurrency(record.net_salary)}</strong></td>
                    <td>
                      <span className={`status-badge ${record.status === 'Paid' ? 'success' : 'warning'}`}>
                        {record.status === 'Paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.id, record.status, e.target.value)}
                        disabled={statusLoading === record.id || record.status === 'Paid'}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                      {statusLoading === record.id && (
                        <span className="loading-spinner-small"></span>
                      )}
                    </td>
                    <td>
                      <button className="btn-sm" onClick={() => setSelectedSlip(record)}>View Slip</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSlip && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setSelectedSlip(null)}>
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Payslip: {selectedSlip.employee_id}</h2>
              <button className="close-btn" onClick={() => setSelectedSlip(null)}><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedSlip.employee_name} {selectedSlip.employee_last_name}</h3>
                  <p className="text-gray-500">{selectedSlip.department}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{selectedSlip.pay_date}</p>
                  <span className={`status-badge ${selectedSlip.status === 'Paid' ? 'success' : 'warning'}`}>{selectedSlip.status}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Basic Salary</span><span>{formatCurrency(selectedSlip.basic_salary)}</span></div>
                <div className="flex justify-between text-green-600"><span>Allowances</span><span>+{formatCurrency(selectedSlip.allowances)}</span></div>
                <div className="flex justify-between text-red-500"><span>Deductions</span><span>-{formatCurrency(selectedSlip.deductions)}</span></div>
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg"><span>Net Salary</span><span className="text-primary">{formatCurrency(selectedSlip.net_salary)}</span></div>
              </div>
              <div className="form-actions mt-6">
                <button className="btn-outline" onClick={() => window.print()}><Printer size={16} className="mr-2" /> Print</button>
                <button className="btn-primary" onClick={() => setSelectedSlip(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;