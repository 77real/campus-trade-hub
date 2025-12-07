import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AccountSettings() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleExportData = async () => {
    setExportLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Exporting data with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('http://localhost:8080/api/users/export-data', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Export response:', response.data);

      // Create JSON file and download
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campus-trade-hub-data-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage('✅ Your data has been downloaded successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to export data';
      setMessage(`❌ Export failed: ${errorMsg}`);
      console.error('Export failed:', error);
      console.error('Error response:', error.response);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8080/api/users/delete-account', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('✅ Your account has been deleted. Redirecting...');
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete account';
      setMessage(`❌ Delete failed: ${errorMsg}`);
      console.error('Delete failed:', error);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">Campus Trade Hub</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <Link to="/my-items" className="text-gray-700 hover:text-indigo-600">My Items</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>

          {message && (
            <div className={`mb-6 p-4 rounded ${
              message.includes('Failed') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {/* Account Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="bg-gray-50 p-4 rounded space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium text-gray-900">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
            </div>
          </section>

          {/* Data Privacy & GDPR */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Privacy (GDPR)</h2>
            
            <div className="space-y-4">
              {/* Export Data */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📥 Export Your Data</h3>
                <p className="text-gray-600 mb-4">
                  Download a copy of all your personal data stored on Campus Trade Hub in JSON format.
                </p>
                <button
                  onClick={handleExportData}
                  disabled={exportLoading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {exportLoading ? 'Preparing Download...' : 'Export My Data'}
                </button>
              </div>

              {/* Delete Account */}
              <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                <h3 className="text-lg font-semibold text-red-900 mb-2">🗑️ Delete Account</h3>
                <p className="text-red-700 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <p className="text-sm text-red-600 mb-4">
                  ⚠️ Warning: This will delete all your items, messages, and favorites.
                </p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete My Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="font-semibold text-red-900">Are you absolutely sure?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleteLoading ? 'Deleting...' : 'Yes, Delete Forever'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Privacy Policy Link */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy & Legal</h2>
            <div className="space-y-2">
              <Link 
                to="/privacy-policy" 
                className="text-indigo-600 hover:text-indigo-800 block"
              >
                📄 Privacy Policy
              </Link>
              <p className="text-sm text-gray-600">
                Learn about how we collect, use, and protect your data.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
