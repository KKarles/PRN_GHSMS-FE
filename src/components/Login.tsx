import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { loginUser, type LoginRequest } from '../services/authService'
import { useAuth } from '../contexts/AuthContext'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to determine redirect path based on user roles
  const getRedirectPath = (userRoles: string[]) => {
    if (userRoles.includes('Consultant')) {
      return '/consultant-dashboard'
    } else if (userRoles.includes('Admin')) {
      return '/admin-dashboard'
    } else {
      return '/dashboard' // Default for Customer role
    }
  }

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    
    try {
      const response = await loginUser(formData)
      
      if (response.success) {
        // Update auth context
        login(response.token, response.user)
        // Role-based redirect - each role gets their own dashboard
        const userRoles = response.user.roles || []
        let defaultRedirect = '/dashboard' // Default for customers
        
        if (userRoles.includes('Admin')) {
          defaultRedirect = '/admin/dashboard'
        } else if (userRoles.includes('Manager')) {
          defaultRedirect = '/manager/dashboard'
        } else if (userRoles.includes('Consultant')) {
          defaultRedirect = '/consultant/dashboard'
        } else if (userRoles.includes('Staff')) {
          defaultRedirect = '/staff/dashboard'
        }
        
        // Use intended page or role-based default
        const redirectTo = location.state?.from?.pathname || defaultRedirect
        navigate(redirectTo, { replace: true })
          
      } else {
        setError(response.message || 'Đăng nhập thất bại')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        setError('Email hoặc mật khẩu không đúng')
      } else if (error.response?.status === 400) {
        setError('Thông tin đăng nhập không hợp lệ')
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.email && formData.password

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-primary font-bold text-primary mb-2">
            GHSMS
          </div>
          <div className="w-16 h-16 bg-primary-light rounded-full mx-auto flex items-center justify-center">
            <span className="text-primary font-secondary text-sm">[Logo]</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-subtle p-8">
          <h2 className="text-2xl font-primary font-semibold text-text-dark text-center mb-8">
            Đăng nhập vào tài khoản
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-secondary text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block font-secondary text-text-dark mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block font-secondary text-text-dark mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 pr-12 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 rounded-lg font-secondary font-bold transition-colors ${
                isFormValid && !isLoading
                  ? 'bg-primary text-text-light hover:bg-primary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="font-secondary text-gray-600">
              Chưa có tài khoản?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-primary hover:text-primary-600 font-semibold transition-colors"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => navigate('/forgot-password')}
              className="font-secondary text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="font-secondary text-gray-600 hover:text-primary transition-colors"
          >
            ← Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
