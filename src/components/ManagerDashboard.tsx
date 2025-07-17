import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import ManagerNavigation from './ManagerNavigation'
import EmployeeManagement from './EmployeeManagement'

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false)

  return (
    <div className="min-h-screen bg-background-light">
      <ManagerNavigation />
      
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Chào mừng, {user?.firstName} {user?.lastName}
            </h1>
            <p className="font-secondary text-gray-600">
              Dashboard Quản lý - Báo cáo và quản lý chứng chỉ
            </p>
          </div>

          {/* Quick Actions - Reports and Qualifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
            <h2 className="text-xl font-primary font-semibold text-text-dark mb-6">
              Thao tác nhanh
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/manager/reports')}
                className="flex items-center justify-center p-6 border-2 border-primary text-primary rounded-xl hover:bg-primary-light transition-colors"
              >
                <ChartBarIcon className="h-8 w-8 mr-4" />
                <span className="font-secondary font-semibold text-lg">Báo cáo</span>
              </button>
              <button 
                onClick={() => setShowEmployeeManagement(true)}
                className="flex items-center justify-center p-6 border-2 border-primary text-primary rounded-xl hover:bg-primary-light transition-colors"
              >
                <UserGroupIcon className="h-8 w-8 mr-4" />
                <span className="font-secondary font-semibold text-lg">Quản lý Nhân viên</span>
              </button>
              <button 
                onClick={() => navigate('/blog-admin')}
                className="flex items-center justify-center p-6 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors"
              >
                <PencilSquareIcon className="h-8 w-8 mr-4" />
                <span className="font-secondary font-semibold text-lg">Quản lý Blog</span>
              </button>
            </div>
          </div>

          {/* Blog Management Section */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
            <h2 className="text-xl font-primary font-semibold text-text-dark mb-6">
              Quản lý Nội dung Blog
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Quản lý Tất cả Bài viết</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Xem, chỉnh sửa và quản lý tất cả bài viết blog trên hệ thống
                </p>
                <button 
                  onClick={() => navigate('/blog-admin')}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Quản lý Blog Chung
                </button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Blog Cá nhân</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tạo và quản lý bài viết blog cá nhân của bạn
                </p>
                <button 
                  onClick={() => navigate('/my-blog')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Blog Của Tôi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Management Modal */}
      {showEmployeeManagement && (
        <EmployeeManagement onClose={() => setShowEmployeeManagement(false)} />
      )}
    </div>
  )
}

export default ManagerDashboard