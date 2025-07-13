import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Question {
  questionId: number;
  title: string;
  questionText: string;
  customerName: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/Question')
      .then(res => setQuestions(res.data.data))
      .catch(() => setQuestions([]));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách câu hỏi</h1>
        {user?.roles?.includes('Customer') && (
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600"
            onClick={() => navigate('/questions/ask')}
          >
            Đặt câu hỏi
          </button>
        )}
      </div>
      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map(q => (
            <div
              key={q.questionId}
              className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/questions/${q.questionId}`)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{q.title}</h2>
                <span className="text-sm text-gray-500">
                  {q.isAnonymous ? 'Anonymous' : q.customerName}
                </span>
              </div>
              <p className="text-gray-700 mt-2 line-clamp-2">{q.questionText}</p>
              <div className="text-xs text-gray-400 mt-1">{new Date(q.createdAt).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Chưa có câu hỏi nào
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
