import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getQuestionById,
  getAnswersByQuestionId,
  postAnswer,
  deleteQuestion,
  deleteAnswer
} from '../services/questionService';

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
  const [answerContent, setAnswerContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const qRes = await getQuestionById(questionId!);
      if (!qRes.data.success) throw new Error(qRes.data.message);
      const q = qRes.data.data;
      const ansRes = await getAnswersByQuestionId(questionId!);
      if (!ansRes.data.success) throw new Error(ansRes.data.message);
      setQuestion({ ...q, answers: ansRes.data.data });
    } catch (err: any) {
      setQuestion(null);
      setError(err?.message || 'Không tìm thấy câu hỏi.');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [questionId]);

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await postAnswer({
        QuestionId: Number(questionId),
        AnswerText: answerContent
      });
      if (!res.data.success) throw new Error(res.data.message);
      setSuccessMsg('Đã gửi câu trả lời!');
      setAnswerContent('');
      fetchData();
    } catch (err: any) {
      setError(err?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Bạn có chắc muốn xoá câu hỏi này?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await deleteQuestion(questionId!);
      if (!res.data.success) throw new Error(res.data.message);
      navigate('/questions');
    } catch (err: any) {
      setError(err?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá câu trả lời này?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await deleteAnswer(answerId);
      if (!res.data.success) throw new Error(res.data.message);
      fetchData();
    } catch (err: any) {
      setError(err?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <div className="container mx-auto px-4 py-8">{error || 'Không tìm thấy câu hỏi.'}</div>;

  // Role checks
  const canDeleteQuestion = user && (
    user.roles?.includes('Admin') ||
    user.roles?.includes('Manager') ||
    (user.roles?.includes('Customer') && user.userId === (question as any).createdById)
  );
  const canPostAnswer = user && user.roles?.includes('Consultant');
  const canDeleteAnswer = (ans: Answer) => user && (
    user.roles?.includes('Admin') ||
    user.roles?.includes('Manager') ||
    (user.roles?.includes('Consultant') && user.userId === (ans as any).createdById)
  );

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
        {canDeleteQuestion && (
          <button
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={handleDeleteQuestion}
            disabled={loading}
          >
            Xoá câu hỏi
          </button>
        )}
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
                {canDeleteAnswer(ans) && (
                  <button
                    className="ml-2 bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDeleteAnswer(ans.id)}
                    disabled={loading}
                  >
                    Xoá
                  </button>
                )}
              </div>
              <div className="text-gray-700">{ans.content}</div>
            </div>
          ))
        )}
        {canPostAnswer && (
          <form onSubmit={handlePostAnswer} className="mt-6 space-y-2">
            <textarea
              className="w-full border rounded px-3 py-2"
              value={answerContent}
              onChange={e => setAnswerContent(e.target.value)}
              rows={3}
              required
              placeholder="Nhập câu trả lời..."
            />
            {error && <div className="text-red-500">{error}</div>}
            {successMsg && <div className="text-green-500">{successMsg}</div>}
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi câu trả lời'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
