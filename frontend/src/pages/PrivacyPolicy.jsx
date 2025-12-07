import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PrivacyPolicy() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const loadPrivacyPolicy = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/public/privacy-policy');
      setContent(response.data.content || '');
      setUpdatedAt(response.data.updatedAt);
    } catch (error) {
      console.error('Failed to load privacy policy:', error);
      setContent('# Privacy Policy\n\nFailed to load privacy policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 简单的Markdown渲染函数
  const renderMarkdown = (text) => {
    if (!text) return '';
    
    return text
      // 标题
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 列表
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      // 段落
      .replace(/\n\n/g, '</p><p class="mb-4">');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">Campus Trade Hub</Link>
            </div>
            <div className="flex items-center">
              <Link to="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading Privacy Policy...</div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              {updatedAt && (
                <p className="text-sm text-gray-600 mb-8">
                  Last Updated: {new Date(updatedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
              
              <div 
                className="prose max-w-none text-gray-700 space-y-4"
                dangerouslySetInnerHTML={{ __html: '<p class="mb-4">' + renderMarkdown(content) + '</p>' }}
              />

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800">
                  ← Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
