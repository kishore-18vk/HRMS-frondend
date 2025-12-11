import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Download, Printer, X, CheckCircle, Clock, FileText } from 'lucide-react';
import { payrollAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyPayroll = () => {
    const { user } = useAuth();
    const [payrollRecords, setPayrollRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlip, setSelectedSlip] = useState(null);

    useEffect(() => {
        loadPayroll();
    }, []);

    const loadPayroll = async () => {
        setLoading(true);
        try {
            const data = await payrollAPI.getByEmployee(user?.employee_id);
            if (Array.isArray(data)) {
                setPayrollRecords(data);
            } else if (data) {
                setPayrollRecords([data]);
            }
        } catch (err) {
            console.error('Error loading payroll:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        return status === 'Paid' ? 'success' : 'warning';
    };

    // Calculate totals for summary
    const totals = payrollRecords.reduce((acc, record) => ({
        totalEarned: acc.totalEarned + (record.net_salary || 0),
        totalPaid: acc.totalPaid + (record.status === 'Paid' ? record.net_salary || 0 : 0),
        paidCount: acc.paidCount + (record.status === 'Paid' ? 1 : 0),
        pendingCount: acc.pendingCount + (record.status === 'Pending' ? 1 : 0)
    }), { totalEarned: 0, totalPaid: 0, paidCount: 0, pendingCount: 0 });

    return (
        <div className="page-content my-payroll-page">
            <div className="page-header">
                <div>
                    <h1>My Payroll</h1>
                    <p>View your salary and payment history</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="stats-grid four-cols">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{formatCurrency(totals.totalEarned)}</h3>
                        <p>Total Earned</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#7c3aed20', color: '#7c3aed' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{formatCurrency(totals.totalPaid)}</h3>
                        <p>Total Received</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#06b6d420', color: '#06b6d4' }}>
                        <FileText size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{totals.paidCount}</h3>
                        <p>Paid Payslips</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#f9731620', color: '#f97316' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{totals.pendingCount}</h3>
                        <p>Pending Payslips</p>
                    </div>
                </div>
            </div>

            {/* Payroll Table */}
            <div className="table-card">
                <div className="table-header">
                    <h3>Payroll History</h3>
                    <span className="record-count">{payrollRecords.length} records</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Pay Period</th>
                                <th>Basic Salary</th>
                                <th>Allowances</th>
                                <th>Deductions</th>
                                <th>Net Salary</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-4">
                                        <div className="loader-small"></div> Loading...
                                    </td>
                                </tr>
                            ) : payrollRecords.length > 0 ? (
                                payrollRecords.map((record, index) => (
                                    <tr key={record.id || index}>
                                        <td>
                                            <span className="date-cell">
                                                <Calendar size={14} /> {record.pay_date || 'Current'}
                                            </span>
                                        </td>
                                        <td>{formatCurrency(record.basic_salary)}</td>
                                        <td className="text-green">+{formatCurrency(record.allowances)}</td>
                                        <td className="text-red">-{formatCurrency(record.deductions)}</td>
                                        <td><strong>{formatCurrency(record.net_salary)}</strong></td>
                                        <td>
                                            <span className={`status-badge ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-sm" onClick={() => setSelectedSlip(record)}>
                                                View Slip
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="empty-cell">
                                        No payroll records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payslip Modal */}
            {selectedSlip && (
                <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setSelectedSlip(null)}>
                    <div className="modal payslip-modal" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Payslip</h2>
                            <button className="close-btn" onClick={() => setSelectedSlip(null)}><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            <div className="payslip-header">
                                <div>
                                    <h3 className="text-xl font-bold">{user?.name || 'Employee'}</h3>
                                    <p className="text-gray-500">{user?.employee_id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{selectedSlip.pay_date}</p>
                                    <span className={`status-badge ${getStatusColor(selectedSlip.status)}`}>
                                        {selectedSlip.status}
                                    </span>
                                </div>
                            </div>

                            <div className="payslip-body">
                                <div className="payslip-row">
                                    <span>Basic Salary</span>
                                    <span>{formatCurrency(selectedSlip.basic_salary)}</span>
                                </div>
                                <div className="payslip-row text-green">
                                    <span>Allowances</span>
                                    <span>+{formatCurrency(selectedSlip.allowances)}</span>
                                </div>
                                <div className="payslip-row text-red">
                                    <span>Deductions</span>
                                    <span>-{formatCurrency(selectedSlip.deductions)}</span>
                                </div>
                                <div className="payslip-row total">
                                    <span>Net Salary</span>
                                    <span className="text-primary">{formatCurrency(selectedSlip.net_salary)}</span>
                                </div>
                            </div>

                            <div className="form-actions mt-6">
                                <button className="btn-outline" onClick={() => window.print()}>
                                    <Printer size={16} /> Print
                                </button>
                                <button className="btn-primary" onClick={() => setSelectedSlip(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPayroll;
