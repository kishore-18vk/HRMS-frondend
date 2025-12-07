import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Users, Clock, CheckCircle, Trash2, X } from 'lucide-react';
import axios from 'axios';

// Icon mapping for the stats cards
const ICON_MAP = {
  'Open Positions': Briefcase,
  'Total Applicants': Users,
  'In Progress': Clock,
  'Hired This Month': CheckCircle
};

const Recruitment = () => {
  // State Management
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State for creating a new job
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    job_type: 'Full-time',
    status: 'Active',
    applicants_count: 0
  });

  // API URL (Ensure this matches your Django port)
  const API_URL = 'http://localhost:8000/api/recruitment/jobs/';

  // 1. READ: Fetch Data from API on Load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch jobs and stats in parallel
      const [jobsRes, statsRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${API_URL}dashboard_stats/`)
      ]);
      setJobs(jobsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // 2. CREATE: Submit new job to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setIsModalOpen(false);
      // Reset form
      setFormData({ 
        title: '', department: '', location: '', 
        job_type: 'Full-time', status: 'Active', applicants_count: 0 
      }); 
      fetchData(); // Refresh list to show new job
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job.");
    }
  };

  // 3. DELETE: Remove job via API
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchData(); // Refresh list
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  // Handle Input Change in Form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="recruitment-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Recruitment</h1>
          <p>Manage job postings and applications</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Post New Job
        </button>
      </div>

      {/* Stats Grid - Dynamic from API */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = ICON_MAP[stat.label] || Briefcase;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <IconComponent size={24} />
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Jobs List - Dynamic from API */}
      <div className="jobs-list">
        <h3>Job Postings</h3>
        {loading ? <p>Loading jobs...</p> : jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-info">
              <h4>{job.title}</h4>
              <div className="job-meta">
                <span>{job.department}</span>
                <span>{job.location}</span>
                <span>{job.job_type}</span>
              </div>
            </div>
            <div className="job-stats">
              <div className="applicant-count">
                <Users size={16} />
                <span>{job.applicants_count} applicants</span>
              </div>
              {/* Status Badge Logic */}
              <span className={`status-badge ${job.status === 'Active' ? 'success' : 'secondary'}`}>
                {job.status}
              </span>
            </div>
            <div className="job-actions">
              <button className="btn-outline">View Details</button>
              <button 
                className="btn-icon danger" 
                onClick={() => handleDelete(job.id)}
                title="Delete Job"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {!loading && jobs.length === 0 && <p>No job postings found.</p>}
      </div>

      {/* Create Job Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setIsModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Post New Job</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. Senior React Developer"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input 
                    type="text" 
                    name="department" 
                    value={formData.department} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. Remote"
                  />
                </div>
              </div>

              <div className="form-row">
                 <div className="form-group">
                  <label>Job Type</label>
                  <select name="job_type" value={formData.job_type} onChange={handleInputChange}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                 <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Added Applicants Count for Demo purposes */}
              <div className="form-group">
                  <label>Initial Applicants (Demo)</label>
                  <input 
                    type="number" 
                    name="applicants_count" 
                    value={formData.applicants_count} 
                    onChange={handleInputChange} 
                  />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;