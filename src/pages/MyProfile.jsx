import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Building, Calendar, Briefcase, MapPin, Edit } from 'lucide-react';
import { employeeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await employeeAPI.getMyProfile();
            setProfile(data);
        } catch (err) {
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="loading-state">
                    <div className="loader"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="page-content">
                <div className="empty-state">
                    <User size={48} />
                    <h3>Profile Not Found</h3>
                    <p>Unable to load your profile information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content my-profile-page">
            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>View your personal and employment information</p>
                </div>
            </div>

            <div className="profile-container">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                    <div className="profile-avatar">
                        {profile.first_name?.charAt(0) || 'E'}{profile.last_name?.charAt(0) || ''}
                    </div>
                    <div className="profile-header-info">
                        <h2>{profile.first_name} {profile.last_name}</h2>
                        <p className="profile-role">{profile.designation || profile.job_title || 'Employee'}</p>
                        <p className="profile-dept">{profile.department}</p>
                        <span className={`status-badge ${profile.status === 'Active' ? 'success' : 'warning'}`}>
                            {profile.status || 'Active'}
                        </span>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div className="profile-grid">
                    {/* Personal Information */}
                    <div className="profile-card">
                        <div className="card-header">
                            <h3><User size={18} /> Personal Information</h3>
                        </div>
                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="detail-label">Employee ID</span>
                                <span className="detail-value">{profile.employee_id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Full Name</span>
                                <span className="detail-value">{profile.first_name} {profile.last_name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">
                                    <Mail size={14} /> {profile.email || 'Not provided'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Phone</span>
                                <span className="detail-value">
                                    <Phone size={14} /> {profile.phone || 'Not provided'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Date of Birth</span>
                                <span className="detail-value">{profile.date_of_birth || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Employment Information */}
                    <div className="profile-card">
                        <div className="card-header">
                            <h3><Briefcase size={18} /> Employment Information</h3>
                        </div>
                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="detail-label">Department</span>
                                <span className="detail-value">
                                    <Building size={14} /> {profile.department}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Designation</span>
                                <span className="detail-value">{profile.designation || profile.job_title || 'Employee'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Joining Date</span>
                                <span className="detail-value">
                                    <Calendar size={14} /> {profile.joining_date || profile.hire_date || 'Not provided'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Employment Type</span>
                                <span className="detail-value">{profile.employment_type || 'Full-time'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Reporting To</span>
                                <span className="detail-value">{profile.reporting_manager || 'Not assigned'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Address */}
                    <div className="profile-card full-width">
                        <div className="card-header">
                            <h3><MapPin size={18} /> Address Information</h3>
                        </div>
                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="detail-label">Address</span>
                                <span className="detail-value">{profile.address || 'Not provided'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">City</span>
                                <span className="detail-value">{profile.city || 'Not provided'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">State/Country</span>
                                <span className="detail-value">{profile.state || profile.country || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
