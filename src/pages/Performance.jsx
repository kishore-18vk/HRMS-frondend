import React, { useState } from 'react';
import { Target, TrendingUp, Award, Star, ChevronDown, BarChart3, Users, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const performanceData = [
  { name: 'Goals Met', value: 85, fill: '#7c3aed' },
];

const skillsData = [
  { skill: 'Communication', score: 90 },
  { skill: 'Technical', score: 85 },
  { skill: 'Leadership', score: 75 },
  { skill: 'Teamwork', score: 95 },
  { skill: 'Problem Solving', score: 80 },
];

const reviews = [
  { id: 1, reviewer: 'John Manager', date: 'Nov 2024', rating: 4.5, comment: 'Excellent performance this quarter. Great initiative on the new project.', type: 'Quarterly Review' },
  { id: 2, reviewer: 'Sarah Lead', date: 'Oct 2024', rating: 4.0, comment: 'Good collaboration with the team. Could improve on time management.', type: 'Peer Review' },
];

const goals = [
  { id: 1, title: 'Complete React Training', progress: 100, deadline: 'Dec 1', status: 'completed' },
  { id: 2, title: 'Lead Sprint Planning', progress: 75, deadline: 'Dec 15', status: 'in-progress' },
  { id: 3, title: 'Mentor Junior Developer', progress: 40, deadline: 'Dec 30', status: 'in-progress' },
  { id: 4, title: 'Improve Code Coverage', progress: 0, deadline: 'Jan 15', status: 'pending' },
];

const Performance = () => {
  const [period, setPeriod] = useState('Q4 2024');

  return (
    <div className="performance-page page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><BarChart3 size={28} /> Performance</h1>
          <p>Track goals, reviews, and growth</p>
        </div>
        <div className="period-selector" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.6rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} style={{ color: 'var(--primary)' }} />
          <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ border: 'none', background: 'none', fontWeight: 500, cursor: 'pointer' }}>
            <option>Q4 2024</option>
            <option>Q3 2024</option>
            <option>Q2 2024</option>
          </select>
        </div>
      </div>

      {/* Score Cards */}
      <div className="vortex-stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="vortex-stat-item" style={{ '--stat-color': '#7c3aed', flex: 2, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <ResponsiveContainer width={120} height={120}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={performanceData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#e5e7eb' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>85</span>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.3rem' }}>Overall Performance</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>Above expectations</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="status-badge success"><Award size={12} /> Top Performer</span>
                <span className="status-badge info"><TrendingUp size={12} /> +12%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vortex-stat-item" style={{ '--stat-color': '#7c3aed' }}>
          <div className="vortex-stat-icon bg-purple"><Target size={22} /></div>
          <div className="vortex-stat-info"><h3>4/6</h3><p>Goals Completed</p></div>
        </div>
        <div className="vortex-stat-item" style={{ '--stat-color': '#f59e0b' }}>
          <div className="vortex-stat-icon bg-yellow"><Star size={22} /></div>
          <div className="vortex-stat-info"><h3>4.5</h3><p>Avg Rating</p></div>
        </div>
        <div className="vortex-stat-item" style={{ '--stat-color': '#22c55e' }}>
          <div className="vortex-stat-icon bg-green"><MessageSquare size={22} /></div>
          <div className="vortex-stat-info"><h3>12</h3><p>Feedbacks</p></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Goals Section */}
        <div className="vortex-page-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}><Target size={18} style={{ color: 'var(--primary)' }} /> My Goals</h3>
          {goals.map(goal => (
            <div key={goal.id} className="vortex-list-item" style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--border)' }}>
              <div className={`vortex-list-icon ${goal.status === 'completed' ? 'bg-green' : goal.status === 'in-progress' ? 'bg-purple' : 'bg-gray'}`}>
                {goal.status === 'completed' ? <CheckCircle size={18} /> : <Target size={18} />}
              </div>
              <div className="vortex-list-content" style={{ flex: 1 }}>
                <h4>{goal.title}</h4>
                <p>Due: {goal.deadline}</p>
              </div>
              <div style={{ width: '100px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="vortex-progress-track" style={{ height: '6px', flex: 1 }}>
                  <div className="vortex-progress-fill" style={{ width: `${goal.progress}%`, background: goal.status === 'completed' ? 'var(--success)' : 'var(--gradient-primary)' }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Chart */}
        <div className="vortex-page-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}><BarChart3 size={18} style={{ color: 'var(--primary)' }} /> Skills Assessment</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={skillsData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="skill" width={100} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="score" fill="url(#skillGradient)" radius={[0, 8, 8, 0]} />
              <defs>
                <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reviews */}
      <div className="vortex-page-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}><Users size={18} style={{ color: 'var(--primary)' }} /> Recent Reviews</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{review.reviewer.charAt(0)}</div>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{review.reviewer}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{review.type} • {review.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} style={{ fill: i < Math.floor(review.rating) ? '#f59e0b' : 'none', color: i < Math.floor(review.rating) ? '#f59e0b' : '#d1d5db' }} />
                  ))}
                  <span style={{ marginLeft: '0.3rem', fontWeight: 600, color: '#f59e0b' }}>{review.rating}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;

