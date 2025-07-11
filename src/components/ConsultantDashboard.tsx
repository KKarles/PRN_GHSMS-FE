import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import ConsultantNavigation from './ConsultantNavigation'

const ConsultantDashboard: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background-light">
      <ConsultantNavigation />
      
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Chào mừng, {user?.firstName} {user?.lastName}
            </h1>
            <p className="font-secondary text-gray-600">
              Dashboard Tư vấn viên - Hệ thống tư vấn sức khỏe
            </p>
          </div>

          {/* Simple Overview Content - No Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
            <h2 className="text-xl font-primary font-semibold text-text-dark mb-6">
              Tổng quan
            </h2>
            
            {/* Empty content area with same styling as other dashboards */}
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-primary font-semibold text-gray-600 mb-2">
                Dashboard Tư vấn viên
              </h3>
              <p className="font-secondary text-gray-500">
                Khu vực làm việc dành cho tư vấn viên
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultantDashboard