import { Plus, Briefcase, Users, Clock, CheckCircle } from 'lucide-react';

const jobs = [
  { id: 1, title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', applicants: 45, status: 'Active', posted: '2024-11-20' },
  { id: 2, title: 'Marketing Manager', department: 'Marketing', location: 'New York', type: 'Full-time', applicants: 28, status: 'Active', posted: '2024-11-25' },
  { id: 3, title: 'Sales Executive', department: 'Sales', location: 'Los Angeles', type: 'Full-time', applicants: 32, status: 'Active', posted: '2024-11-28' },
  { id: 4, title: 'HR Specialist', department: 'HR', location: 'Chicago', type: 'Full-time', applicants: 18, status: 'Closed', posted: '2024-10-15' },
  { id: 5, title: 'UI/UX Designer', department: 'Engineering', location: 'Remote', type: 'Contract', applicants: 56, status: 'Active', posted: '2024-12-01' },
];

const stats = [
  { label: 'Open Positions', value: 12, icon: Briefcase, color: '#6366f1' },
  { label: 'Total Applicants', value: 179, icon: Users, color: '#22c55e' },
  { label: 'In Progress', value: 34, icon: Clock, color: '#f59e0b' },
  { label: 'Hired This Month', value: 5, icon: CheckCircle, color: '#ec4899' },
];

const Recruitment = () => {
  return (
    <div className="recruitment-page">
      <div className="page-header">
        <div>
          <h1>Recruitment</h1>
          <p>Manage job postings and applications</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} /> Post New Job
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="jobs-list">
        <h3>Job Postings</h3>
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-info">
              <h4>{job.title}</h4>
              <div className="job-meta">
                <span>{job.department}</span>
                <span>{job.location}</span>
                <span>{job.type}</span>
              </div>
            </div>
            <div className="job-stats">
              <div className="applicant-count">
                <Users size={16} />
                <span>{job.applicants} applicants</span>
              </div>
              <span className={`status-badge ${job.status === 'Active' ? 'success' : 'secondary'}`}>
                {job.status}
              </span>
            </div>
            <div className="job-actions">
              <button className="btn-outline">View Details</button>
              <button className="btn-primary">View Applicants</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recruitment;

