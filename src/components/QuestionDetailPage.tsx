import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Answer {
  id: number;
  content: string;
  createdByName: string | null;
  createdAt: string;
}

interface QuestionDetail {
  id: number;
  title: string;
  content: string;
  createdByName: string | null;
  isAnonymous: boolean;
  createdAt: string;
  answers: Answer[];
}

const QuestionDetailPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);

  useEffect(() => {
    api.get(`/api/Question/${questionId}`)
      .then(res => {
        const q = res.data.data;
        api.get(`/api/Question/${questionId}/answers`).then(ansRes => {
          setQuestion({ ...q, answers: ansRes.data.data });
        });
      })
      .catch(() => setQuestion(null));
  }, [questionId]);

  if (!question) return <div className="container mx-auto px-4 py-8">Không tìm thấy câu hỏi.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="p-6 border rounded shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">{question.title}</h1>
          <span className="text-sm text-gray-500">
            {question.isAnonymous ? 'Anonymous' : question.createdByName}
          </span>
        </div>
        <div className="text-gray-700 mb-2">{question.content}</div>
        <div className="text-xs text-gray-400">{new Date(question.createdAt).toLocaleString()}</div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Câu trả lời</h2>
        {question.answers.length === 0 ? (
          <div className="text-gray-500">Chưa có câu trả lời.</div>
        ) : (
          question.answers.map(ans => (
            <div key={ans.id} className="mb-4 p-4 border rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{ans.createdByName}</span>
                <span className="text-xs text-gray-400">{new Date(ans.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-gray-700">{ans.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
