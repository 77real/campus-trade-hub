import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemAPI, categoryAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        selectedCategory 
          ? itemAPI.getByCategory(selectedCategory, { page: 0, size: 20 })
          : itemAPI.getAll({ page: 0, size: 20 }),
        categoryAPI.getAll()
      ]);
      setItems(itemsRes.data.content || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      loadData();
      return;
    }
    try {
      const response = await itemAPI.search(searchKeyword, { page: 0, size: 20 });
      setItems(response.data.content || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Campus Trade Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.username}</span>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium">
                      🛡️ Admin
                    </Link>
                  )}
                  <Link to="/messages" className="text-indigo-600 hover:text-indigo-800">
                    💬 Messages
                  </Link>
                  <Link to="/favorites" className="text-indigo-600 hover:text-indigo-800">
                    ❤️ Favorites
                  </Link>
                  <Link to="/my-items" className="text-indigo-600 hover:text-indigo-800">
                    My Items
                  </Link>
                  <Link to="/post-item" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Post Item
                  </Link>
                  <Link to="/account-settings" className="text-gray-600 hover:text-gray-800">
                    ⚙️ Settings
                  </Link>
                  <button onClick={logout} className="text-gray-600 hover:text-gray-800">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search items..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-md ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-md ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No items found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {item.imageUrls ? (
                    <img src={item.imageUrls} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-4xl">📦</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">${item.price}</span>
                    <span className="text-sm text-gray-500">{item.condition}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
