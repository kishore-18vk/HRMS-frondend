import { User, Bell, Lock, Globe, Palette, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your application preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-icon"><User size={24} /></div>
          <h3>Profile Settings</h3>
          <p>Update your personal information and profile picture</p>
          <button className="btn-outline">Manage</button>
        </div>

        <div className="settings-card">
          <div className="settings-icon"><Bell size={24} /></div>
          <h3>Notifications</h3>
          <p>Configure email and push notification preferences</p>
          <button className="btn-outline">Manage</button>
        </div>

        <div className="settings-card">
          <div className="settings-icon"><Lock size={24} /></div>
          <h3>Security</h3>
          <p>Change password and enable two-factor authentication</p>
          <button className="btn-outline">Manage</button>
        </div>

        <div className="settings-card">
          <div className="settings-icon"><Globe size={24} /></div>
          <h3>Language & Region</h3>
          <p>Set your preferred language and timezone</p>
          <button className="btn-outline">Manage</button>
        </div>

        <div className="settings-card">
          <div className="settings-icon"><Palette size={24} /></div>
          <h3>Appearance</h3>
          <p>Customize theme and display preferences</p>
          <button className="btn-outline">Manage</button>
        </div>

        <div className="settings-card">
          <div className="settings-icon"><Database size={24} /></div>
          <h3>Data & Privacy</h3>
          <p>Manage your data and privacy settings</p>
          <button className="btn-outline">Manage</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

