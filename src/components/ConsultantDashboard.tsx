import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  CheckCircleIcon,
  XCircleIcon,
  VideoCameraIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { 
  getConsultantAppointments, 
  updateAppointmentStatus, 
  setMeetingUrl,
  getAppointmentStats,
  type Appointment 
} from '../services/appointmentService'

const ConsultantDashboard: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')

  // Check if we came from profile page with a specific view
  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView)
    }
  }, [location.state])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeView === 'appointments' || activeView === 'dashboard') {
      fetchAppointments()
    }
    if (activeView === 'dashboard') {
      fetchStats()
    }
  }, [activeView])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      
      // Get current date range (this month)
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
      
      // TODO: Get consultant ID from auth context instead of hardcoding
      const consultantId = user?.userId || 1
      
      const appointmentsData = await getConsultantAppointments(consultantId, startDate, endDate)
      setAppointments(appointmentsData)
    } catch (err) {
      setError('Không thể tải danh sách cuộc hẹn')
      console.error('Failed to fetch appointments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const statsData = await getAppointmentStats()
      setStats(statsData)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleUpdateStatus = async (appointmentId: number, status: string) => {
    try {
      await updateAppointmentStatus(appointmentId, status)
      await fetchAppointments() // Refresh the list
    } catch (err) {
      setError('Không thể cập nhật trạng thái cuộc hẹn')
      console.error('Failed to update appointment status:', err)
    }
  }

  const handleSetMeetingUrl = async (appointmentId: number, meetingUrl: string) => {
    try {
      await setMeetingUrl(appointmentId, meetingUrl)
      await fetchAppointments() // Refresh the list
    } catch (err) {
      setError('Không thể cập nhật link meeting')
      console.error('Failed to set meeting URL:', err)
    }
  }

  const menuItems = [
    { id: 'dashboard', text: 'Tổng quan', icon: ChartBarIcon },
    { id: 'appointments', text: 'Cuộc hẹn', icon: CalendarIcon },
    { id: 'settings', text: 'Cài đặt', icon: Cog6ToothIcon },
  ]

  const handleProfile = () => {
    navigate('/consultant/my-profile')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderDashboardView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-primary font-semibold text-text-dark mb-6">
          Chào mừng, Dr. {user?.firstName} {user?.lastName}
        </h2>
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Tổng cuộc hẹn</p>
                  <p className="text-3xl font-bold">{stats.totalAppointments}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Hoàn thành</p>
                  <p className="text-3xl font-bold">{stats.completedAppointments}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Chờ xác nhận</p>
                  <p className="text-3xl font-bold">{stats.pendingAppointments}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-yellow-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Bệnh nhân</p>
                  <p className="text-3xl font-bold">{Object.keys(stats.appointmentsByConsultant).length}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-purple-200" />
              </div>
            </div>
          </div>
        )}

        {/* Recent Appointments */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-primary font-semibold text-text-dark mb-4">
            Cuộc hẹn gần đây
          </h3>
          {appointments.slice(0, 5).map((appointment) => (
            <div key={appointment.appointmentId} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div>
                <p className="font-medium text-text-dark">
                  {new Date(appointment.startTime).toLocaleDateString('vi-VN')} - {new Date(appointment.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-600">Bệnh nhân: Customer #{appointment.customerId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.appointmentStatus)}`}>
                {appointment.appointmentStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAppointmentsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-primary font-semibold text-text-dark">
            Quản lý cuộc hẹn
          </h2>
          <button
            onClick={fetchAppointments}
            className="bg-primary text-white px-4 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
          >
            Làm mới
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có cuộc hẹn nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.appointmentId} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-text-dark">
                      Cuộc hẹn #{appointment.appointmentId}
                    </h3>
                    <p className="text-gray-600">
                      Bệnh nhân: Customer #{appointment.customerId}
                    </p>
                    <p className="text-gray-600">
                      Thời gian: {new Date(appointment.startTime).toLocaleString('vi-VN')}
                    </p>
                    {appointment.notes && (
                      <p className="text-gray-600 mt-2">
                        Ghi chú: {appointment.notes}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.appointmentStatus)}`}>
                    {appointment.appointmentStatus}
                  </span>
                </div>

                {appointment.meetingUrl && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">Link meeting:</p>
                    <a 
                      href={appointment.meetingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {appointment.meetingUrl}
                    </a>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {appointment.appointmentStatus === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(appointment.appointmentId, 'Confirmed')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appointment.appointmentId, 'Cancelled')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Hủy
                      </button>
                    </>
                  )}
                  
                  {appointment.appointmentStatus === 'Confirmed' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(appointment.appointmentId, 'Completed')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Hoàn thành
                      </button>
                      <button
                        onClick={() => {
                          const url = prompt('Nhập link meeting:', appointment.meetingUrl || '')
                          if (url) handleSetMeetingUrl(appointment.appointmentId, url)
                        }}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
                      >
                        <VideoCameraIcon className="h-4 w-4 inline mr-1" />
                        Cập nhật link
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboardView()
      case 'appointments':
        return renderAppointmentsView()
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-primary font-semibold text-text-dark mb-4">
              Cài đặt
            </h2>
            <p className="text-gray-600">Tính năng cài đặt sẽ được triển khai sau.</p>
          </div>
        )
      default:
        return renderDashboardView()
    }
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Main Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex items-center justify-between px-6">
              {/* Left side - Main menu items */}
              <div className="flex space-x-8">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`flex items-center px-3 py-4 text-sm font-secondary font-medium transition-colors ${
                        activeView === item.id
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.text}
                    </button>
                  )
                })}
              </div>
              
              {/* Right side - Profile and Logout */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleProfile}
                  className="flex items-center px-3 py-2 text-sm font-secondary font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  Hồ sơ của tôi
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-secondary font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                  Đăng xuất
                </button>
              </div>
            </nav>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  )
}

export default ConsultantDashboard