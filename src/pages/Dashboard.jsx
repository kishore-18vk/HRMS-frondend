import React, { useEffect, useState } from 'react';
import {
  Users, Clock, Calendar, TrendingUp, TrendingDown, UserPlus, UserCheck,
  LogIn, LogOut, Play, Coffee, Zap, Bell, CheckCircle, AlertCircle,
  FileText, DollarSign, Target, ChevronRight, Sparkles, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line
} from 'recharts';
import { dashboardAPI } from '../services/api';

const ICON_MAP = { 'Total Employees': Users, 'Present Today': UserCheck, 'On Leave': Calendar, 'Open Positions': UserPlus };
const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f43f5e', '#f97316', '#ec4899'];

// Attendance Heatmap Data (last 4 weeks)
const heatmapData = [
  { day: 'Mon', w1: 95, w2: 92, w3: 88, w4: 96 },
  { day: 'Tue', w1: 93, w2: 95, w3: 91, w4: 94 },
  { day: 'Wed', w1: 97, w2: 89, w3: 94, w4: 92 },
  { day: 'Thu', w1: 91, w2: 93, w3: 96, w4: 90 },
  { day: 'Fri', w1: 85, w2: 87, w3: 82, w4: 88 },
];

// Pending Approvals
const pendingApprovals = [
  { id: 1, type: 'Leave', name: 'Sarah Johnson', request: '3 days vacation', time: '2h ago', avatar: 'SJ', color: '#7c3aed' },
  { id: 2, type: 'Expense', name: 'Mike Chen', request: '$450 travel reimbursement', time: '4h ago', avatar: 'MC', color: '#06b6d4' },
  { id: 3, type: 'WFH', name: 'Emma Wilson', request: 'Work from home - Friday', time: '5h ago', avatar: 'EW', color: '#10b981' },
];

// Reminders
const reminders = [
  { id: 1, title: 'Team meeting', time: '10:00 AM', icon: Users, color: '#7c3aed', urgent: false },
  { id: 2, title: 'Payroll deadline', time: 'Tomorrow', icon: DollarSign, color: '#f43f5e', urgent: true },
  { id: 3, title: 'Performance reviews', time: 'Dec 15', icon: Target, color: '#f97316', urgent: false },
  { id: 4, title: '3 contracts expiring', time: 'This week', icon: FileText, color: '#06b6d4', urgent: true },
];

// Payroll Status
const payrollStatus = { processed: 142, pending: 8, total: 150, amount: '$485,000' };

// Employee Trends
const employeeTrends = [
  { month: 'Jul', hired: 5, left: 2 },
  { month: 'Aug', hired: 8, left: 1 },
  { month: 'Sep', hired: 3, left: 3 },
  { month: 'Oct', hired: 6, left: 2 },
  { month: 'Nov', hired: 4, left: 1 },
  { month: 'Dec', hired: 7, left: 0 },
];

