import React, { useState } from 'react';
import { Target, TrendingUp, Award, Star, ChevronDown, BarChart3, Users, Calendar, MessageSquare } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const performanceData = [
  { name: 'Goals Met', value: 85, fill: '#6366f1' },
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
    <div className="performance-page">
      {/* Header */}
      <div className="perf-header">
        <div>
          <h1>📊 Performance</h1>
          <p>Track goals, reviews, and growth</p>
        </div>
        <div className="period-selector">
          <Calendar size={16} />
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>Q4 2024</option>
            <option>Q3 2024</option>
            <option>Q2 2024</option>
          </select>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Score Cards */}
      <div className="perf-score-grid">
        <div className="score-card main">
          <div className="score-chart">
            <ResponsiveContainer width={140} height={140}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={performanceData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#e5e7eb' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="score-center"><span className="score-value">85</span><span className="score-label">Score</span></div>
          </div>
          <div className="score-info">
            <h3>Overall Performance</h3>
            <p>Above expectations</p>
            <div className="score-badges">
              <span className="badge gold"><Award size={14} /> Top Performer</span>
              <span className="badge blue"><TrendingUp size={14} /> +12% vs last quarter</span>
            </div>
          </div>
        </div>

        <div className="score-card">
          <Target size={28} className="card-icon purple" />
          <div className="card-stats"><h3>4/6</h3><p>Goals Completed</p></div>
        </div>
        <div className="score-card">
          <Star size={28} className="card-icon yellow" />
          <div className="card-stats"><h3>4.5</h3><p>Avg Rating</p></div>
        </div>
        <div className="score-card">
          <MessageSquare size={28} className="card-icon green" />
          <div className="card-stats"><h3>12</h3><p>Feedbacks</p></div>
        </div>
      </div>

      <div className="perf-content">
        {/* Goals Section */}
        <div className="perf-section goals-section">
          <h3><Target size={18} /> My Goals</h3>
          <div className="goals-list">
            {goals.map(goal => (
              <div key={goal.id} className={`goal-item ${goal.status}`}>
                <div className="goal-info">
                  <h4>{goal.title}</h4>
                  <span className="goal-deadline">Due: {goal.deadline}</span>
                </div>
                <div className="goal-progress">
                  <div className="goal-bar"><div className="goal-fill" style={{ width: `${goal.progress}%` }}></div></div>
                  <span>{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Chart */}
        <div className="perf-section skills-section">
          <h3><BarChart3 size={18} /> Skills Assessment</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={skillsData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="skill" width={100} />
              <Tooltip />
              <Bar dataKey="score" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reviews */}
      <div className="perf-section reviews-section">
        <h3><Users size={18} /> Recent Reviews</h3>
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">{review.reviewer.charAt(0)}</div>
                  <div><h4>{review.reviewer}</h4><span>{review.type} • {review.date}</span></div>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(review.rating) ? 'filled' : ''} />
                  ))}
                  <span>{review.rating}</span>
                </div>
              </div>
              <p className="review-comment">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;

