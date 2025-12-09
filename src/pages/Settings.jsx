import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Globe, Palette, Database, Save, X } from 'lucide-react';
import { settingsAPI } from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    email_notifications: true,
    push_notifications: false,
    language: 'en',
    two_factor_enabled: false
  });
  
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  // Fetch Settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsAPI.getSettings();
        if(data) setSettings(data);
      } catch (error) {
        console.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Save Settings
  const handleSave = async () => {
    try {
      await settingsAPI.updateSettings(settings);
      setActiveModal(null);
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings.");
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const changeSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-page page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your application preferences and configurations</p>
        </div>
      </div>

      {/* Grid Layout matching your CSS */}
      <div className="settings-grid">
        
        {/* 1. Profile Settings */}
        <div className="settings-card">
          <div className="settings-icon"><User size={28} /></div>
          <h3>Profile Settings</h3>
          <p>Update your personal information and profile picture</p>
          <button className="btn-outline">Manage</button>
        </div>

        {/* 2. Notifications */}
        <div className="settings-card">
          <div className="settings-icon"><Bell size={28} /></div>
          <h3>Notifications</h3>
          <p>Email: <strong>{settings.email_notifications ? 'On' : 'Off'}</strong> • Push: <strong>{settings.push_notifications ? 'On' : 'Off'}</strong></p>
          <button className="btn-outline" onClick={() => setActiveModal('notifications')}>Manage</button>
        </div>

        {/* 3. Security */}
        <div className="settings-card">
          <div className="settings-icon"><Lock size={28} /></div>
          <h3>Security</h3>
          <p>2FA Status: <span className={settings.two_factor_enabled ? "text-success" : "text-danger"}>{settings.two_factor_enabled ? 'Enabled' : 'Disabled'}</span></p>
          <button className="btn-outline" onClick={() => setActiveModal('security')}>Manage</button>
        </div>

        {/* 4. Language */}
        <div className="settings-card">
          <div className="settings-icon"><Globe size={28} /></div>
          <h3>Language & Region</h3>
          <p>Current Language: <strong>{settings.language.toUpperCase()}</strong></p>
          <button className="btn-outline" onClick={() => setActiveModal('language')}>Manage</button>
        </div>

        {/* 5. Appearance */}
        <div className="settings-card">
          <div className="settings-icon"><Palette size={28} /></div>
          <h3>Appearance</h3>
          <p>Theme: <strong>{settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}</strong></p>
          <button className="btn-outline" onClick={() => setActiveModal('appearance')}>Manage</button>
        </div>

        {/* 6. Data & Privacy */}
        <div className="settings-card">
          <div className="settings-icon"><Database size={28} /></div>
          <h3>Data & Privacy</h3>
          <p>Manage your data and privacy settings</p>
          <button className="btn-outline">Manage</button>
        </div>
      </div>

      {/* === MODALS (Using Vortex Styling) === */}
      {activeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit {activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}</h2>
              <button className="close-btn" onClick={() => setActiveModal(null)}><X size={20} /></button>
            </div>
            
            <div className="p-6">
              {/* Notifications Form */}
              {activeModal === 'notifications' && (
                <div className="space-y-4">
                  <div className="form-group checkbox-group">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={settings.email_notifications} 
                        onChange={() => toggleSetting('email_notifications')} 
                      />
                      <span>Enable Email Notifications</span>
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={settings.push_notifications} 
                        onChange={() => toggleSetting('push_notifications')} 
                      />
                      <span>Enable Push Notifications</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Appearance Form */}
              {activeModal === 'appearance' && (
                <div className="form-group">
                  <label>Interface Theme</label>
                  <select value={settings.theme} onChange={(e) => changeSetting('theme', e.target.value)}>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              )}

              {/* Security Form */}
              {activeModal === 'security' && (
                <div className="form-group checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={settings.two_factor_enabled} 
                      onChange={() => toggleSetting('two_factor_enabled')} 
                    />
                    <span>Enable Two-Factor Authentication (2FA)</span>
                  </label>
                  <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem'}}>
                    We will ask for a verification code via email when you log in from a new device.
                  </p>
                </div>
              )}

              {/* Language Form */}
              {activeModal === 'language' && (
                <div className="form-group">
                  <label>Preferred Language</label>
                  <select value={settings.language} onChange={(e) => changeSetting('language', e.target.value)}>
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button className="btn-secondary" style={{flex: 1}} onClick={() => setActiveModal(null)}>Cancel</button>
                <button className="btn-primary" style={{flex: 1}} onClick={handleSave}>
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;