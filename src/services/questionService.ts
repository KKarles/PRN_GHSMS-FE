import api from './api';

export const getQuestions = () => api.get('/api/Question');
export const getQuestionById = (id: number | string) => api.get(`/api/Question/${id}`);
export const getAnswersByQuestionId = (id: number | string) => api.get(`/api/Question/${id}/answers`);

export const postQuestion = (data: { Title: string; QuestionText: string; IsAnonymous: boolean }) =>
  api.post('/api/Question', data);


export const postAnswer = (data: { QuestionId: number; AnswerText: string }) =>
  api.post('/api/Question/answer', data);

export const deleteQuestion = (questionId: number | string) =>
  api.delete(`/api/Question/${questionId}`);

export const deleteAnswer = (answerId: number | string) =>
  api.delete(`/api/Question/answer/${answerId}`);
