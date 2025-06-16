import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCog, 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaSave,
  FaEdit,
  FaShieldAlt,
  FaDatabase,
  FaBell,
  FaGlobe
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminSettings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+255 788 008 750',
    location: 'Tunguu Zanzibar',
    bio: 'System Administrator for Island Scholars platform'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Island Scholars',
    siteDescription: 'Connecting students with internship opportunities across Tanzania',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSystemSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'System settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update system settings' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'system', label: 'System', icon: FaCog },
    { id: 'notifications', label: 'Notifications', icon: FaBell }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
          <p className="text-gray-600">Manage your profile and system settings</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <FaUser className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex-shrink-0">
                      {currentUser?.profileImage ? (
                        <img
                          className="h-20 w-20 rounded-full object-cover"
                          src={currentUser.profileImage}
                          alt={currentUser.name}
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                          <FaUser className="h-10 w-10 text-primary-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-outline flex items-center"
                      >
                        <FaEdit className="mr-2" />
                        Change Photo
                      </button>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Full Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="input pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Email Address</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="input pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Phone Number</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Location</label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleProfileChange}
                          className="input pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows="4"
                      className="input"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center"
                    >
                      <FaSave className="mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <FaShieldAlt className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="label">Current Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="input pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">New Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="input pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label className="label">Confirm New Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center"
                    >
                      <FaSave className="mr-2" />
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <FaCog className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
                </div>

                <form onSubmit={handleSystemSettingsSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Site Name</label>
                      <input
                        type="text"
                        name="siteName"
                        value={systemSettings.siteName}
                        onChange={handleSystemSettingsChange}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Site Description</label>
                      <input
                        type="text"
                        name="siteDescription"
                        value={systemSettings.siteDescription}
                        onChange={handleSystemSettingsChange}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Platform Controls</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Maintenance Mode</h4>
                        <p className="text-sm text-gray-600">Temporarily disable the platform for maintenance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="maintenanceMode"
                          checked={systemSettings.maintenanceMode}
                          onChange={handleSystemSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">User Registration</h4>
                        <p className="text-sm text-gray-600">Allow new users to register on the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="registrationEnabled"
                          checked={systemSettings.registrationEnabled}
                          onChange={handleSystemSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center"
                    >
                      <FaSave className="mr-2" />
                      {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <FaBell className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Notification Settings</h2>
                </div>

                <form onSubmit={handleSystemSettingsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Admin Notifications</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive email notifications for important events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={systemSettings.emailNotifications}
                          onChange={handleSystemSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive SMS notifications for critical alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={systemSettings.smsNotifications}
                          onChange={handleSystemSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center"
                    >
                      <FaSave className="mr-2" />
                      {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;