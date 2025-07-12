import React from 'react'
import {
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const AdminQualificationManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm border-b border-border-subtle">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Navigation Items */}
            <div className="flex space-x-8">
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="flex items-center px-3 py-2 rounded-md text-sm font-secondary font-medium text-gray-600 hover:text-primary hover:bg-primary-light"
              >
                Tổng quan
              </button>
              <button
                onClick={() => window.location.href = '/admin/accounts'}
                className="flex items-center px-3 py-2 rounded-md text-sm font-secondary font-medium text-gray-600 hover:text-primary hover:bg-primary-light"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Quản lý Tài khoản
              </button>
              <button
                onClick={() => window.location.href = '/admin/qualifications'}
                className="flex items-center px-3 py-2 rounded-md text-sm font-secondary font-medium bg-primary-light text-primary border-b-2 border-primary"
              >
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Quản lý Chứng chỉ
              </button>
              <button
                onClick={() => window.location.href = '/admin/my-profile'}
                className="flex items-center px-3 py-2 rounded-md text-sm font-secondary font-medium text-gray-600 hover:text-primary hover:bg-primary-light"
              >
                Hồ Sơ Của Tôi
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                // Add logout logic here
                window.location.href = '/login'
              }}
              className="flex items-center px-3 py-2 text-sm font-secondary font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Quản lý Chứng chỉ
            </h1>
            <p className="font-secondary text-gray-600">
              Quản lý chứng chỉ và hồ sơ chuyên môn của toàn bộ nhân viên
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-subtle text-center">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-primary font-semibold text-gray-600 mb-2">
              Tính năng đang phát triển
            </h2>
            <p className="font-secondary text-gray-500">
              Trang quản lý chứng chỉ sẽ được triển khai trong phiên bản tiếp theo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminQualificationManagement