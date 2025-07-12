import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AskQuestionPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/Question', { title, content, isAnonymous });
      navigate('/questions');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.roles?.includes('Customer')) {
    return <div className="container mx-auto px-4 py-8">Chỉ khách hàng mới được đặt câu hỏi.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Đặt câu hỏi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Tiêu đề</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Nội dung</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={e => setIsAnonymous(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="anonymous">Đăng ẩn danh</label>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600"
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi câu hỏi'}
        </button>
      </form>
    </div>
  );
};

export default AskQuestionPage;
