import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, Circle, Clock, FileText, Video, Users, Award, ChevronRight, X, Plus, Calendar, Sparkles, Rocket } from 'lucide-react';
import { onboardingAPI, employeeAPI } from '../services/api';

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [newHires, setNewHires] = useState([]);
  const [employees, setEmployees] = useState([]); // List of employees for dropdown
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    employee: '',
    title: '',
    description: '',
    due_date: '',
    status: 'pending'
  });

  // 1. Fetch Data (Tasks, Hires, and Employee List)
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, hiresData, empData] = await Promise.all([
        onboardingAPI.getTasks(), 
        onboardingAPI.getNewHires(),
        employeeAPI.getAll() // We need this for the "Select Employee" dropdown
      ]);
      setTasks(tasksData);
      setNewHires(hiresData);
      setEmployees(empData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Create Task Submit
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await onboardingAPI.createTask(taskForm);
      setIsTaskModalOpen(false);
      setTaskForm({ employee: '', title: '', description: '', due_date: '', status: 'pending' }); // Reset form
      loadData(); // Refresh list to show new task
      alert("Task assigned successfully!");
    } catch (error) {
      alert("Failed to create task: " + error.message);
    }
  };

  // 3. Toggle Task Status (Done / Pending)
  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic Update (Update UI immediately)
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    try {
      await onboardingAPI.updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error("Update failed");
      loadData(); // Revert if API fails
    }
  };

  const getIcon = (title) => {
    if (title.includes('Profile')) return UserPlus;
    if (title.includes('Document')) return FileText;
    if (title.includes('Video')) return Video;
    return Award;
  };

  // Calculate Progress
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="onboarding-page page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><Rocket size={28} /> Onboarding</h1>
          <p>Track new employee onboarding progress</p>
        </div>
        <button className="btn-primary" onClick={() => setIsTaskModalOpen(true)}>
          <Plus size={18} /> Assign Task
        </button>
      </div>

      {/* Progress Overview */}
      <div className="vortex-progress-card">
        <div className="vortex-progress-info">
          <h2>Total Progress</h2>
          <p>{completedTasks} of {tasks.length} tasks completed</p>
        </div>
        <div className="vortex-progress-bar">
          <div className="vortex-progress-track">
            <div className="vortex-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="vortex-progress-percent">{progress}%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="vortex-tabs">
        <button className={`vortex-tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>All Tasks</button>
        <button className={`vortex-tab ${activeTab === 'newhires' ? 'active' : ''}`} onClick={() => setActiveTab('newhires')}>New Hires</button>
      </div>

      {loading ? <div className="loading"><div className="loader"></div></div> : (
        <>
          {/* TAB 1: TASKS LIST */}
          {activeTab === 'tasks' ? (
            <div className="vortex-page-card">
              {tasks.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No tasks assigned yet. Click "Assign Task" to start.</p>}

              {tasks.map((task) => {
                const Icon = getIcon(task.title);
                return (
                  <div key={task.id} className="vortex-list-item" onClick={() => toggleTaskStatus(task)}>
                    <div className={`vortex-list-icon ${task.status === 'completed' ? 'bg-green' : 'bg-yellow'}`}>
                      {task.status === 'completed' ? <CheckCircle size={22} /> : <Circle size={22} />}
                    </div>
                    <div className="vortex-list-content">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <div className="vortex-list-meta">
                        <span><Users size={12} /> {task.employee}</span>
                        <span><Calendar size={12} /> {task.due_date}</span>
                      </div>
                    </div>
                    <span className={`status-badge ${task.status === 'completed' ? 'success' : 'warning'}`}>
                      {task.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {task.status}
                    </span>
                    <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                );
              })}
            </div>
          ) : (
            /* TAB 2: NEW HIRES GRID */
            <div className="vortex-grid">
              {newHires.map(hire => (
                <div key={hire.id} className="vortex-grid-card">
                  <div className="vortex-grid-header">
                    <div className="vortex-grid-avatar" style={{ background: 'var(--gradient-secondary)' }}>
                      {hire.first_name[0]}{hire.last_name[0]}
                    </div>
                    <div className="vortex-grid-title">
                      <h3>{hire.first_name} {hire.last_name}</h3>
                      <p>{hire.designation}</p>
                    </div>
                  </div>
                  <div className="vortex-grid-details">
                    <div className="vortex-detail-row">
                      <span className="label">Department</span>
                      <span className="value">{hire.department}</span>
                    </div>
                    <div className="vortex-detail-row">
                      <span className="label">Joined</span>
                      <span className="value">{hire.date_of_joining}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Onboarding Progress</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{hire.progress}%</span>
                    </div>
                    <div className="vortex-progress-track" style={{ height: '8px' }}>
                      <div className="vortex-progress-fill" style={{ width: `${hire.progress}%`, background: 'var(--gradient-secondary)' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ============ TASK CREATION MODAL ============ */}
      {isTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2><Sparkles size={18} /> Assign New Task</h2>
              <button className="close-btn" onClick={() => setIsTaskModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Select Employee</label>
                <select
                  value={taskForm.employee}
                  onChange={(e) => setTaskForm({...taskForm, employee: e.target.value})}
                  required
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Upload ID Proof"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Details about the task..."
                  rows="3"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;