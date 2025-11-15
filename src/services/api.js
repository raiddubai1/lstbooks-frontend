import axios from 'axios';

// API Base URL - uses environment variable or production URL as fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lstbooks-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Subjects
export const getSubjects = () => api.get('/subjects');
export const getSubject = (id) => api.get(`/subjects/${id}`);
export const createSubject = (data) => api.post('/subjects', data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);

// Quizzes
export const getQuizzes = (params) => api.get('/quizzes', { params });
export const getQuiz = (id, params) => api.get(`/quizzes/${id}`, { params });
export const createQuiz = (data) => api.post('/quizzes', data);
export const updateQuiz = (id, data) => api.put(`/quizzes/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/quizzes/${id}`);
export const checkAnswer = (id, data) => api.post(`/quizzes/${id}/check-answer`, data);

// Advanced Quiz Endpoints
export const startQuizAttempt = (id, data) => api.post(`/quizzes/${id}/start`, data);
export const submitQuizAttempt = (id, data) => api.post(`/quizzes/${id}/submit`, data);
export const getQuizAttempt = (quizId, attemptId) => api.get(`/quizzes/${quizId}/attempts/${attemptId}`);
export const getQuizResults = (id, params) => api.get(`/quizzes/${id}/results`, { params });
export const getQuizStats = (id) => api.get(`/quizzes/${id}/stats`);
export const importQuizzes = (data) => api.post('/quizzes/import', data);

// Alias for simple quiz submission (uses advanced attempt system)
export const submitQuiz = (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, answers);

// Dashboard Analytics
export const getDashboardQuizOverview = () => api.get('/dashboard/quiz/overview');
export const getDashboardQuizTrend = (id, params) => api.get(`/dashboard/quiz/${id}/trend`, { params });
export const getUserQuizStats = (userId) => api.get(`/dashboard/user/${userId}/quiz-stats`);

// Flashcards
export const getFlashcards = (params) => api.get('/flashcards', { params });
export const getFlashcard = (id) => api.get(`/flashcards/${id}`);
export const createFlashcard = (data) => api.post('/flashcards', data);
export const updateFlashcard = (id, data) => api.put(`/flashcards/${id}`, data);
export const deleteFlashcard = (id) => api.delete(`/flashcards/${id}`);

// OSCE Stations
export const getOSCEStations = (params) => api.get('/osce', { params });
export const getOSCEStation = (id) => api.get(`/osce/${id}`);
export const createOSCEStation = (data) => api.post('/osce', data);
export const updateOSCEStation = (id, data) => api.put(`/osce/${id}`, data);
export const deleteOSCEStation = (id) => api.delete(`/osce/${id}`);

// Labs
export const getLabs = (params) => api.get('/labs', { params });
export const getLab = (id) => api.get(`/labs/${id}`);
export const createLab = (data) => api.post('/labs', data);
export const updateLab = (id, data) => api.put(`/labs/${id}`, data);
export const deleteLab = (id) => api.delete(`/labs/${id}`);

// Skills
export const getSkills = (params) => api.get('/skills', { params });
export const getSkill = (id) => api.get(`/skills/${id}`);
export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

// Users
export const register = (data) => api.post('/users/register', data);
export const login = (data) => api.post('/users/login', data);
export const addBookmark = (userId, data) => api.post(`/users/${userId}/bookmarks`, data);
export const getBookmarks = (userId) => api.get(`/users/${userId}/bookmarks`);
export const saveNote = (userId, data) => api.post(`/users/${userId}/notes`, data);

// Progress
export const getUserProgress = (userId) => api.get(`/progress/user/${userId}`);
export const getSubjectProgress = (userId, subjectId) => api.get(`/progress/user/${userId}/subject/${subjectId}`);
export const getDashboardStats = (userId) => api.get(`/progress/user/${userId}/stats`);

// Search
export const search = (query) => api.get('/search', { params: { q: query } });

export default api;

