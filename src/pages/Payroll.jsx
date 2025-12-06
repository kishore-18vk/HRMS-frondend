import { DollarSign, Download, Calendar, TrendingUp } from 'lucide-react';

const payrollData = [
  { id: 1, name: 'John Doe', department: 'Engineering', basicSalary: 5000, allowances: 500, deductions: 250, netSalary: 5250, status: 'Paid' },
  { id: 2, name: 'Jane Smith', department: 'Marketing', basicSalary: 4500, allowances: 400, deductions: 200, netSalary: 4700, status: 'Paid' },
  { id: 3, name: 'Mike Johnson', department: 'Sales', basicSalary: 4000, allowances: 600, deductions: 180, netSalary: 4420, status: 'Pending' },
  { id: 4, name: 'Emily Brown', department: 'HR', basicSalary: 4200, allowances: 350, deductions: 190, netSalary: 4360, status: 'Paid' },
  { id: 5, name: 'David Wilson', department: 'Finance', basicSalary: 4800, allowances: 450, deductions: 220, netSalary: 5030, status: 'Pending' },
];

const stats = [
  { label: 'Total Payroll', value: '$125,450', icon: DollarSign, color: '#6366f1' },
  { label: 'Paid', value: '$98,200', icon: TrendingUp, color: '#22c55e' },
  { label: 'Pending', value: '$27,250', icon: Calendar, color: '#f59e0b' },
];

const Payroll = () => {
  return (
    <div className="payroll-page">
      <div className="page-header">
        <div>
          <h1>Payroll</h1>
          <p>Manage employee salaries and payments</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <Download size={18} /> Export
          </button>
          <button className="btn-primary">Run Payroll</button>
        </div>
      </div>

      <div className="stats-grid three-cols">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card large">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={28} />
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
          <h3>December 2024 Payroll</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((record) => (
              <tr key={record.id}>
                <td><strong>{record.name}</strong></td>
                <td>{record.department}</td>
                <td>${record.basicSalary.toLocaleString()}</td>
                <td className="text-success">+${record.allowances}</td>
                <td className="text-danger">-${record.deductions}</td>
                <td><strong>${record.netSalary.toLocaleString()}</strong></td>
                <td>
                  <span className={`status-badge ${record.status === 'Paid' ? 'success' : 'warning'}`}>
                    {record.status}
                  </span>
                </td>
                <td>
                  <button className="btn-sm">View Slip</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;

