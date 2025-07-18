import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [showPromoBanner, setShowPromoBanner] = useState(true)

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <>
      {/* Promo Banner */}
      {showPromoBanner && (
        <div className="bg-primary text-text-light py-3 px-4 text-center relative">
          <p className="font-secondary text-sm md:text-base">
            Tư vấn sức khỏe giới tính: An toàn, Bảo mật, và Thấu hiểu.
          </p>
          <button
            onClick={() => setShowPromoBanner(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-light hover:text-gray-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-border-subtle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left Navigation */}
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-2xl font-primary font-bold text-primary hover:text-primary-600 transition-colors"
              >
                GHSMS
              </button>
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => handleNavigation('/services')}
                  className="text-text-dark hover:text-primary font-secondary transition-colors"
                >
                  Dịch vụ
                </button>
                
                {/* Simplified Blog Link */}
                <button 
                  onClick={() => handleNavigation('/blog')}
                  className="text-text-dark hover:text-primary font-secondary transition-colors"
                >
                  Blog
                </button>
                
                <button 
                  onClick={() => navigate('/questions')}
                  className="text-text-dark hover:text-primary font-secondary"
                >
                  Câu hỏi KH
                </button>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="text-text-dark hover:text-primary font-secondary transition-colors"
                >
                  Giới thiệu
                </button>
              </nav>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                // Authenticated user menu
                <div className="flex items-center space-x-4">
                  <span className="font-secondary text-text-dark">
                    Xin chào, {user.firstName}
                  </span>
                  <button 
                    onClick={() => {
                      // Navigate to appropriate dashboard based on user role
                      const isAdmin = user.roles?.some(role => role === 'Admin')
                      const isManager = user.roles?.some(role => role === 'Manager')
                      const isStaff = user.roles?.some(role => role === 'Staff')
                      const isConsultant = user.roles?.some(role => role === 'Consultant')
                      
                      if (isAdmin) {
                        handleNavigation('/admin/dashboard')
                      } else if (isManager) {
                        handleNavigation('/manager/dashboard')
                      } else if (isStaff) {
                        handleNavigation('/staff/dashboard')
                      } else if (isConsultant) {
                        handleNavigation('/consultant/dashboard')
                      } else {
                        handleNavigation('/dashboard')
                      }
                    }}
                    className="px-4 py-2 text-primary hover:bg-primary-light rounded-lg font-secondary transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      logout()
                      handleNavigation('/')
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-primary font-secondary transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                // Guest user buttons
                <>
                  <button 
                    onClick={() => handleNavigation('/register')}
                    className="px-6 py-2 text-primary border border-primary rounded-full font-secondary font-bold hover:bg-primary-light transition-colors"
                  >
                    Đăng ký
                  </button>
                  <button 
                    onClick={() => handleNavigation('/login')}
                    className="px-6 py-2 bg-primary text-text-light rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header