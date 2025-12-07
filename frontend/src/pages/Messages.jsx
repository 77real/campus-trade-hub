import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { messageAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      loadConversations();
      
      // Check if navigated from item detail with new conversation
      if (location.state?.newConversationWith) {
        setSelectedConversation(location.state.newConversationWith);
        loadConversation(location.state.newConversationWith);
      }
    }
  }, [user, location]);

  const loadConversations = async () => {
    try {
      const response = await messageAPI.getAll();
      const messageList = response.data || [];
      
      // Group messages by conversation partner
      const convMap = new Map();
      messageList.forEach(msg => {
        const partnerId = msg.sender.id === user.userId ? msg.receiver.id : msg.sender.id;
        const partnerName = msg.sender.id === user.userId ? msg.receiver.username : msg.sender.username;
        
        if (!convMap.has(partnerId)) {
          convMap.set(partnerId, {
            partnerId,
            partnerName,
            lastMessage: msg.content,
            lastTime: msg.createdAt,
            unread: !msg.isRead && msg.receiver.id === user.userId
          });
        }
      });
      
      setConversations(Array.from(convMap.values()));
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (partnerId) => {
    try {
      const response = await messageAPI.getConversation(partnerId);
      setMessages(response.data || []);
      setSelectedConversation(partnerId);
      
      // Mark messages as read
      const unreadMessages = response.data.filter(msg => 
        !msg.isRead && msg.receiver.id === user.userId
      );
      for (const msg of unreadMessages) {
        await messageAPI.markAsRead(msg.id);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await messageAPI.send({
        receiverId: selectedConversation,
        content: newMessage,
        itemId: null
      });
      setNewMessage('');
      await loadConversation(selectedConversation);
      await loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
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
              <span className="text-indigo-600 font-medium">Messages</span>
              <Link to="/favorites" className="text-gray-700 hover:text-indigo-600">Favorites</Link>
              <Link to="/my-items" className="text-gray-700 hover:text-indigo-600">My Items</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="mb-2">No messages yet</p>
                  <Link to="/" className="text-indigo-600 hover:text-indigo-800">Browse items</Link>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.partnerId}
                    onClick={() => loadConversation(conv.partnerId)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conv.partnerId ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{conv.partnerName}</h3>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread && (
                        <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          •
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Messages Display */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender.id === user.userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender.id === user.userId
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender.id === user.userId ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
