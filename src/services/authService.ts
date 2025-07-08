import api from './api'

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  dateOfBirth: string
  sex: 'Male' | 'Female' | 'Other'
}

export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/register', userData)
    
    // Store token if registration successful
    if (response.data.token) {
      localStorage.setItem('ghsms_token', response.data.token)
    }
    
    return response.data
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  expiresAt: string
  user: {
    userId: number
    firstName: string
    lastName: string
    email: string
    roles: string[]
  }
}

export interface UserProfile {
  userId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  sex: string
  wantsCycleNotifications: boolean
  pillReminderTime: string
  roles: string[]
}

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/login', credentials)
    
    if (response.data.token) {
      localStorage.setItem('ghsms_token', response.data.token)
    }
    
    return response.data
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get('/api/auth/profile')
    return response.data
  } catch (error) {
    console.error('Failed to get profile:', error)
    throw error
  }
}

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/refresh')
    
    if (response.data.token) {
      localStorage.setItem('ghsms_token', response.data.token)
    }
    
    return response.data
  } catch (error) {
    console.error('Token refresh failed:', error)
    throw error
  }
}

export const logoutUser = (): void => {
  localStorage.removeItem('ghsms_token')
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('ghsms_token')
}

export const getStoredToken = (): string | null => {
  return localStorage.getItem('ghsms_token')
}