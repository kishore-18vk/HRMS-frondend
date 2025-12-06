import { Users, Clock, Calendar, DollarSign, TrendingUp, TrendingDown, UserPlus, UserCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { title: 'Total Employees', value: '156', icon: Users, change: '+12%', trend: 'up', color: '#6366f1' },
  { title: 'Present Today', value: '142', icon: UserCheck, change: '+5%', trend: 'up', color: '#22c55e' },
  { title: 'On Leave', value: '8', icon: Calendar, change: '-2', trend: 'down', color: '#f59e0b' },
  { title: 'Open Positions', value: '12', icon: UserPlus, change: '+3', trend: 'up', color: '#ec4899' },
];

const attendanceData = [
  { name: 'Mon', present: 145, absent: 11 },
  { name: 'Tue', present: 148, absent: 8 },
  { name: 'Wed', present: 142, absent: 14 },
  { name: 'Thu', present: 150, absent: 6 },
  { name: 'Fri', present: 138, absent: 18 },
];

const departmentData = [
  { name: 'Engineering', value: 45, color: '#6366f1' },
  { name: 'Sales', value: 30, color: '#22c55e' },
  { name: 'Marketing', value: 25, color: '#f59e0b' },
  { name: 'HR', value: 15, color: '#ec4899' },
  { name: 'Finance', value: 20, color: '#14b8a6' },
];

const recentActivities = [
  { id: 1, action: 'New employee joined', name: 'John Doe', dept: 'Engineering', time: '2 hours ago' },
  { id: 2, action: 'Leave approved', name: 'Jane Smith', dept: 'Marketing', time: '3 hours ago' },
  { id: 3, action: 'Payroll processed', name: 'December 2024', dept: '', time: '5 hours ago' },
  { id: 4, action: 'Performance review', name: 'Mike Johnson', dept: 'Sales', time: '1 day ago' },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your team.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            <div className={`stat-change ${stat.trend}`}>
              {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="present" stroke="#6366f1" fill="#6366f120" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Department Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="activity-card">
        <h3>Recent Activities</h3>
        <div className="activity-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p><strong>{activity.action}</strong> - {activity.name} {activity.dept && `(${activity.dept})`}</p>
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

