import React from 'react'
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  HomeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import ManagerNavigation from './ManagerNavigation'

const ManagerQualificationManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light">
      <ManagerNavigation />

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Quản lý Chứng chỉ
            </h1>
            <p className="font-secondary text-gray-600">
              Quản lý chứng chỉ và hồ sơ chuyên môn của nhân viên
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

export default ManagerQualificationManagement