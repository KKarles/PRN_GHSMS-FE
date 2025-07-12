import axios from 'axios'

// API Base URL - adjust based on your backend setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5233'
// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ghsms_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('ghsms_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api