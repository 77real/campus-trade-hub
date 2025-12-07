import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const response = await favoriteAPI.getAll();
      setFavorites(response.data || []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (itemId) => {
    try {
      await favoriteAPI.remove(itemId);
      setFavorites(favorites.filter(fav => fav.item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
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
              <span className="text-indigo-600 font-medium">Favorites</span>
              <Link to="/my-items" className="text-gray-700 hover:text-indigo-600">
                My Items
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h2>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't added any favorites yet</p>
            <Link to="/" className="text-indigo-600 hover:text-indigo-800">
              Browse items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link to={`/items/${favorite.item.id}`}>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {favorite.item.imageUrls ? (
                      <img src={favorite.item.imageUrls} alt={favorite.item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-4xl">📦</span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/items/${favorite.item.id}`}>
                    <h3 className="font-semibold text-lg mb-2 truncate hover:text-indigo-600">{favorite.item.title}</h3>
                  </Link>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-indigo-600">${favorite.item.price}</span>
                    <span className="text-sm text-gray-500">{favorite.item.condition}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.item.id)}
                    className="w-full bg-red-100 text-red-600 py-2 px-3 rounded hover:bg-red-200 text-sm"
                  >
                    ❤️ Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
