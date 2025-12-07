import React, { useEffect, useState } from 'react';
import { Users, Clock, Calendar, TrendingUp, TrendingDown, UserPlus, UserCheck, LogIn, LogOut, Play, Coffee } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardAPI } from '../services/api';

const ICON_MAP = { 'Total Employees': Users, 'Present Today': UserCheck, 'On Leave': Calendar, 'Open Positions': UserPlus };
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6'];

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

  if (loading) return <div className="dashboard-loading"><div className="loader"></div><p>Loading Dashboard...</p></div>;

  return (
    <div className="dashboard-modern">
      {/* Welcome & Time Widget */}
      <div className="dashboard-top">
        <div className="welcome-section">
          <h1>Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}! 👋</h1>
          <p>{formatDate(currentTime)}</p>
        </div>

        {/* Check In/Out Widget */}
        <div className="checkin-widget">
          <div className="live-clock">
            <Clock size={20} />
            <span className="time-display">{formatTime(currentTime)}</span>
          </div>
          <div className="checkin-status">
            {isCheckedIn ? (
              <>
                <div className="working-timer">
                  <span className="timer-label">Working Time</span>
                  <span className="timer-value">{workingTime}</span>
                </div>
                <div className="checkin-info">
                  <LogIn size={14} /> Checked in at {checkInTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
              </>
            ) : (
              <div className="not-checked-in">
                <span>You haven't checked in yet</span>
              </div>
            )}
          </div>
          <div className="checkin-actions">
            {!isCheckedIn ? (
              <button className="btn-checkin" onClick={handleCheckIn}><Play size={16} /> Check In</button>
            ) : (
              <>
                <button className={`btn-break ${onBreak ? 'active' : ''}`} onClick={handleBreak}>
                  <Coffee size={16} /> {onBreak ? 'Resume' : 'Break'}
                </button>
                <button className="btn-checkout" onClick={handleCheckOut}><LogOut size={16} /> Check Out</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-modern">
        {dashboardData?.stats?.map((stat, index) => {
          const Icon = ICON_MAP[stat.title] || Users;
          return (
            <div key={index} className="stat-card-modern">
              <div className="stat-card-icon" style={{ background: `linear-gradient(135deg, ${stat.color}40 0%, ${stat.color}20 100%)` }}>
                <Icon size={28} style={{ color: stat.color }} />
              </div>
              <div className="stat-card-content">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.title}</span>
              </div>
              <div className={`stat-trend ${stat.trend}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card-modern">
          <div className="chart-header"><h3>Weekly Attendance</h3><span className="chart-badge">This Week</span></div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dashboardData?.attendance_data}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={3} fill="url(#colorPresent)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card-modern">
          <div className="chart-header"><h3>Department Distribution</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            {dashboardData?.department_distribution?.length > 0 ? (
              <PieChart>
                <Pie data={dashboardData.department_distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>
                  {dashboardData.department_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              </PieChart>
            ) : (
              <div className="no-data">No department data available</div>
            )}
          </ResponsiveContainer>
          <div className="chart-legend">
            {dashboardData?.department_distribution?.map((item, i) => (
              <div key={i} className="legend-item"><span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }}></span>{item.name}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activity-section">
        <div className="section-header"><h3>Recent Activities</h3><button className="view-all-btn">View All</button></div>
        <div className="activity-timeline">
          {dashboardData?.recent_activities?.length > 0 ? (
            dashboardData.recent_activities.map((activity, i) => (
              <div key={activity.id || i} className="timeline-item">
                <div className="timeline-dot" style={{ background: COLORS[i % COLORS.length] }}></div>
                <div className="timeline-content">
                  <p><strong>{activity.action}</strong> - {activity.name} {activity.dept && <span className="dept-badge">{activity.dept}</span>}</p>
                  <span className="timeline-time">{activity.time ? new Date(activity.time).toLocaleDateString() : 'Just now'}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-activities">No recent activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;