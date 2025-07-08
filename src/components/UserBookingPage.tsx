import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline'
import { getMyBookings, cancelBooking, type TestBooking } from '../services/testResultsService'
import { useAuth } from '../contexts/AuthContext'

const UserBookingPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState<TestBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const bookingsData = await getMyBookings()
      setBookings(bookingsData)
    } catch (err) {
      setError('Không thể tải danh sách đặt hẹn')
      console.error('Failed to fetch bookings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      return
    }

    try {
      setCancellingBookingId(bookingId)
      await cancelBooking(bookingId)
      await fetchBookings() // Refresh the list
    } catch (err) {
      setError('Không thể hủy lịch hẹn. Vui lòng thử lại.')
      console.error('Failed to cancel booking:', err)
    } finally {
      setCancellingBookingId(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return <CalendarIcon className="h-5 w-5 text-blue-500" />
      case 'samplecollected':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'resultready':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'Đã đặt hẹn'
      case 'samplecollected':
        return 'Đã lấy mẫu'
      case 'processing':
        return 'Đang xử lý'
      case 'resultready':
        return 'Có kết quả'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'samplecollected':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'processing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'resultready':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const canCancelBooking = (booking: TestBooking) => {
    const status = booking.bookingStatus.toLowerCase()
    const appointmentTime = new Date(booking.appointmentTime)
    const now = new Date()
    const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    return status === 'booked' && hoursUntilAppointment > 24
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const groupBookingsByStatus = (bookings: TestBooking[]) => {
    const groups = {
      upcoming: bookings.filter(b => ['booked'].includes(b.bookingStatus.toLowerCase())),
      inProgress: bookings.filter(b => ['samplecollected', 'processing'].includes(b.bookingStatus.toLowerCase())),
      completed: bookings.filter(b => ['resultready'].includes(b.bookingStatus.toLowerCase())),
      cancelled: bookings.filter(b => ['cancelled'].includes(b.bookingStatus.toLowerCase()))
    }
    return groups
  }

  if (isLoading) {
    return (
      <div className="bg-background-light min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-secondary">Đang tải danh sách đặt hẹn...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const groupedBookings = groupBookingsByStatus(bookings)

  return (
    <div className="bg-background-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-primary hover:text-primary-600 mb-4"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              Quay lại Dashboard
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-primary font-semibold text-text-dark">
                  Lịch hẹn của tôi
                </h1>
                <p className="font-secondary text-gray-600 mt-2">
                  Quản lý và theo dõi tất cả lịch hẹn xét nghiệm của bạn
                </p>
              </div>
              <button
                onClick={() => navigate('/book-service')}
                className="bg-primary text-text-light px-6 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Đặt hẹn mới
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {bookings.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border-subtle">
              <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-primary font-semibold text-text-dark mb-2">
                Chưa có lịch hẹn nào
              </h3>
              <p className="font-secondary text-gray-600 mb-6">
                Bạn chưa đặt lịch hẹn xét nghiệm nào. Hãy bắt đầu hành trình chăm sóc sức khỏe của bạn.
              </p>
              <button
                onClick={() => navigate('/book-service')}
                className="bg-primary text-text-light px-8 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
              >
                Đặt lịch hẹn đầu tiên
              </button>
            </div>
          ) : (
            // Bookings List
            <div className="space-y-8">
              {/* Upcoming Bookings */}
              {groupedBookings.upcoming.length > 0 && (
                <section>
                  <h2 className="text-xl font-primary font-semibold text-text-dark mb-4">
                    Lịch hẹn sắp tới ({groupedBookings.upcoming.length})
                  </h2>
                  <div className="space-y-4">
                    {groupedBookings.upcoming.map((booking) => {
                      const { date, time } = formatDateTime(booking.appointmentTime)
                      return (
                        <div key={booking.bookingId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-3">
                                {getStatusIcon(booking.bookingStatus)}
                                <span className={`
                                  ml-2 px-3 py-1 rounded-full text-sm font-secondary border
                                  ${getStatusColor(booking.bookingStatus)}
                                `}>
                                  {getStatusText(booking.bookingStatus)}
                                </span>
                              </div>
                              
                              <h3 className="text-lg font-primary font-semibold text-text-dark mb-2">
                                {booking.serviceName}
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-sm font-secondary text-gray-600">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  {date}
                                </div>
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  {time}
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <p className="text-sm font-secondary text-gray-600">
                                  <strong>Mã đặt hẹn:</strong> #{booking.bookingId}
                                </p>
                                <p className="text-sm font-secondary text-gray-600">
                                  <strong>Chi phí:</strong> {booking.servicePrice?.toLocaleString('vi-VN')} VNĐ
                                </p>
                              </div>
                            </div>
                            
                            <div className="ml-6 flex flex-col space-y-2">
                              {canCancelBooking(booking) && (
                                <button
                                  onClick={() => handleCancelBooking(booking.bookingId)}
                                  disabled={cancellingBookingId === booking.bookingId}
                                  className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-secondary text-sm disabled:opacity-50"
                                >
                                  {cancellingBookingId === booking.bookingId ? 'Đang hủy...' : 'Hủy hẹn'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* In Progress Bookings */}
              {groupedBookings.inProgress.length > 0 && (
                <section>
                  <h2 className="text-xl font-primary font-semibold text-text-dark mb-4">
                    Đang xử lý ({groupedBookings.inProgress.length})
                  </h2>
                  <div className="space-y-4">
                    {groupedBookings.inProgress.map((booking) => {
                      const { date, time } = formatDateTime(booking.appointmentTime)
                      return (
                        <div key={booking.bookingId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-3">
                                {getStatusIcon(booking.bookingStatus)}
                                <span className={`
                                  ml-2 px-3 py-1 rounded-full text-sm font-secondary border
                                  ${getStatusColor(booking.bookingStatus)}
                                `}>
                                  {getStatusText(booking.bookingStatus)}
                                </span>
                              </div>
                              
                              <h3 className="text-lg font-primary font-semibold text-text-dark mb-2">
                                {booking.serviceName}
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-sm font-secondary text-gray-600">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  {date}
                                </div>
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  {time}
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <p className="text-sm font-secondary text-gray-600">
                                  <strong>Mã đặt hẹn:</strong> #{booking.bookingId}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Completed Bookings */}
              {groupedBookings.completed.length > 0 && (
                <section>
                  <h2 className="text-xl font-primary font-semibold text-text-dark mb-4">
                    Đã hoàn thành ({groupedBookings.completed.length})
                  </h2>
                  <div className="space-y-4">
                    {groupedBookings.completed.map((booking) => {
                      const { date, time } = formatDateTime(booking.appointmentTime)
                      return (
                        <div key={booking.bookingId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-3">
                                {getStatusIcon(booking.bookingStatus)}
                                <span className={`
                                  ml-2 px-3 py-1 rounded-full text-sm font-secondary border
                                  ${getStatusColor(booking.bookingStatus)}
                                `}>
                                  {getStatusText(booking.bookingStatus)}
                                </span>
                              </div>
                              
                              <h3 className="text-lg font-primary font-semibold text-text-dark mb-2">
                                {booking.serviceName}
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-sm font-secondary text-gray-600">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  {date}
                                </div>
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  {time}
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <p className="text-sm font-secondary text-gray-600">
                                  <strong>Mã đặt hẹn:</strong> #{booking.bookingId}
                                </p>
                              </div>
                            </div>
                            
                            <div className="ml-6">
                              <button
                                onClick={() => navigate('/dashboard?view=test-results')}
                                className="px-4 py-2 bg-primary text-text-light rounded-lg hover:bg-primary-600 transition-colors font-secondary text-sm"
                              >
                                Xem kết quả
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Cancelled Bookings */}
              {groupedBookings.cancelled.length > 0 && (
                <section>
                  <h2 className="text-xl font-primary font-semibold text-text-dark mb-4">
                    Đã hủy ({groupedBookings.cancelled.length})
                  </h2>
                  <div className="space-y-4">
                    {groupedBookings.cancelled.map((booking) => {
                      const { date, time } = formatDateTime(booking.appointmentTime)
                      return (
                        <div key={booking.bookingId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle opacity-75">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-3">
                                {getStatusIcon(booking.bookingStatus)}
                                <span className={`
                                  ml-2 px-3 py-1 rounded-full text-sm font-secondary border
                                  ${getStatusColor(booking.bookingStatus)}
                                `}>
                                  {getStatusText(booking.bookingStatus)}
                                </span>
                              </div>
                              
                              <h3 className="text-lg font-primary font-semibold text-text-dark mb-2">
                                {booking.serviceName}
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-sm font-secondary text-gray-600">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  {date}
                                </div>
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  {time}
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <p className="text-sm font-secondary text-gray-600">
                                  <strong>Mã đặt hẹn:</strong> #{booking.bookingId}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserBookingPage