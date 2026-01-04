import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Flame,
  User,
  Bell,
  Home,
  Shield,
  ChevronDown,
  Save,
  Plus,
  Trash2,
  Edit2,
  LogOut
} from 'lucide-react';

/**
 * Settings Page Component
 * Epic E2: User Settings & Profile Management
 */

type SettingsTab = 'profile' | 'notifications' | 'homes' | 'security';

const Settings: React.FC = () => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    phone: user?.profile?.phone || ''
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    maintenanceReminders: true,
    systemAlerts: true,
    weeklyReports: false,
    emailNotifications: true,
    pushNotifications: false
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock homes data (will be replaced with API call)
  const [homes, setHomes] = useState([
    { id: '1', name: 'Main Cabin', location: 'Yellowknife, NT', systems: 5 },
    { id: '2', name: 'Summer Cottage', location: 'Great Slave Lake', systems: 3 }
  ]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateProfile({
        profile: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone
        }
      });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationsSave = () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // TODO: Connect to backend API
    setTimeout(() => {
      setSuccessMessage('Notification preferences saved!');
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 500);
  };

  const handlePasswordChange = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      setIsSaving(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmPassword
      });
      setSuccessMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteHome = (homeId: string) => {
    // TODO: Connect to backend API
    setHomes(homes.filter(h => h.id !== homeId));
    setSuccessMessage('Home removed successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'homes' as SettingsTab, label: 'My Homes', icon: Home },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Warm Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff4500]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff6a00]/12 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff8c00]/8 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-[#d4a373]/10 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,53,0.3)]">
                <Flame className="w-6 h-6 text-[#f4e8d8]" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#f4e8d8] tracking-tight">
                  FurnaceLog
                </h1>
                <p className="text-xs text-[#d4a373] font-medium">Northern Home Tracker</p>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-[#d4a373] hover:text-[#ff6a00] transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-[#d4a373] hover:text-[#ff6a00] transition-colors duration-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/wiki')}
                className="px-4 py-2 text-[#d4a373] hover:text-[#ff6a00] transition-colors duration-200"
              >
                Wiki
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 text-[#ff6a00] font-semibold transition-colors duration-200"
              >
                Settings
              </button>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/20 rounded-xl hover:border-[#ff6a00]/40 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-[#f4e8d8]" />
                </div>
                <span className="text-[#f4e8d8] font-medium">{user?.profile?.firstName || 'User'}</span>
                <ChevronDown className={`w-4 h-4 text-[#d4a373] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/20 rounded-xl shadow-2xl overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full px-4 py-3 text-left text-[#d4a373] hover:bg-[#ff6a00]/10 hover:text-[#ff6a00] transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-[#d45d4e] hover:bg-[#d45d4e]/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#f4e8d8] mb-2">Settings</h1>
          <p className="text-[#d4a373] text-lg">Manage your account and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-gradient-to-br from-[#6a994e]/20 to-[#6a994e]/10 border-2 border-[#6a994e]/40 rounded-xl p-4 animate-slide-down">
            <p className="text-sm text-[#6a994e]">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-gradient-to-br from-[#d45d4e]/20 to-[#d45d4e]/10 border-2 border-[#d45d4e]/40 rounded-xl p-4 animate-slide-down">
            <p className="text-sm text-[#d45d4e]">{errorMessage}</p>
          </div>
        )}

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/10 rounded-2xl p-4 shadow-2xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#ff4500] to-[#ff6a00] text-[#f4e8d8] font-semibold shadow-[0_4px_16px_rgba(255,107,53,0.3)]'
                        : 'text-[#d4a373] hover:bg-[#2a2a2a]/60 hover:text-[#ff6a00]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/10 rounded-2xl p-8 shadow-2xl">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-[#f4e8d8] mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#f4e8d8] mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 border-[#d4a373]/30 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#f4e8d8] mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 border-[#d4a373]/30 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#f4e8d8] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 bg-[#2a2a2a]/40 border-b-2 border-[#d4a373]/20 text-[#d4a373]/60 rounded-t-xl cursor-not-allowed"
                      />
                      <p className="mt-2 text-xs text-[#d4a373]/70">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#f4e8d8] mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+1 (867) 555-0100"
                        className="w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 border-[#d4a373]/30 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                      />
                    </div>

                    <button
                      onClick={handleProfileSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] hover:shadow-[0_8px_32px_rgba(255,107,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-[#f4e8d8] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.35)]"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-[#f4e8d8] mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#2a2a2a]/40 rounded-xl border border-[#d4a373]/10">
                        <div>
                          <h3 className="text-[#f4e8d8] font-semibold">Maintenance Reminders</h3>
                          <p className="text-sm text-[#d4a373]/70">Get notified about upcoming maintenance tasks</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.maintenanceReminders}
                            onChange={(e) => setNotifications({ ...notifications, maintenanceReminders: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ff4500] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#ff4500] peer-checked:to-[#ff6a00]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#2a2a2a]/40 rounded-xl border border-[#d4a373]/10">
                        <div>
                          <h3 className="text-[#f4e8d8] font-semibold">System Alerts</h3>
                          <p className="text-sm text-[#d4a373]/70">Critical alerts about your home systems</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.systemAlerts}
                            onChange={(e) => setNotifications({ ...notifications, systemAlerts: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ff4500] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#ff4500] peer-checked:to-[#ff6a00]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#2a2a2a]/40 rounded-xl border border-[#d4a373]/10">
                        <div>
                          <h3 className="text-[#f4e8d8] font-semibold">Weekly Reports</h3>
                          <p className="text-sm text-[#d4a373]/70">Weekly summary of your home maintenance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.weeklyReports}
                            onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ff4500] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#ff4500] peer-checked:to-[#ff6a00]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#2a2a2a]/40 rounded-xl border border-[#d4a373]/10">
                        <div>
                          <h3 className="text-[#f4e8d8] font-semibold">Email Notifications</h3>
                          <p className="text-sm text-[#d4a373]/70">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ff4500] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#ff4500] peer-checked:to-[#ff6a00]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#2a2a2a]/40 rounded-xl border border-[#d4a373]/10">
                        <div>
                          <h3 className="text-[#f4e8d8] font-semibold">Push Notifications</h3>
                          <p className="text-sm text-[#d4a373]/70">Browser push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.pushNotifications}
                            onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ff4500] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#ff4500] peer-checked:to-[#ff6a00]"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleNotificationsSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] hover:shadow-[0_8px_32px_rgba(255,107,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-[#f4e8d8] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.35)]"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* My Homes Tab */}
              {activeTab === 'homes' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#f4e8d8]">My Homes</h2>
                      <p className="text-[#d4a373] mt-1">Manage your registered properties</p>
                    </div>
                    <button
                      onClick={() => navigate('/onboarding')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] hover:shadow-[0_6px_24px_rgba(255,107,53,0.45)] text-[#f4e8d8] font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.3)]"
                    >
                      <Plus className="w-4 h-4" />
                      Add Home
                    </button>
                  </div>

                  <div className="space-y-4">
                    {homes.map((home) => (
                      <div
                        key={home.id}
                        className="p-6 bg-[#2a2a2a]/40 rounded-xl border border-[#d4a373]/10 hover:border-[#ff6a00]/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#f4e8d8] mb-2">{home.name}</h3>
                            <p className="text-[#d4a373] mb-3">{home.location}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-[#d4a373]/70">
                                {home.systems} systems tracked
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/onboarding?homeId=${home.id}`)}
                              className="p-2 text-[#d4a373] hover:text-[#ff6a00] hover:bg-[#2a2a2a] rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHome(home.id)}
                              className="p-2 text-[#d45d4e] hover:text-[#f4e8d8] hover:bg-[#d45d4e]/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {homes.length === 0 && (
                      <div className="text-center py-12">
                        <Home className="w-16 h-16 text-[#d4a373]/30 mx-auto mb-4" />
                        <p className="text-[#d4a373] mb-4">No homes registered yet</p>
                        <button
                          onClick={() => navigate('/onboarding')}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] hover:shadow-[0_6px_24px_rgba(255,107,53,0.45)] text-[#f4e8d8] font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.3)]"
                        >
                          <Plus className="w-4 h-4" />
                          Add Your First Home
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-[#f4e8d8] mb-6">Security Settings</h2>
                  <div className="space-y-8">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#f4e8d8] mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#f4e8d8] mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 border-[#d4a373]/30 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#f4e8d8] mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 border-[#d4a373]/30 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#f4e8d8] mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 border-[#d4a373]/30 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                          />
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] hover:shadow-[0_8px_32px_rgba(255,107,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-[#f4e8d8] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.35)]"
                        >
                          <Shield className="w-4 h-4" />
                          {isSaving ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-8 border-t border-[#d45d4e]/20">
                      <h3 className="text-lg font-semibold text-[#d45d4e] mb-4">Danger Zone</h3>
                      <div className="p-6 bg-[#d45d4e]/10 border-2 border-[#d45d4e]/30 rounded-xl">
                        <h4 className="text-[#f4e8d8] font-semibold mb-2">Delete Account</h4>
                        <p className="text-sm text-[#d4a373]/70 mb-4">
                          Once you delete your account, there is no going back. All your data will be permanently removed.
                        </p>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                              // TODO: Connect to backend API
                              alert('Account deletion would be processed here');
                            }
                          }}
                          className="px-6 py-3 bg-[#d45d4e] hover:bg-[#d45d4e]/90 text-[#f4e8d8] font-bold rounded-xl transition-all duration-300"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
