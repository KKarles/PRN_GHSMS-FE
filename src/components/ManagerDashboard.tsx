import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon
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
            
            <div className="grid md:grid-cols-2 gap-4">
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