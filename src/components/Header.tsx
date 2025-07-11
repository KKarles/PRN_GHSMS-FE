import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [showPromoBanner, setShowPromoBanner] = useState(true)
  const [showBlogDropdown, setShowBlogDropdown] = useState(false)

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
                onClick={() => navigate('/')}
                className="text-2xl font-primary font-bold text-primary hover:text-primary-600 transition-colors"
              >
                GHSMS
              </button>
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => navigate('/services')}
                  className="text-text-dark hover:text-primary font-secondary"
                >
                  Dịch vụ
                </button>
                
                {/* Blog Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowBlogDropdown(!showBlogDropdown)}
                    className="flex items-center text-text-dark hover:text-primary font-secondary"
                  >
                    Blog
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </button>
                  
                  {showBlogDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                      <button 
                        onClick={() => {
                          navigate('/blog')
                          setShowBlogDropdown(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-text-dark hover:bg-gray-50 font-secondary"
                      >
                        Xem Blog
                      </button>
                      
                      {isAuthenticated && (
                        <>
                          <button 
                            onClick={() => {
                              navigate('/my-blog')
                              setShowBlogDropdown(false)
                            }}
                            className="block w-full text-left px-4 py-2 text-text-dark hover:bg-gray-50 font-secondary"
                          >
                            Quản lý Blog của tôi
                          </button>
                          
                          {/* Show admin option for testing - you can add role check here later */}
                          <button 
                            onClick={() => {
                              navigate('/blog-admin')
                              setShowBlogDropdown(false)
                            }}
                            className="block w-full text-left px-4 py-2 text-text-dark hover:bg-gray-50 font-secondary"
                          >
                            Quản lý Blog (Chung)
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => navigate('/about')}
                  className="text-text-dark hover:text-primary font-secondary"
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
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 text-primary hover:bg-primary-light rounded-lg font-secondary transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 text-gray-600 hover:text-primary font-secondary transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                // Guest user buttons
                <>
                  <button 
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 text-primary border border-primary rounded-full font-secondary font-bold hover:bg-primary-light transition-colors"
                  >
                    Đăng ký
                  </button>
                  <button 
                    onClick={() => navigate('/login')}
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

      {/* Click outside to close dropdown */}
      {showBlogDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowBlogDropdown(false)}
        />
      )}
    </>
  )
}

export default Header