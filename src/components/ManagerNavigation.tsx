import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const ManagerNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const navItems = [
    { path: '/manager/dashboard', label: 'Tổng quan', icon: HomeIcon },
    { path: '/manager/reports', label: 'Báo cáo', icon: ChartBarIcon },
    { path: '/manager/employees', label: 'Quản lý Nhân viên', icon: UserGroupIcon },
    { path: '/manager/my-profile', label: 'Hồ Sơ Của Tôi', icon: UserCircleIcon }
  ]

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-border-subtle">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Items */}
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-secondary font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-light text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-light'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-secondary font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  )
}

export default ManagerNavigation