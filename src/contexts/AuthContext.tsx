import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getUserProfile, isAuthenticated as checkAuth, logoutUser } from '../services/authService'

interface User {
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

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: any) => void
  logout: () => void
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (checkAuth()) {
          // User has token, fetch their profile
          const profile = await getUserProfile()
          setUser(profile)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // Token might be invalid, clear it
        logoutUser()
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (_token: string, userData: any) => {
    // Convert login response user to full User object
    const fullUser: User = {
      userId: userData.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber || '',
      dateOfBirth: userData.dateOfBirth || '',
      sex: userData.sex || '',
      wantsCycleNotifications: userData.wantsCycleNotifications || false,
      pillReminderTime: userData.pillReminderTime || '',
      roles: userData.roles
    }
    setUser(fullUser)
    setIsAuthenticated(true)
  }

  const logout = () => {
    logoutUser() // This clears localStorage
    setUser(null)
    setIsAuthenticated(false)
    // Redirect to home page
    window.location.href = '/'
  }

  const refreshUserProfile = async () => {
    try {
      if (checkAuth()) {
        const profile = await getUserProfile()
        setUser(profile)
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}