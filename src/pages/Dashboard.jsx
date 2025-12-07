import React, { useEffect, useState } from 'react';
import { Users, Clock, Calendar, TrendingUp, TrendingDown, UserPlus, UserCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardAPI } from '../services/api'; // <--- IMPORT THE NEW API

// Icon Map to match backend titles to Lucide icons
const ICON_MAP = {
  'Total Employees': Users,
  'Present Today': UserCheck,
  'On Leave': Calendar,
  'Open Positions': UserPlus
};

// Colors for Pie Chart
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6'];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // <--- CALL THE NEW DASHBOARD API
        const data = await dashboardAPI.getStats();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="p-8 text-center text-red-500">Failed to load data.</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your team.</p>
      </div>

      {/* 1. Stats Grid */}
      <div className="stats-grid">
        {dashboardData.stats.map((stat, index) => {
          const Icon = ICON_MAP[stat.title] || Users;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <Icon size={24} />
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
          );
        })}
      </div>

      <div className="charts-row">
        {/* 2. Attendance Chart */}
        <div className="chart-card">
          <h3>Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dashboardData.attendance_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="present" stroke="#6366f1" fill="#6366f120" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Department Distribution */}
        <div className="chart-card">
          <h3>Department Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            {dashboardData.department_distribution && dashboardData.department_distribution.length > 0 ? (
              <PieChart>
                <Pie 
                  data={dashboardData.department_distribution} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  label
                >
                  {dashboardData.department_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No department data available
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Recent Activities */}
      <div className="activity-card">
        <h3>Recent Activities</h3>
        <div className="activity-list">
          {dashboardData.recent_activities.length > 0 ? (
            dashboardData.recent_activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p>
                    <strong>{activity.action}</strong> - {activity.name} {activity.dept && `(${activity.dept})`}
                  </p>
                  <span className="text-sm text-gray-500">
                    {activity.time ? new Date(activity.time).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-4">No recent activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;