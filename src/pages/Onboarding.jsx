import React, { useState } from 'react';
import { UserPlus, CheckCircle, Circle, Clock, FileText, Video, Users, Award, ChevronRight, Mail, Calendar } from 'lucide-react';

const onboardingTasks = [
  { id: 1, title: 'Complete Profile', description: 'Fill in personal and contact information', icon: UserPlus, status: 'completed', dueDate: 'Dec 5' },
  { id: 2, title: 'Upload Documents', description: 'ID proof, address proof, certificates', icon: FileText, status: 'completed', dueDate: 'Dec 6' },
  { id: 3, title: 'Watch Training Videos', description: 'Company policies and procedures', icon: Video, status: 'in-progress', dueDate: 'Dec 8' },
  { id: 4, title: 'Meet Your Team', description: 'Introduction with team members', icon: Users, status: 'pending', dueDate: 'Dec 10' },
  { id: 5, title: 'Complete IT Setup', description: 'Get system access and tools', icon: Award, status: 'pending', dueDate: 'Dec 12' },
];

const newHires = [
  { id: 1, name: 'Emma Wilson', role: 'Frontend Developer', dept: 'Engineering', startDate: 'Dec 15', avatar: 'EW', progress: 80 },
  { id: 2, name: 'James Chen', role: 'Product Manager', dept: 'Product', startDate: 'Dec 18', avatar: 'JC', progress: 45 },
  { id: 3, name: 'Sarah Miller', role: 'UX Designer', dept: 'Design', startDate: 'Dec 20', avatar: 'SM', progress: 20 },
];

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const completedTasks = onboardingTasks.filter(t => t.status === 'completed').length;
  const progress = Math.round((completedTasks / onboardingTasks.length) * 100);

  return (
    <div className="onboarding-page">
      {/* Header */}
      <div className="onboard-header">
        <div>
          <h1>🚀 Onboarding</h1>
          <p>Track new employee onboarding progress</p>
        </div>
        <button className="btn-add-hire"><UserPlus size={18} /> Add New Hire</button>
      </div>

      {/* Progress Overview */}
      <div className="onboard-progress-card">
        <div className="progress-info">
          <h2>Your Onboarding Progress</h2>
          <p>{completedTasks} of {onboardingTasks.length} tasks completed</p>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-percent">{progress}%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="onboard-tabs">
        <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>My Tasks</button>
        <button className={`tab ${activeTab === 'newhires' ? 'active' : ''}`} onClick={() => setActiveTab('newhires')}>New Hires</button>
      </div>

      {activeTab === 'tasks' ? (
        /* Tasks List */
        <div className="tasks-timeline">
          {onboardingTasks.map((task, index) => (
            <div key={task.id} className={`task-item ${task.status}`}>
              <div className="task-status-icon">
                {task.status === 'completed' ? <CheckCircle size={24} /> : 
                 task.status === 'in-progress' ? <Clock size={24} /> : <Circle size={24} />}
              </div>
              <div className="task-content">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`task-badge ${task.status}`}>
                    {task.status === 'completed' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <p>{task.description}</p>
                <div className="task-meta">
                  <Calendar size={14} /> Due: {task.dueDate}
                </div>
              </div>
              <ChevronRight size={20} className="task-arrow" />
            </div>
          ))}
        </div>
      ) : (
        /* New Hires Grid */
        <div className="newhires-grid">
          {newHires.map(hire => (
            <div key={hire.id} className="newhire-card">
              <div className="newhire-header">
                <div className="newhire-avatar">{hire.avatar}</div>
                <div className="newhire-info">
                  <h3>{hire.name}</h3>
                  <p>{hire.role}</p>
                </div>
              </div>
              <div className="newhire-details">
                <div className="detail-row">
                  <span className="label">Department</span>
                  <span className="value">{hire.dept}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Start Date</span>
                  <span className="value">{hire.startDate}</span>
                </div>
              </div>
              <div className="newhire-progress">
                <div className="progress-label">
                  <span>Onboarding Progress</span>
                  <span>{hire.progress}%</span>
                </div>
                <div className="mini-progress-bar">
                  <div className="mini-progress-fill" style={{ width: `${hire.progress}%` }}></div>
                </div>
              </div>
              <div className="newhire-actions">
                <button className="btn-icon"><Mail size={16} /></button>
                <button className="btn-view">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Onboarding;

