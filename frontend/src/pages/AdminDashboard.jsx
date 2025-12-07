import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats'); // stats, users, items, privacy
  const { user, logout } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'items') {
      loadItems();
    } else if (activeTab === 'privacy') {
      loadPrivacyPolicy();
    }
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading stats with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('http://localhost:8080/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Stats response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 403 || error.response?.data?.message?.includes('Admin')) {
        alert('Access Denied: Admin role required.\nCurrent role: ' + (user?.role || 'Unknown'));
      } else {
        alert('Failed to load statistics: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.content || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/admin/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data.content || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/admin/users/${userId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/admin/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const loadPrivacyPolicy = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/admin/settings/privacy-policy', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrivacyPolicy(response.data.content || '');
    } catch (error) {
      console.error('Failed to load privacy policy:', error);
    }
  };

  const handleSavePrivacyPolicy = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8080/api/admin/settings/privacy-policy', 
        { content: privacyPolicy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Privacy Policy saved successfully!');
    } catch (error) {
      console.error('Failed to save privacy policy:', error);
      alert('❌ Save failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold">🏠 Campus Trade Hub</Link>
              <span className="text-indigo-200">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>👤 {user?.username}</span>
              <Link to="/" className="hover:text-indigo-200">Back to Home</Link>
              <button onClick={logout} className="hover:text-indigo-200">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'stats'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 System Stats
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👥 User Management
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'items'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📦 Item Management
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'privacy'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📄 Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Statistics</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-gray-500 text-sm">Total Users</div>
                  <div className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</div>
                  <div className="text-sm text-green-600 mt-2">Today: +{stats.todayNewUsers}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-gray-500 text-sm">Total Items</div>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalItems}</div>
                  <div className="text-sm text-green-600 mt-2">Today: +{stats.todayNewItems}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-gray-500 text-sm">Available Items</div>
                  <div className="text-3xl font-bold text-green-600">{stats.availableItems}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-gray-500 text-sm">Sold Items</div>
                  <div className="text-3xl font-bold text-gray-600">{stats.soldItems}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">Failed to load statistics</div>
                <div className="text-gray-600 text-sm mb-4">Please check:</div>
                <ul className="text-left max-w-md mx-auto text-sm text-gray-600 space-y-2">
                  <li>• Logged in with admin account</li>
                  <li>• Backend service is running</li>
                  <li>• Database role field is updated</li>
                  <li>• Check browser console for errors</li>
                </ul>
                <button 
                  onClick={loadStats}
                  className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                >
                  Reload
                </button>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reputation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{u.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{u.reputationScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          u.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.isVerified ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {u.isVerified ? 'Disable' : 'Enable'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Item Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {item.imageUrls ? (
                      <img src={item.imageUrls} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-4xl">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 truncate">{item.title}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-indigo-600">${item.price}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <div>Seller: {item.user.username}</div>
                      <div>Posted: {new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/items/${item.id}`}
                        className="flex-1 bg-indigo-100 text-indigo-600 py-2 px-3 rounded hover:bg-indigo-200 text-center text-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex-1 bg-red-100 text-red-600 py-2 px-3 rounded hover:bg-red-200 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Policy Tab */}
        {activeTab === 'privacy' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Privacy Policy Editor</h2>
              <button
                onClick={handleSavePrivacyPolicy}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                💾 Save Changes
              </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy Policy Content (Markdown Supported)
                </label>
                <textarea
                  value={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.value)}
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="Enter Privacy Policy content here..."
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📝 Editing Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Write in Markdown format (supports headers, lists, bold, etc.)</li>
                  <li>• Click "Save Changes" button to save</li>
                  <li>• Changes will be visible on /privacy-policy page</li>
                  <li>• Recommend regular review and updates</li>
                </ul>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleSavePrivacyPolicy}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  ✅ Save & Publish
                </button>
                <button
                  onClick={loadPrivacyPolicy}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
                >
                  🔄 Reload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
