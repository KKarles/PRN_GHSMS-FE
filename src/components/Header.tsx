import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [showPromoBanner, setShowPromoBanner] = useState(true)
  const [showBlogDropdown, setShowBlogDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if user has staff/manager/admin roles
  const hasStaffAccess = user?.roles?.some(role => 
    ['Staff', 'Manager', 'Admin'].includes(role)
  ) || false

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBlogDropdown(false)
      }
    }

    if (showBlogDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showBlogDropdown])

  const handleNavigation = (path: string) => {
    navigate(path)
    setShowBlogDropdown(false)
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
                
                {/* Blog Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowBlogDropdown(!showBlogDropdown)}
                    className="flex items-center text-text-dark hover:text-primary font-secondary transition-colors"
                  >
                    Blog
                    <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${showBlogDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showBlogDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[220px]">
                      {/* Public Blog - Always visible */}
                      <button 
                        onClick={() => handleNavigation('/blog')}
                        className="block w-full text-left px-4 py-3 text-text-dark hover:bg-gray-50 font-secondary border-b border-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-2">📖</span>
                          <div>
                            <div className="font-medium">Xem Blog</div>
                            <div className="text-xs text-gray-500">Đọc các bài viết công khai</div>
                          </div>
                        </div>
                      </button>
                      
                      {/* Authenticated user options */}
                      {isAuthenticated && (
                        <>
                          {/* My Blog - For authenticated users */}
                          <button 
                            onClick={() => handleNavigation('/my-blog')}
                            className="block w-full text-left px-4 py-3 text-text-dark hover:bg-gray-50 font-secondary border-b border-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <span className="text-lg mr-2">✏️</span>
                              <div>
                                <div className="font-medium">Blog của tôi</div>
                                <div className="text-xs text-gray-500">Quản lý bài viết cá nhân</div>
                              </div>
                            </div>
                          </button>
                          
                          {/* Admin Blog Management - Only for staff/manager/admin */}
                          {hasStaffAccess && (
                            <button 
                              onClick={() => handleNavigation('/blog-admin')}
                              className="block w-full text-left px-4 py-3 text-text-dark hover:bg-gray-50 font-secondary transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="text-lg mr-2">⚙️</span>
                                <div>
                                  <div className="font-medium">Quản lý Blog (Chung)</div>
                                  <div className="text-xs text-gray-500">Quản lý tất cả bài viết</div>
                                </div>
                              </div>
                            </button>
                          )}
                        </>
                      )}
                      
                      {/* Login prompt for non-authenticated users */}
                      {!isAuthenticated && (
                        <div className="px-4 py-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">
                            Đăng nhập để tạo và quản lý blog
                          </p>
                          <button 
                            onClick={() => handleNavigation('/login')}
                            className="text-primary hover:text-primary-600 text-sm font-medium transition-colors"
                          >
                            Đăng nhập →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
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
                      const isStaff = user.roles?.some(role => 
                        ['Staff', 'Manager', 'Admin'].includes(role)
                      )
                      handleNavigation(isStaff ? '/staff/dashboard' : '/dashboard')
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