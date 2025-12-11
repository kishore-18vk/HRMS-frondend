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
import { dashboardAPI, attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ICON_MAP = { 'Total Employees': Users, 'Present Today': UserCheck, 'On Leave': Calendar, 'Open Positions': UserPlus };
const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f43f5e', '#f97316', '#ec4899'];

// Static Reminders (Mocked for now)
const reminders = [
  { id: 1, title: 'Team meeting', time: '10:00 AM', icon: Users, color: '#7c3aed', urgent: false },
  { id: 2, title: 'Payroll deadline', time: 'Tomorrow', icon: DollarSign, color: '#f43f5e', urgent: true },
  { id: 3, title: 'Performance reviews', time: 'Dec 15', icon: Target, color: '#f97316', urgent: false },
  { id: 4, title: '3 contracts expiring', time: 'This week', icon: FileText, color: '#06b6d4', urgent: true },
];

const getHeatmapColor = (value) => {
  if (value >= 95) return '#10b981';
  if (value >= 90) return '#22c55e';
  if (value >= 85) return '#84cc16';
  if (value >= 80) return '#f59e0b';
  return '#ef4444';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clock & Check-in States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [workingTime, setWorkingTime] = useState('00:00:00');
  const [onBreak, setOnBreak] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkError, setCheckError] = useState('');
  const [checkSuccess, setCheckSuccess] = useState('');

  // 1. Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Working time counter
  useEffect(() => {
    let interval;
    if (todayAttendance?.check_in && !todayAttendance?.check_out && !onBreak) {
      interval = setInterval(() => {
        const checkInTime = new Date(todayAttendance.check_in_datetime);
        const diff = Math.floor((new Date() - checkInTime) / 1000);
        const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
        const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const secs = String(diff % 60).padStart(2, '0');
        setWorkingTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [todayAttendance, onBreak]);

  // 3. Fetch Data from Backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [data, attendance] = await Promise.all([
          dashboardAPI.getStats(),
          attendanceAPI.getToday().catch(() => null)
        ]);
        setDashboardData(data);
        setTodayAttendance(attendance);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Handlers
  const handleCheckIn = async () => {
    setActionLoading(true);
    setCheckError('');
    setCheckSuccess('');

    try {
      const result = await attendanceAPI.checkIn();
      setTodayAttendance(result);
      setCheckSuccess('Checked in successfully!');
      setTimeout(() => setCheckSuccess(''), 3000);
    } catch (err) {
      setCheckError(err.message || 'Failed to check in');
      setTimeout(() => setCheckError(''), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setCheckError('');
    setCheckSuccess('');

    try {
      const result = await attendanceAPI.checkOut();
      setTodayAttendance(result);
      setCheckSuccess('Checked out successfully!');
      setTimeout(() => setCheckSuccess(''), 3000);
    } catch (err) {
      setCheckError(err.message || 'Failed to check out');
      setTimeout(() => setCheckError(''), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBreak = () => setOnBreak(!onBreak);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const isCheckedIn = todayAttendance?.check_in && !todayAttendance?.check_out;
  const isCheckedOut = todayAttendance?.check_in && todayAttendance?.check_out;

  // === Loading State ===
  if (loading) return <div className="dashboard-loading"><div className="loader"></div><p>Loading Vortex...</p></div>;

  // === DATA PREPARATION ===
  const heatmapData = dashboardData?.heatmap_data || [];
  const pendingApprovals = dashboardData?.pending_approvals || [];
  const employeeTrends = dashboardData?.employee_trends || [];
  const payrollStatus = dashboardData?.payroll_status || { processed: 0, pending: 0, total: 0, amount: '$0' };
  const departmentDistribution = dashboardData?.department_distribution || [];
  const recentActivities = dashboardData?.recent_activities || [];

  return (
    <div className="dashboard-vortex">
      {/* Welcome & Time Widget */}
      <div className="vortex-top">
        <div className="welcome-card">
          <div className="welcome-content">
            <span className="welcome-badge"><Sparkles size={14} /> Welcome back</span>
            <h1>Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name || 'Admin'}! 👋</h1>
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
              {isCheckedIn ? '● Working' : isCheckedOut ? '● Completed' : '○ Not Started'}
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
                  <LogIn size={14} /> Started at {todayAttendance?.check_in}
                </div>
              </>
            ) : isCheckedOut ? (
              <>
                <div className="timer-display">
                  <span className="timer-label">Completed</span>
                  <span className="timer-value">{todayAttendance?.working_hours || '0h 0m'}</span>
                </div>
                <div className="checkin-meta">
                  <CheckCircle size={14} /> Day completed
                </div>
              </>
            ) : (
              <div className="not-checked">
                <span className="timer-label">Ready to start?</span>
                <span className="timer-value">--:--:--</span>
              </div>
            )}
          </div>

          {checkError && <div className="checkin-error">{checkError}</div>}
          {checkSuccess && <div className="checkin-success">{checkSuccess}</div>}

          <div className="checkin-actions">
            {!todayAttendance?.check_in ? (
              <button className="btn-checkin-vortex" onClick={handleCheckIn} disabled={actionLoading}>
                <Play size={16} /> {actionLoading ? 'Checking In...' : 'Check In'}
              </button>
            ) : !todayAttendance?.check_out ? (
              <>
                <button className={`btn-break-vortex ${onBreak ? 'active' : ''}`} onClick={handleBreak}>
                  <Coffee size={16} /> {onBreak ? 'Resume' : 'Break'}
                </button>
                <button className="btn-checkout-vortex" onClick={handleCheckOut} disabled={actionLoading}>
                  <LogOut size={16} /> {actionLoading ? 'Checking Out...' : 'Check Out'}
                </button>
              </>
            ) : (
              <div className="day-complete-badge">
                <CheckCircle size={16} /> Day Complete
              </div>
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
            {heatmapData.length > 0 ? heatmapData.map((row, i) => (
              <div key={i} className="heatmap-row">
                <span className="heatmap-day">{row.day}</span>
                {['w1', 'w2', 'w3', 'w4'].map(w => (
                  <div key={w} className="heatmap-cell" style={{ background: getHeatmapColor(row[w]) }} title={`${row[w]}%`}>
                    {row[w]}
                  </div>
                ))}
              </div>
            )) : <p className="no-data">No attendance data yet</p>}
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
            {pendingApprovals.length > 0 ? pendingApprovals.map(item => (
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
            )) : <p className="no-activities">No pending approvals</p>}
          </div>
        </div>

        {/* Employee Trends */}
        <div className="vortex-card trends-card">
          <div className="card-header">
            <h3><Users size={18} /> Employee Trends</h3>
            <span className="card-badge">6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            {employeeTrends.length > 0 ? (
              <BarChart data={employeeTrends} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} name="Hired" />
                <Bar dataKey="left" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Left" />
              </BarChart>
            ) : <p className="no-data">No data available</p>}
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
            <div className="payroll-fill" style={{ width: `${(payrollStatus.processed / (payrollStatus.total || 1)) * 100}%` }}></div>
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
            {departmentDistribution.length > 0 ? (
              <PieChart>
                <defs>
                  {COLORS.map((color, i) => (
                    <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie data={departmentDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {departmentDistribution.map((entry, index) => (
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
            {departmentDistribution.map((item, i) => (
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
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, i) => (
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