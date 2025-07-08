import React, { useState, useEffect } from 'react'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { getMyTestResults, getMyBookings, type TestResult, type TestBooking } from '../services/testResultsService'

const UserDashboard: React.FC = () => {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')
  const [expandedResult, setExpandedResult] = useState<number | null>(null)
  const [pillReminder, setPillReminder] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [bookings, setBookings] = useState<TestBooking[]>([])
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [resultsError, setResultsError] = useState<string | null>(null)
  
  // TODO: Use bookings data for booking history or dashboard statistics

  // Initialize pill reminder from user profile
  useEffect(() => {
    if (user?.wantsCycleNotifications) {
      setPillReminder(user.wantsCycleNotifications)
    }
  }, [user])

  // Fetch test results when component mounts or when switching to test results view
  useEffect(() => {
    if (activeView === 'test-results' || activeView === 'dashboard' || activeView === 'my-bookings') {
      fetchTestResults()
      fetchBookings()
    }
  }, [activeView])

  const fetchTestResults = async () => {
    setIsLoadingResults(true)
    setResultsError(null)
    try {
      const results = await getMyTestResults()
      setTestResults(results)
    } catch (error: any) {
      console.error('Failed to fetch test results:', error)
      if (error.response?.status === 401) {
        setResultsError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      } else if (error.response?.status === 403) {
        setResultsError('Bạn không có quyền truy cập kết quả xét nghiệm.')
      } else {
        setResultsError('Không thể tải kết quả xét nghiệm. Vui lòng thử lại sau.')
      }
    } finally {
      setIsLoadingResults(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const userBookings = await getMyBookings()
      setBookings(userBookings)
      // TODO: Use bookings data for dashboard statistics or booking history
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    }
  }

  // Remove hardcoded test results - now using real API data

  const sidebarItems = [
    { id: 'dashboard', text: 'Tổng quan', icon: HomeIcon },
    { id: 'test-results', text: 'Kết quả Xét nghiệm', icon: DocumentTextIcon },
    { id: 'my-bookings', text: 'Lịch hẹn của tôi', icon: ClockIcon },
    { id: 'menstrual-cycle', text: 'Chu kỳ của tôi', icon: CalendarIcon },
    { id: 'account', text: 'Tài khoản', icon: UserIcon }
  ]

  const renderDashboardView = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
          Chào mừng trở lại, {user?.firstName || 'Người dùng'}!
        </h1>
        <p className="font-secondary text-gray-600">
          Quản lý sức khỏe của bạn một cách dễ dàng và hiệu quả
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <div className="flex items-center mb-4">
            <div className="bg-primary-light rounded-lg p-3 mr-4">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-primary font-semibold text-text-dark">Lịch Hẹn Sắp Tới</h3>
            </div>
          </div>
          <div className="mb-4">
            {bookings.filter(b => b.bookingStatus === 'Booked').length > 0 ? (
              <div>
                <p className="text-2xl font-primary font-bold text-text-dark">
                  {bookings.filter(b => b.bookingStatus === 'Booked').length}
                </p>
                <p className="font-secondary text-gray-600 text-sm">
                  lịch hẹn sắp tới
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-primary font-semibold text-gray-500">
                  Không có lịch hẹn
                </p>
                <p className="font-secondary text-gray-600 text-sm">
                  Đặt lịch hẹn mới ngay
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setActiveView('my-bookings')}
            className="text-primary font-secondary font-semibold hover:text-primary-600 text-sm"
          >
            Xem tất cả lịch hẹn →
          </button>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <div className="flex items-center mb-4">
            <div className="bg-accent rounded-lg p-3 mr-4">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-primary font-semibold text-text-dark">Kết Quả Gần Nhất</h3>
            </div>
          </div>
          <div className="mb-4">
            {isLoadingResults ? (
              <p className="font-secondary text-gray-600">Đang tải...</p>
            ) : testResults.length > 0 ? (
              <div>
                <p className="text-2xl font-primary font-bold text-text-dark">
                  {testResults.length}
                </p>
                <p className="font-secondary text-gray-600 text-sm">
                  kết quả có sẵn
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-primary font-semibold text-gray-500">
                  Chưa có kết quả
                </p>
                <p className="font-secondary text-gray-600 text-sm">
                  Đặt xét nghiệm để có kết quả
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setActiveView('test-results')}
            className="text-primary font-secondary font-semibold hover:text-primary-600 text-sm"
          >
            Xem tất cả kết quả →
          </button>
        </div>

        {/* Cycle Predictions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <div className="flex items-center mb-4">
            <div className="bg-secondary rounded-lg p-3 mr-4">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-primary font-semibold text-text-dark">Dự Báo Chu Kỳ</h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-secondary text-gray-600 text-sm mb-1">
              Kỳ kinh tiếp theo:
            </p>
            <p className="text-lg font-primary font-semibold text-text-dark">
              20/07/2025
            </p>
          </div>
          <button 
            onClick={() => setActiveView('menstrual-cycle')}
            className="text-primary font-secondary font-semibold hover:text-primary-600 text-sm"
          >
            Theo dõi chu kỳ →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.href = '/book-service'}
          className="flex items-center justify-center bg-primary text-text-light px-8 py-4 rounded-2xl font-secondary font-bold hover:bg-primary-600 transition-colors"
        >
          <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Đặt Lịch Xét Nghiệm Mới
        </button>
        <button
          onClick={() => setActiveView('menstrual-cycle')}
          className="flex items-center justify-center bg-white border-2 border-primary text-primary px-8 py-4 rounded-2xl font-secondary font-bold hover:bg-primary-light transition-colors"
        >
          <CalendarIcon className="h-6 w-6 mr-3" />
          Theo Dõi Chu Kỳ
        </button>
      </div>

      {/* Recent Bookings Preview */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-primary font-semibold text-text-dark">
              Hoạt Động Gần Đây
            </h3>
            <button 
              onClick={() => setActiveView('my-bookings')}
              className="text-primary font-secondary font-semibold hover:text-primary-600 text-sm"
            >
              Xem tất cả →
            </button>
          </div>
          
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.bookingId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className="mr-4">
                    {booking.bookingStatus === 'Processing' ? (
                      <ClockIcon className="h-8 w-8 text-yellow-500" />
                    ) : booking.bookingStatus === 'ResultReady' ? (
                      <CheckCircleIcon className="h-8 w-8 text-green-500" />
                    ) : (
                      <CalendarIcon className="h-8 w-8 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-primary font-semibold text-text-dark">
                      {booking.serviceName}
                    </h4>
                    <p className="font-secondary text-gray-600 text-sm">
                      Trạng thái: {booking.bookingStatus === 'Processing' ? 'Đang xử lý' : 
                                  booking.bookingStatus === 'ResultReady' ? 'Đã có kết quả' : 
                                  'Đã đặt hẹn'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveView(booking.bookingStatus === 'ResultReady' ? 'test-results' : 'my-bookings')}
                  className="text-primary font-secondary font-semibold hover:text-primary-600 text-sm"
                >
                  Xem
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderTestResultsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-primary font-semibold text-text-dark">Kết quả Xét nghiệm của bạn</h2>
        <button 
          onClick={fetchTestResults}
          className="text-primary font-secondary font-semibold hover:text-primary-600 transition-colors"
          disabled={isLoadingResults}
        >
          {isLoadingResults ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {/* Error Message */}
      {resultsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-secondary text-sm">{resultsError}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoadingResults && !resultsError && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border-subtle">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-secondary text-gray-600">Đang tải kết quả xét nghiệm...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingResults && !resultsError && testResults.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border-subtle">
          <h3 className="text-xl font-primary font-semibold text-text-dark mb-4">
            Bắt đầu hành trình sức khỏe của bạn
          </h3>
          <p className="font-secondary text-gray-600 mb-6">
            Sau khi xét nghiệm hoàn tất, bạn có thể kiểm tra trạng thái và xem kết quả tại đây.
          </p>
          <button className="bg-primary text-text-light px-6 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors">
            Đặt lịch xét nghiệm
          </button>
        </div>
      )}

      {/* Test Results List */}
      {!isLoadingResults && !resultsError && testResults.length > 0 && (
        <div className="space-y-4">
          {testResults.map((result) => (
            <div key={result.resultId} className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
              <button
                onClick={() => setExpandedResult(expandedResult === result.resultId ? null : result.resultId)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-primary font-semibold text-text-dark">
                    {result.serviceName} - {new Date(result.issuedAt).toLocaleDateString('vi-VN')}
                  </h3>
                  <p className="font-secondary text-green-600 text-sm mt-1">
                    Đã có kết quả
                  </p>
                  {result.notes && (
                    <p className="font-secondary text-gray-500 text-sm mt-1">{result.notes}</p>
                  )}
                  <p className="font-secondary text-gray-400 text-xs mt-1">
                    Được phát hành bởi: {result.issuedByName}
                  </p>
                </div>
                {expandedResult === result.resultId ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {expandedResult === result.resultId && result.resultDetails && result.resultDetails.length > 0 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="mt-4">
                    <h4 className="font-primary font-semibold text-text-dark mb-3">Chi tiết kết quả:</h4>
                    <div className="space-y-2">
                      {result.resultDetails.map((detail, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <span className="font-secondary text-text-dark">{detail.analyteName}</span>
                            {detail.referenceRange && (
                              <span className="font-secondary text-gray-500 text-sm block">
                                Tham chiếu: {detail.referenceRange}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`font-secondary font-semibold ${
                              detail.flag === 'Normal' ? 'text-green-600' : 
                              detail.flag === 'Abnormal' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {detail.value}
                              {detail.unit && ` ${detail.unit}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Download Button */}
                    {result.downloadUrl && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="bg-primary text-text-light px-4 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors">
                          Tải xuống kết quả PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderMenstrualCycleView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-primary font-semibold text-text-dark">Theo dõi chu kỳ</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <h3 className="font-primary font-semibold text-text-dark mb-4">Ghi nhận kỳ kinh</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-secondary text-text-dark mb-2">Ngày bắt đầu</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-secondary text-text-dark mb-2">Độ dài kỳ kinh (ngày)</label>
              <input 
                type="number" 
                placeholder="5"
                className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="w-full bg-primary text-text-light py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors">
              Lưu
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <h3 className="font-primary font-semibold text-text-dark mb-4">Dự đoán</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-secondary text-text-dark">Ngày rụng trứng dự kiến</span>
              <span className="font-secondary font-semibold text-primary">20/07/2025</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-secondary text-text-dark">Cửa sổ thụ thai</span>
              <span className="font-secondary font-semibold text-primary">15/07 - 20/07/2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-primary font-semibold text-text-dark">Nhắc nhở uống thuốc hàng ngày</h3>
            <p className="font-secondary text-gray-600 text-sm mt-1">
              Nhận thông báo nhắc nhở uống thuốc tránh thai
            </p>
          </div>
          <button
            onClick={() => setPillReminder(!pillReminder)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              pillReminder ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pillReminder ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )

  const renderAccountView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-primary font-semibold text-text-dark">Tài khoản</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
        <h3 className="font-primary font-semibold text-text-dark mb-6">Thông tin liên hệ</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-secondary text-text-dark mb-2">Họ</label>
            <input 
              type="text" 
              value={user?.lastName || ''}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-secondary text-text-dark mb-2">Tên</label>
            <input 
              type="text" 
              value={user?.firstName || ''}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-secondary text-text-dark mb-2">Email</label>
            <input 
              type="email" 
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block font-secondary text-text-dark mb-2">Số điện thoại</label>
            <input 
              type="tel" 
              value={user?.phoneNumber || ''}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-primary text-text-light px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )

  const renderMyBookingsView = () => {
    const groupBookingsByStatus = (bookings: TestBooking[]) => {
      const groups = {
        upcoming: bookings.filter(b => ['Booked'].includes(b.bookingStatus)),
        inProgress: bookings.filter(b => ['SampleCollected', 'Processing'].includes(b.bookingStatus)),
        completed: bookings.filter(b => ['ResultReady'].includes(b.bookingStatus))
      }
      return groups
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Booked':
          return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'SampleCollected':
          return 'bg-green-50 text-green-700 border-green-200'
        case 'Processing':
          return 'bg-yellow-50 text-yellow-700 border-yellow-200'
        case 'ResultReady':
          return 'bg-green-50 text-green-700 border-green-200'
        default:
          return 'bg-gray-50 text-gray-700 border-gray-200'
      }
    }

    const getStatusText = (status: string) => {
      switch (status) {
        case 'Booked':
          return 'Đã đặt hẹn'
        case 'SampleCollected':
          return 'Đã lấy mẫu'
        case 'Processing':
          return 'Đang xử lý'
        case 'ResultReady':
          return 'Có kết quả'
        default:
          return status
      }
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

    if (bookings.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-primary font-semibold text-text-dark">Lịch hẹn của tôi</h2>
            <button
              onClick={() => window.location.href = '/book-service'}
              className="bg-primary text-text-light px-6 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
            >
              Đặt hẹn mới
            </button>
          </div>
          
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border-subtle">
            <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-primary font-semibold text-text-dark mb-2">
              Chưa có lịch hẹn nào
            </h3>
            <p className="font-secondary text-gray-600 mb-6">
              Bạn chưa đặt lịch hẹn xét nghiệm nào. Hãy bắt đầu hành trình chăm sóc sức khỏe của bạn.
            </p>
            <button
              onClick={() => window.location.href = '/book-service'}
              className="bg-primary text-text-light px-8 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
            >
              Đặt lịch hẹn đầu tiên
            </button>
          </div>
        </div>
      )
    }

    const groupedBookings = groupBookingsByStatus(bookings)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-primary font-semibold text-text-dark">Lịch hẹn của tôi</h2>
          <button
            onClick={() => window.location.href = '/book-service'}
            className="bg-primary text-text-light px-6 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
          >
            Đặt hẹn mới
          </button>
        </div>

        <div className="space-y-8">
          {/* Upcoming Bookings */}
          {groupedBookings.upcoming.length > 0 && (
            <section>
              <h3 className="text-lg font-primary font-semibold text-text-dark mb-4">
                Lịch hẹn sắp tới ({groupedBookings.upcoming.length})
              </h3>
              <div className="space-y-4">
                {groupedBookings.upcoming.map((booking) => {
                  const { date, time } = formatDateTime(booking.appointmentTime)
                  return (
                    <div key={booking.bookingId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-secondary border ${getStatusColor(booking.bookingStatus)}`}>
                              {getStatusText(booking.bookingStatus)}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-primary font-semibold text-text-dark mb-2">
                            {booking.serviceName}
                          </h4>
                          
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
              <h3 className="text-lg font-primary font-semibold text-text-dark mb-4">
                Đang xử lý ({groupedBookings.inProgress.length})
              </h3>
              <div className="space-y-4">
                {groupedBookings.inProgress.map((booking) => {
                  const { date, time } = formatDateTime(booking.appointmentTime)
                  return (
                    <div key={booking.bookingId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-secondary border ${getStatusColor(booking.bookingStatus)}`}>
                              {getStatusText(booking.bookingStatus)}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-primary font-semibold text-text-dark mb-2">
                            {booking.serviceName}
                          </h4>
                          
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
              <h3 className="text-lg font-primary font-semibold text-text-dark mb-4">
                Đã hoàn thành ({groupedBookings.completed.length})
              </h3>
              <div className="space-y-4">
                {groupedBookings.completed.map((booking) => {
                  const { date, time } = formatDateTime(booking.appointmentTime)
                  return (
                    <div key={booking.bookingId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-secondary border ${getStatusColor(booking.bookingStatus)}`}>
                              {getStatusText(booking.bookingStatus)}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-primary font-semibold text-text-dark mb-2">
                            {booking.serviceName}
                          </h4>
                          
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
                            onClick={() => setActiveView('test-results')}
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
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeView) {
      case 'test-results':
        return renderTestResultsView()
      case 'my-bookings':
        return renderMyBookingsView()
      case 'menstrual-cycle':
        return renderMenstrualCycleView()
      case 'account':
        return renderAccountView()
      default:
        return renderDashboardView()
    }
  }

  return (
    <div className="bg-background-light min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle sticky top-8">
              <h3 className="font-primary font-semibold text-text-dark mb-6">
                Xin chào, {user?.firstName || 'Người dùng'}
              </h3>
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-secondary transition-colors ${
                        activeView === item.id
                          ? 'bg-primary-light text-primary'
                          : 'text-text-dark hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.text}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
          

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
           {/* Back to Home */}
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="font-secondary text-gray-600 hover:text-primary transition-colors"
          >
            ← Quay về trang chủ
          </a>
        </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard