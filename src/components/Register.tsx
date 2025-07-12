import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { registerUser, type RegisterRequest } from '../services/authService'
import { useAuth } from '../contexts/AuthContext'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    sex: 'Female'
  })
  
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    // Validation
    if (formData.password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng')
      setIsLoading(false)
      return
    }

    try {
      const response = await registerUser(formData)
      
      if (response.success) {
        // Update auth context
        login(response.token, response.user)
        
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

        // Redirect to role-based dashboard
        const redirectPath = getRedirectPath(response.user.roles)
        navigate(redirectPath, { replace: true })
      } else {
        setError(response.message || 'Đăng ký thất bại')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Handle different types of errors
      if (error.response?.status === 400) {
        setError('Thông tin đăng ký không hợp lệ')
      } else if (error.response?.status === 409) {
        setError('Email này đã được sử dụng')
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = 
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    confirmPassword &&
    formData.phoneNumber &&
    formData.dateOfBirth &&
    acceptTerms

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-3xl font-primary font-bold text-primary mb-2 hover:text-primary-600 transition-colors"
          >
            GHSMS
          </button>
          <div className="w-16 h-16 bg-primary-light rounded-full mx-auto flex items-center justify-center">
            <span className="text-primary font-secondary text-sm">[Logo]</span>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-subtle p-8">
          <h2 className="text-2xl font-primary font-semibold text-text-dark text-center mb-8">
            Tạo tài khoản mới
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-secondary text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block font-secondary text-text-dark mb-2">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Tên của bạn"
                  className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block font-secondary text-text-dark mb-2">
                  Họ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Họ của bạn"
                  className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-secondary text-text-dark mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block font-secondary text-text-dark mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="0123456789"
                className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Date of Birth and Sex */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateOfBirth" className="block font-secondary text-text-dark mb-2">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="sex" className="block font-secondary text-text-dark mb-2">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={isLoading}
                >
                  <option value="Female">Nữ</option>
                  <option value="Male">Nam</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-secondary text-text-dark mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Ít nhất 6 ký tự"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block font-secondary text-text-dark mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-3 pr-12 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border-subtle rounded"
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms" className="font-secondary text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <button 
                  type="button"
                  className="text-primary hover:text-primary-600 underline"
                >
                  Điều khoản sử dụng
                </button>
                {' '}và{' '}
                <button 
                  type="button"
                  className="text-primary hover:text-primary-600 underline"
                >
                  Chính sách bảo mật
                </button>
              </label>
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
                  Đang tạo tài khoản...
                </div>
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="font-secondary text-gray-600">
              Đã có tài khoản?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary-600 font-semibold transition-colors"
              >
                Đăng nhập ngay
              </button>
            </p>
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

export default Register