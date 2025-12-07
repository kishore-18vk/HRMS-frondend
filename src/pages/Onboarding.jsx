import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, Circle, Clock, FileText, Video, Users, Award, ChevronRight, X, Plus, Calendar } from 'lucide-react';
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
      <div className="onboard-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🚀 Onboarding</h1>
          <p className="text-gray-500">Track new employee onboarding progress</p>
        </div>
        
        {/* NEW BUTTON: Assign Task */}
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsTaskModalOpen(true)}>
          <Plus size={18} /> Assign Task
        </button>
      </div>

      {/* Progress Overview */}
      <div className="onboard-progress-card bg-white p-6 rounded-xl border border-gray-200 mb-8 flex justify-between items-center shadow-sm">
        <div className="progress-info">
          <h2 className="text-lg font-bold">Total Progress</h2>
          <p className="text-gray-500">{completedTasks} of {tasks.length} tasks completed</p>
        </div>
        <div className="progress-bar-container w-1/2 flex items-center gap-4">
          <div className="progress-bar-bg h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="progress-bar-fill h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-percent font-bold text-indigo-600">{progress}%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="onboard-tabs flex gap-6 border-b border-gray-200 mb-6">
        <button className={`pb-2 ${activeTab === 'tasks' ? 'border-b-2 border-indigo-500 text-indigo-600 font-bold' : 'text-gray-500'}`} onClick={() => setActiveTab('tasks')}>All Tasks</button>
        <button className={`pb-2 ${activeTab === 'newhires' ? 'border-b-2 border-indigo-500 text-indigo-600 font-bold' : 'text-gray-500'}`} onClick={() => setActiveTab('newhires')}>New Hires</button>
      </div>

      {loading ? <p className="text-center p-8 text-gray-500">Loading...</p> : (
        <>
          {/* TAB 1: TASKS LIST */}
          {activeTab === 'tasks' ? (
            <div className="tasks-timeline space-y-4">
              {tasks.length === 0 && <p className="text-gray-500">No tasks assigned yet. Click "Assign Task" to start.</p>}
              
              {tasks.map((task) => {
                const Icon = getIcon(task.title);
                return (
                  <div key={task.id} className="task-item bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleTaskStatus(task)}>
                    <div className={`p-2 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {task.status === 'completed' ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </div>
                    <div className="task-content flex-1">
                      <div className="task-header flex justify-between">
                        <h3 className="font-bold text-gray-800">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${task.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      {/* Show who the task is assigned to (Requires backend serializer update to send employee_name, otherwise just shows ID) */}
                      <div className="task-meta text-xs text-gray-400 mt-2 flex items-center gap-4">
                         <span className="flex items-center gap-1"><Users size={12}/> Employee ID: {task.employee}</span>
                         <span className="flex items-center gap-1"><Calendar size={12}/> Due: {task.due_date}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                  </div>
                );
              })}
            </div>
          ) : (
            /* TAB 2: NEW HIRES GRID */
            <div className="newhires-grid grid grid-cols-1 md:grid-cols-3 gap-6">
              {newHires.map(hire => (
                <div key={hire.id} className="newhire-card bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="newhire-header flex items-center gap-3 mb-4">
                    <div className="newhire-avatar w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {hire.first_name[0]}{hire.last_name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{hire.first_name} {hire.last_name}</h3>
                      <p className="text-xs text-gray-500">{hire.designation}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Department</span>
                      <span>{hire.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Joined</span>
                      <span>{hire.date_of_joining}</span>
                    </div>
                  </div>
                  <div className="newhire-progress">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Onboarding</span>
                      <span className="font-bold">{hire.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${hire.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ============ MANUAL TASK CREATION MODAL ============ */}
      {isTaskModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="modal-header p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg">Assign New Task</h2>
              <button onClick={() => setIsTaskModalOpen(false)}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              
              {/* Employee Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
                <select 
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Upload ID Proof"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Details about the task..."
                  rows="3"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
                  onClick={() => setIsTaskModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;