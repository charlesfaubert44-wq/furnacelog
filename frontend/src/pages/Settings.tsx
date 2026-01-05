import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Bell,
  Home as HomeIcon,
  Shield,
  ChevronDown,
  Save,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Settings as SettingsIcon,
  BookOpen
} from 'lucide-react';
import { Logo } from '@/components/furnacelog/Logo';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/useScrollAnimation';

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
  const { isScrolled } = useScrollPosition();

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
    { id: 'homes' as SettingsTab, label: 'My Homes', icon: HomeIcon },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-warm-white relative overflow-hidden">
      {/* Subtle warm background texture */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-white via-cream to-warm-white opacity-60" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%)`
        }} />
      </div>

      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-soft-amber/20 bg-warm-white/95 backdrop-blur-md shadow-sm"
          : "border-soft-amber/10 bg-warm-white/80 backdrop-blur-sm"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-80">
                <Logo size="sm" />
              </button>

              {/* Main Navigation Menu */}
              <nav className="hidden md:flex items-center gap-1 ml-8">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Homepage
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/wiki')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Knowledge Base
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  About
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Contact Us
                </button>
              </nav>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
              >
                <User className="w-4 h-4" />
                <span>{user?.profile?.firstName || user?.email || 'User'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-soft-amber/20 rounded-xl shadow-lg py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/dashboard');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                  >
                    <HomeIcon className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/wiki');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Knowledge Base
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="border-t border-soft-amber/10 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
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
          <h1 className="text-4xl font-bold text-charcoal mb-2">Settings</h1>
          <p className="text-warm-gray text-lg">Manage your account and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-sage/10 border-2 border-sage/40 rounded-xl p-4 animate-slide-down">
            <p className="text-sm text-sage font-semibold">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-warm-coral/10 border-2 border-warm-coral/40 rounded-xl p-4 animate-slide-down">
            <p className="text-sm text-warm-coral font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-soft-amber/20 rounded-2xl p-4 shadow-md sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300",
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-burnt-sienna to-warm-orange text-white font-semibold shadow-md'
                        : 'text-warm-gray hover:bg-cream hover:text-charcoal'
                    )}
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
            <div className="bg-white border border-soft-amber/20 rounded-2xl p-8 shadow-md">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full px-4 py-3 bg-cream/50 border-2 border-soft-amber/20 text-charcoal placeholder-warm-gray/50 rounded-xl focus:outline-none focus:border-warm-orange/40 focus:shadow-md transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full px-4 py-3 bg-cream/50 border-2 border-soft-amber/20 text-charcoal placeholder-warm-gray/50 rounded-xl focus:outline-none focus:border-warm-orange/40 focus:shadow-md transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 bg-soft-beige/50 border-2 border-soft-amber/10 text-warm-gray/60 rounded-xl cursor-not-allowed"
                      />
                      <p className="mt-2 text-xs text-warm-gray/70">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+1 (867) 555-0100"
                        className="w-full px-4 py-3 bg-cream/50 border-2 border-soft-amber/20 text-charcoal placeholder-warm-gray/50 rounded-xl focus:outline-none focus:border-warm-orange/40 focus:shadow-md transition-all duration-300"
                      />
                    </div>

                    <button
                      onClick={handleProfileSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
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
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-cream/40 rounded-xl border border-soft-amber/10">
                        <div>
                          <h3 className="text-charcoal font-semibold">Maintenance Reminders</h3>
                          <p className="text-sm text-warm-gray/70">Get notified about upcoming maintenance tasks</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.maintenanceReminders}
                            onChange={(e) => setNotifications({ ...notifications, maintenanceReminders: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-cream peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-warm-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-burnt-sienna peer-checked:to-warm-orange"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-cream/40 rounded-xl border border-soft-amber/10">
                        <div>
                          <h3 className="text-charcoal font-semibold">System Alerts</h3>
                          <p className="text-sm text-warm-gray/70">Critical alerts about your home systems</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.systemAlerts}
                            onChange={(e) => setNotifications({ ...notifications, systemAlerts: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-cream peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-warm-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-burnt-sienna peer-checked:to-warm-orange"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-cream/40 rounded-xl border border-soft-amber/10">
                        <div>
                          <h3 className="text-charcoal font-semibold">Weekly Reports</h3>
                          <p className="text-sm text-warm-gray/70">Weekly summary of your home maintenance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.weeklyReports}
                            onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-cream peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-warm-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-burnt-sienna peer-checked:to-warm-orange"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-cream/40 rounded-xl border border-soft-amber/10">
                        <div>
                          <h3 className="text-charcoal font-semibold">Email Notifications</h3>
                          <p className="text-sm text-warm-gray/70">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-cream peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-warm-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-burnt-sienna peer-checked:to-warm-orange"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-cream/40 rounded-xl border border-soft-amber/10">
                        <div>
                          <h3 className="text-charcoal font-semibold">Push Notifications</h3>
                          <p className="text-sm text-warm-gray/70">Browser push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.pushNotifications}
                            onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-cream peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-warm-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-burnt-sienna peer-checked:to-warm-orange"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleNotificationsSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:shadow-[0_8px_32px_rgba(255,107,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.35)]"
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
                      <h2 className="text-2xl font-bold text-charcoal">My Homes</h2>
                      <p className="text-warm-gray mt-1">Manage your registered properties</p>
                    </div>
                    <button
                      onClick={() => navigate('/onboarding')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:shadow-[0_6px_24px_rgba(255,107,53,0.45)] text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.3)]"
                    >
                      <Plus className="w-4 h-4" />
                      Add Home
                    </button>
                  </div>

                  <div className="space-y-4">
                    {homes.map((home) => (
                      <div
                        key={home.id}
                        className="p-6 bg-cream/40 rounded-xl border border-soft-amber/10 hover:border-[#ff6a00]/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-charcoal mb-2">{home.name}</h3>
                            <p className="text-warm-gray mb-3">{home.location}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-warm-gray/70">
                                {home.systems} systems tracked
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/onboarding?homeId=${home.id}`)}
                              className="p-2 text-warm-gray hover:text-warm-orange hover:bg-cream rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHome(home.id)}
                              className="p-2 text-warm-coral hover:text-charcoal hover:bg-warm-coral/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {homes.length === 0 && (
                      <div className="text-center py-12">
                        <HomeIcon className="w-16 h-16 text-soft-amber/30 mx-auto mb-4" />
                        <p className="text-warm-gray mb-4">No homes registered yet</p>
                        <button
                          onClick={() => navigate('/onboarding')}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
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
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Security Settings</h2>
                  <div className="space-y-8">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-lg font-semibold text-charcoal mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-cream/60 border-b-2 border-soft-amber/30 text-charcoal placeholder-warm-gray/50 rounded-t-xl focus:outline-none focus:border-warm-orange/40 focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-cream/60 border-b-2 border-soft-amber/30 text-charcoal placeholder-warm-gray/50 rounded-t-xl focus:outline-none focus:border-warm-orange/40 focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-cream/60 border-b-2 border-soft-amber/30 text-charcoal placeholder-warm-gray/50 rounded-t-xl focus:outline-none focus:border-warm-orange/40 focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300"
                          />
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:shadow-[0_8px_32px_rgba(255,107,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.35)]"
                        >
                          <Shield className="w-4 h-4" />
                          {isSaving ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-8 border-t border-warm-coral/20">
                      <h3 className="text-lg font-semibold text-warm-coral mb-4">Danger Zone</h3>
                      <div className="p-6 bg-warm-coral/10 border-2 border-warm-coral/30 rounded-xl">
                        <h4 className="text-charcoal font-semibold mb-2">Delete Account</h4>
                        <p className="text-sm text-warm-gray/70 mb-4">
                          Once you delete your account, there is no going back. All your data will be permanently removed.
                        </p>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                              // TODO: Connect to backend API
                              alert('Account deletion would be processed here');
                            }
                          }}
                          className="px-6 py-3 bg-warm-coral hover:bg-warm-coral/90 text-white font-bold rounded-xl transition-all duration-300"
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
