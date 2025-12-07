import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemAPI, favoriteAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const response = await itemAPI.getById(id);
      setItem(response.data);
      
      if (user) {
        const favResponse = await favoriteAPI.check(id);
        setIsFavorite(favResponse.data);
      }
    } catch (error) {
      console.error('Failed to load item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      console.log('Toggling favorite for item:', id, 'Current state:', isFavorite);
      if (isFavorite) {
        await favoriteAPI.remove(id);
        console.log('Removed from favorites');
      } else {
        await favoriteAPI.add(id);
        console.log('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      console.error('Error details:', error.response);
      alert('Failed to update favorites: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemAPI.delete(id);
        navigate('/my-items');
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center">Item not found</div>;
  }

  const isOwner = user && item.user.id === user.userId;

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
              {user && (
                <Link to="/my-items" className="text-gray-700 hover:text-indigo-600">
                  My Items
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                {item.imageUrls ? (
                  <img src={item.imageUrls} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-9xl">📦</span>
                )}
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-indigo-600">${item.price}</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-gray-600 font-medium">Condition:</span>
                  <span className="ml-2 text-gray-900">{item.condition || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Location:</span>
                  <span className="ml-2 text-gray-900">{item.location || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Category:</span>
                  <span className="ml-2 text-gray-900">{item.category?.name || 'Other'}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Views:</span>
                  <span className="ml-2 text-gray-900">{item.viewCount || 0}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Seller</h2>
                <p className="text-gray-600">{item.user.username}</p>
              </div>

              <div className="flex gap-4">
                {isOwner ? (
                  <>
                    <Link
                      to={`/edit-item/${item.id}`}
                      className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                ) : user ? (
                  <>
                    <button
                      onClick={handleToggleFavorite}
                      className={`px-6 py-3 rounded-md ${isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:opacity-80`}
                    >
                      {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
                    </button>
                    <button 
                      onClick={() => setShowContact(true)}
                      className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700"
                    >
                      📧 Contact Seller
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 text-center">
                    Login to Contact
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowContact(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Seller</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Seller Name:</p>
                <p className="text-lg font-semibold text-gray-900">{item.user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="text-lg text-indigo-600">{item.user.email}</p>
              </div>
              {item.user.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone:</p>
                  <p className="text-lg text-gray-900">{item.user.phone}</p>
                </div>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                <p className="text-sm text-blue-800">
                  💡 Tip: Contact the seller via email, phone, or send a message directly through the platform.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                to="/messages"
                state={{ newConversationWith: item.user.id, itemId: item.id }}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-center"
              >
                💬 Send Message
              </Link>
              <button
                onClick={() => setShowContact(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