const getHeatmapColor = (value) => {
  if (value >= 95) return '#10b981';
  if (value >= 90) return '#22c55e';
  if (value >= 85) return '#84cc16';
  if (value >= 80) return '#f59e0b';
  return '#ef4444';
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [workingTime, setWorkingTime] = useState('00:00:00');
  const [onBreak, setOnBreak] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Working time counter
  useEffect(() => {
    let interval;
    if (isCheckedIn && checkInTime && !onBreak) {
      interval = setInterval(() => {
        const diff = Math.floor((new Date() - checkInTime) / 1000);
        const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
        const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const secs = String(diff % 60).padStart(2, '0');
        setWorkingTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime, onBreak]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCheckIn = () => { setIsCheckedIn(true); setCheckInTime(new Date()); setOnBreak(false); };
  const handleCheckOut = () => { setIsCheckedIn(false); setCheckInTime(null); setWorkingTime('00:00:00'); setOnBreak(false); };
  const handleBreak = () => setOnBreak(!onBreak);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="dashboard-loading"><div className="loader"></div><p>Loading Vortex...</p></div>;

  return (
    <div className="dashboard-vortex">
      {/* Welcome & Time Widget */}
      <div className="vortex-top">
        <div className="welcome-card">
          <div className="welcome-content">
            <span className="welcome-badge"><Sparkles size={14} /> Welcome back</span>
            <h1>Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, Admin! 👋</h1>
            <p>{formatDate(currentTime)}</p>
          </div>
          <div className="welcome-illustration">
            <Activity size={80} strokeWidth={1} />
          </div>
        </div>

        {/* Check In/Out Widget */}
        <div className="checkin-card">
          <div className="checkin-header">
            <div className="live-clock-vortex">
              <Clock size={18} />
              <span>{formatTime(currentTime)}</span>
            </div>
            <span className={`status-pill ${isCheckedIn ? 'active' : ''}`}>
              {isCheckedIn ? '● Online' : '○ Offline'}
            </span>
          </div>
          <div className="checkin-body">
            {isCheckedIn ? (
              <>
                <div className="timer-display">
                  <span className="timer-label">Today's Work</span>
                  <span className="timer-value">{workingTime}</span>
                </div>
                <div className="checkin-meta">
                  <LogIn size={14} /> Started at {checkInTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
              </>
            ) : (
              <div className="not-checked">
                <span className="timer-label">Ready to start?</span>
                <span className="timer-value">--:--:--</span>
              </div>
            )}
          </div>
          <div className="checkin-actions">
            {!isCheckedIn ? (
              <button className="btn-checkin-vortex" onClick={handleCheckIn}><Play size={16} /> Check In</button>
            ) : (
              <>
                <button className={`btn-break-vortex ${onBreak ? 'active' : ''}`} onClick={handleBreak}>
                  <Coffee size={16} /> {onBreak ? 'Resume' : 'Break'}
                </button>
                <button className="btn-checkout-vortex" onClick={handleCheckOut}><LogOut size={16} /> Check Out</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="vortex-stats">
        {dashboardData?.stats?.map((stat, index) => {
          const Icon = ICON_MAP[stat.title] || Users;
          const gradients = ['linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)', 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)', 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'];
          return (
            <div key={index} className="vortex-stat-card" style={{ '--card-gradient': gradients[index % 4] }}>
              <div className="stat-icon-wrap">
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{stat.value}</span>
                <span className="stat-title">{stat.title}</span>
              </div>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="vortex-grid">
        {/* Attendance Heatmap */}
        <div className="vortex-card heatmap-card">
          <div className="card-header">
            <h3><Activity size={18} /> Attendance Heatmap</h3>
            <span className="card-badge">Last 4 Weeks</span>
          </div>
          <div className="heatmap-grid">
            <div className="heatmap-labels">
              <span></span>
              <span>W1</span><span>W2</span><span>W3</span><span>W4</span>
            </div>
            {heatmapData.map((row, i) => (
              <div key={i} className="heatmap-row">
                <span className="heatmap-day">{row.day}</span>
                {['w1', 'w2', 'w3', 'w4'].map(w => (
                  <div key={w} className="heatmap-cell" style={{ background: getHeatmapColor(row[w]) }} title={`${row[w]}%`}>
                    {row[w]}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span>Low</span>
            <div className="legend-scale">
              <div style={{ background: '#ef4444' }}></div>
              <div style={{ background: '#f59e0b' }}></div>
              <div style={{ background: '#84cc16' }}></div>
              <div style={{ background: '#22c55e' }}></div>
              <div style={{ background: '#10b981' }}></div>
            </div>
            <span>High</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="vortex-card approvals-card">
          <div className="card-header">
            <h3><FileText size={18} /> Pending Approvals</h3>
            <span className="count-badge">{pendingApprovals.length}</span>
          </div>
          <div className="approvals-list">
            {pendingApprovals.map(item => (
              <div key={item.id} className="approval-item">
                <div className="approval-avatar" style={{ background: item.color }}>{item.avatar}</div>
                <div className="approval-info">
                  <h4>{item.name}</h4>
                  <p>{item.request}</p>
                  <span className="approval-time">{item.time}</span>
                </div>
                <div className="approval-actions">
                  <button className="btn-approve">✓</button>
                  <button className="btn-reject">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Trends */}
        <div className="vortex-card trends-card">
          <div className="card-header">
            <h3><Users size={18} /> Employee Trends</h3>
            <span className="card-badge">6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={employeeTrends} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} name="Hired" />
              <Bar dataKey="left" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Left" />
            </BarChart>
          </ResponsiveContainer>
          <div className="trends-legend">
            <span><span className="dot green"></span> Hired</span>
            <span><span className="dot red"></span> Left</span>
          </div>
        </div>

        {/* Payroll Status */}
        <div className="vortex-card payroll-card">
          <div className="card-header">
            <h3><DollarSign size={18} /> Payroll Status</h3>
            <span className="card-badge live">● Live</span>
          </div>
          <div className="payroll-amount">{payrollStatus.amount}</div>
          <div className="payroll-bar">
            <div className="payroll-fill" style={{ width: `${(payrollStatus.processed / payrollStatus.total) * 100}%` }}></div>
          </div>
          <div className="payroll-stats">
            <div className="payroll-stat">
              <span className="stat-num green">{payrollStatus.processed}</span>
              <span className="stat-label">Processed</span>
            </div>
            <div className="payroll-stat">
              <span className="stat-num orange">{payrollStatus.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="payroll-stat">
              <span className="stat-num">{payrollStatus.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="vortex-card reminders-card">
          <div className="card-header">
            <h3><Clock size={18} /> Reminders</h3>
          </div>
          <div className="reminders-list">
            {reminders.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={`reminder-item ${item.urgent ? 'urgent' : ''}`}>
                  <div className="reminder-icon" style={{ background: `${item.color}20`, color: item.color }}>
                    <Icon size={18} />
                  </div>
                  <div className="reminder-info">
                    <h4>{item.title}</h4>
                    <span>{item.time}</span>
                  </div>
                  {item.urgent && <span className="urgent-badge">!</span>}
                  <ChevronRight size={16} className="reminder-arrow" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="vortex-card dept-chart-card">
          <div className="card-header">
            <h3><Users size={18} /> Departments</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {dashboardData?.department_distribution?.length > 0 ? (
              <PieChart>
                <defs>
                  {COLORS.map((color, i) => (
                    <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={1}/>
                      <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie data={dashboardData.department_distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {dashboardData.department_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index % COLORS.length})`} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              </PieChart>
            ) : (
              <div className="no-data">No data</div>
            )}
          </ResponsiveContainer>
          <div className="dept-legend">
            {dashboardData?.department_distribution?.map((item, i) => (
              <span key={i}><span className="dot" style={{ background: COLORS[i % COLORS.length] }}></span>{item.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="vortex-card activity-card">
        <div className="card-header">
          <h3><Activity size={18} /> Recent Activities</h3>
          <button className="view-all-btn">View All <ChevronRight size={14} /></button>
        </div>
        <div className="activity-feed">
          {dashboardData?.recent_activities?.length > 0 ? (
            dashboardData.recent_activities.map((activity, i) => (
              <div key={activity.id || i} className="activity-item">
                <div className="activity-dot" style={{ background: COLORS[i % COLORS.length] }}></div>
                <div className="activity-content">
                  <p><strong>{activity.action}</strong> - {activity.name}</p>
                  {activity.dept && <span className="activity-dept">{activity.dept}</span>}
                </div>
                <span className="activity-time">{activity.time ? new Date(activity.time).toLocaleDateString() : 'Just now'}</span>
              </div>
            ))
          ) : (
            <p className="no-activities">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;