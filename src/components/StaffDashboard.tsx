import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarIcon,
  ClockIcon,
  BeakerIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import StaffNavigation from './StaffNavigation'
import staffService, { type DashboardStats } from '../services/staffService'

const StaffDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Use real API call
      const dashboardData = await staffService.getDashboardSummary()
      setStats(dashboardData)
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.')
      
      // Fallback to mock data if API fails
      setStats({
        todayAppointmentCount: 15,
        waitingForSampleCount: 4,
        pendingResultEntryCount: 8,
        overdueTasks: [
          {
            bookingId: '148',
            customerName: 'Nguyễn Văn A',
            serviceName: 'Gói Nâng Cao',
            daysOverdue: 2,
            status: 'Processing',
            appointmentDate: '2025-01-04T14:30:00Z'
          }
        ],
        recentActivity: [
          {
            id: '1',
            timestamp: '10:32 AM',
            text: 'Bạn đã cập nhật Booking #152 thành \'SampleCollected\'.',
            type: 'update'
          }
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewBooking = (bookingId: string) => {
    // TODO: Navigate to booking management page with filter
    console.log('View booking:', bookingId)
    // For now, navigate to customer lookup where staff can search
    navigate('/staff/customers')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-secondary">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      <StaffNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Tổng quan Công việc Hôm nay
            </h1>
            <p className="font-secondary text-gray-600">
              Xin chào, {user?.firstName || 'Nhân viên'}! Đây là tổng quan công việc của bạn hôm nay.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Today's Appointments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center">
                <div className="bg-primary-light rounded-lg p-3 mr-4">
                  <CalendarIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-primary font-semibold text-text-dark text-lg">
                    Lịch hẹn Hôm nay
                  </h3>
                  <p className="text-3xl font-primary font-bold text-primary mt-1">
                    {stats?.todayAppointmentCount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Samples */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-lg p-3 mr-4">
                  <ClockIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-primary font-semibold text-text-dark text-lg">
                    Chờ Lấy Mẫu
                  </h3>
                  <p className="text-3xl font-primary font-bold text-yellow-600 mt-1">
                    {stats?.waitingForSampleCount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Results */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <BeakerIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-primary font-semibold text-text-dark text-lg">
                    Chờ Nhập Kết Quả
                  </h3>
                  <p className="text-3xl font-primary font-bold text-blue-600 mt-1">
                    {stats?.pendingResultEntryCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pending Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
                Cần Chú Ý
              </h3>
              
              {!stats?.overdueTasks || stats.overdueTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-secondary text-gray-500">
                    Không có công việc cần chú ý
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.overdueTasks.map((task) => (
                    <div key={task.bookingId} className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-primary font-semibold text-text-dark">
                          Booking #{task.bookingId} - {task.customerName}
                        </h4>
                        <p className="font-secondary text-gray-600 text-sm mt-1">
                          Dịch vụ: {task.serviceName} • Quá hạn {task.daysOverdue} ngày
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewBooking(task.bookingId)}
                        className="px-4 py-2 bg-primary text-text-light rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors text-sm"
                      >
                        Xem
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
                Hoạt Động Gần Đây
              </h3>
              
              {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-secondary text-gray-500">
                    Chưa có hoạt động nào
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="bg-primary-light rounded-full p-2 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-secondary text-text-dark text-sm">
                            {activity.text}
                          </p>
                          <span className="font-secondary text-gray-500 text-xs">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
            <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
              Thao tác nhanh
            </h3>
            <div className="grid md:grid-cols-1 gap-4 max-w-md">
              <button 
                onClick={() => navigate('/staff/samples')}
                className="flex items-center justify-center p-4 border-2 border-primary text-primary rounded-xl hover:bg-primary-light transition-colors"
              >
                <BeakerIcon className="h-6 w-6 mr-3" />
                <span className="font-secondary font-semibold">Quản lý Mẫu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard