import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const loadItems = async () => {
    try {
      const response = await itemAPI.getUserItems(user.userId, { page: 0, size: 50 });
      setItems(response.data.content || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
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
              <Link to="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </Link>
              <span className="text-indigo-600 font-medium">My Items</span>
              <Link to="/post-item" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Post Item
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Items</h2>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't posted any items yet</p>
            <Link to="/post-item" className="text-indigo-600 hover:text-indigo-800">
              Post your first item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link to={`/items/${item.id}`}>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {item.imageUrls ? (
                      <img src={item.imageUrls} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-4xl">📦</span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/items/${item.id}`}>
                    <h3 className="font-semibold text-lg mb-2 truncate hover:text-indigo-600">{item.title}</h3>
                  </Link>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-indigo-600">${item.price}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                      item.status === 'SOLD' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/edit-item/${item.id}`}
                      className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded text-center text-sm hover:bg-indigo-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
