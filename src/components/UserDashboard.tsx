import React, { useState, useEffect } from 'react'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { getMyTestResults, getMyBookings, type TestResult, type TestBooking } from '../services/testResultsService'
import { 
  getMenstrualCycles, 
  getCyclePredictions, 
  logMenstrualCycle, 
  updateMenstrualCycle,
  updatePillReminderSettings,
  getPillReminderSettings,
  type MenstrualCycle, 
  type CyclePrediction, 
  type MenstrualCycleData 
} from '../services/healthTrackingService'
import api from '../services/api'
import { getUserAppointments, type Appointment } from '../services/appointmentService'
import AppointmentBooking from './AppointmentBooking'

const UserDashboard: React.FC = () => {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')
  const [expandedResult, setExpandedResult] = useState<number | null>(null)
  const [pillReminder, setPillReminder] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [bookings, setBookings] = useState<TestBooking[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [bookingType, setBookingType] = useState<'test' | 'consultation'>('test')
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [resultsError, setResultsError] = useState<string | null>(null)
  
  // Menstrual cycle states
  const [showLogModal, setShowLogModal] = useState(false)
  const [showEndCycleModal, setShowEndCycleModal] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [cycleNotifications, setCycleNotifications] = useState(true)
  const [pillReminderTime, setPillReminderTime] = useState('08:00')
  
  // Real menstrual cycle data
  const [menstrualCycles, setMenstrualCycles] = useState<MenstrualCycle[]>([])
  const [cyclePredictions, setCyclePredictions] = useState<CyclePrediction | null>(null)
  const [isLoadingCycles, setIsLoadingCycles] = useState(false)
  const [cycleError, setCycleError] = useState<string | null>(null)
  
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
      fetchAppointments()
    }
    if (activeView === 'menstrual-cycle' || activeView === 'dashboard') {
      fetchMenstrualData()
    }
  }, [activeView])

  // Initialize pill reminder settings from user profile
  useEffect(() => {
    if (user?.wantsCycleNotifications !== undefined) {
      setCycleNotifications(user.wantsCycleNotifications)
    }
    if (user?.pillReminderTime) {
      setPillReminderTime(user.pillReminderTime)
    }
  }, [user])

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

  const fetchMenstrualData = async () => {
    setIsLoadingCycles(true)
    setCycleError(null)
    try {
      // Fetch menstrual cycles and predictions in parallel
      const [cycles, predictions] = await Promise.all([
        getMenstrualCycles(),
        getCyclePredictions().catch(() => null) // Don't fail if no predictions available
      ])
      
      setMenstrualCycles(cycles)
      setCyclePredictions(predictions)
    } catch (error: any) {
      console.error('Failed to fetch menstrual data:', error)
      if (error.response?.status === 404) {
        // No cycles recorded yet - this is normal for new users
        setMenstrualCycles([])
        setCyclePredictions(null)
      } else {
        setCycleError('Không thể tải dữ liệu chu kỳ. Vui lòng thử lại sau.')
      }
    } finally {
      setIsLoadingCycles(false)
    }
  }

  // Handle logging new menstrual cycle
  const handleLogNewCycle = async (e: React.FormEvent) => {
    console.log('Form submitted!') // Debug: Check if function is called
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const startDate = formData.get('startDate') as string
    const cycleLength = parseInt(formData.get('cycleLength') as string)
    
    console.log('Form data extracted:', { startDate, cycleLength }) // Debug: Check form data
    
    if (!startDate || !cycleLength) {
      console.error('Missing form data:', { startDate, cycleLength })
      setCycleError('Vui lòng điền đầy đủ thông tin.')
      return
    }

    // Validation: Check for future start date
    const today = new Date()
    const selectedDate = new Date(startDate)
    if (selectedDate > today) {
      setCycleError('Ngày bắt đầu không thể là ngày trong tương lai.')
      return
    }

    // Validation: Check for active cycles
    const activeCycle = menstrualCycles.find(cycle => !cycle.endDate)
    if (activeCycle) {
      setCycleError('Vui lòng kết thúc chu kỳ hiện tại trước khi tạo chu kỳ mới.')
      return
    }

    // Validation: Check cycle length
    if (cycleLength < 21 || cycleLength > 35) {
      setCycleError('Độ dài chu kỳ phải từ 21 đến 35 ngày.')
      return
    }
    
    try {
      const cycleData: MenstrualCycleData = {
        startDate,
        cycleLength
      }
      
      console.log('Submitting new cycle:', cycleData) // Debug log
      await logMenstrualCycle(cycleData)
      setShowLogModal(false)
      setCycleError(null) // Clear any previous errors
      
      // Refresh menstrual data
      await fetchMenstrualData()
    } catch (error: any) {
      console.error('Failed to log menstrual cycle:', error)
      // Handle specific API errors
      if (error.response?.status === 400) {
        setCycleError(error.response.data.message || 'Dữ liệu không hợp lệ.')
      } else {
        setCycleError('Không thể lưu chu kỳ. Vui lòng thử lại.')
      }
    }
  }

  // Handle ending current cycle
  const handleEndCurrentCycle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const activeCycle = menstrualCycles.find(cycle => !cycle.endDate)
    if (!activeCycle) {
      setCycleError('Không có chu kỳ nào đang diễn ra.')
      return
    }
    
    const formData = new FormData(e.target as HTMLFormElement)
    const endDate = formData.get('endDate') as string
    
    if (!endDate) {
      setCycleError('Vui lòng chọn ngày kết thúc.')
      return
    }

    // Validation: End date cannot be before start date
    const startDate = new Date(activeCycle.startDate)
    const selectedEndDate = new Date(endDate)
    if (selectedEndDate < startDate) {
      setCycleError('Ngày kết thúc không thể trước ngày bắt đầu.')
      return
    }

    // Validation: End date cannot be in the future
    const today = new Date()
    if (selectedEndDate > today) {
      setCycleError('Ngày kết thúc không thể là ngày trong tương lai.')
      return
    }
    
    try {
      console.log('Ending cycle:', activeCycle.cycleId, 'with end date:', endDate) // Debug log
      await updateMenstrualCycle(activeCycle.cycleId, { endDate })
      
      setShowEndCycleModal(false)
      setCycleError(null)
      
      // Refresh menstrual data
      await fetchMenstrualData()
    } catch (error: any) {
      console.error('Failed to end cycle:', error)
      if (error.response?.status === 400) {
        setCycleError(error.response.data.message || 'Dữ liệu không hợp lệ.')
      } else {
        setCycleError('Không thể kết thúc chu kỳ. Vui lòng thử lại.')
      }
    }
  }

  // Handle updating cycle notifications
  const handleCycleNotificationsToggle = async (enabled: boolean) => {
    console.log('Cycle notifications toggle clicked:', enabled)
    setCycleNotifications(enabled)
    
    try {
      // ALWAYS include both fields - wantsCycleNotifications is required
      const payload = {
        wantsCycleNotifications: enabled,
        pillReminderTime: enabled ? (pillReminder && pillReminderTime ? pillReminderTime + ":00.0000000" : null) : null
      }
      
      // Business logic: If turning OFF cycle notifications, also turn off pill reminder switch
      if (!enabled) {
        setPillReminder(false)
      }
      
      console.log('Sending cycle notifications update:', payload)
      
      await api.put('/api/CustomerProfile/notifications', payload)
      console.log('Cycle notifications updated successfully')
    } catch (error) {
      console.error('Failed to update cycle notifications:', error)
      // Revert on error
      setCycleNotifications(!enabled)
    }
  }

  // Handle updating pill reminder settings
  const handlePillReminderToggle = async (enabled: boolean) => {
    console.log('Pill reminder toggle clicked:', enabled)
    
    // Business logic: Can only enable pill reminder if cycle notifications are ON
    if (enabled && !cycleNotifications) {
      console.log('Cannot enable pill reminder without cycle notifications')
      return
    }
    
    // Business logic: Must have a time selected to enable pill reminder
    if (enabled && !pillReminderTime) {
      console.log('Cannot enable pill reminder without time selected')
      return
    }
    
    setPillReminder(enabled)
    
    try {
      // ALWAYS include both fields - wantsCycleNotifications is required
      const payload = {
        wantsCycleNotifications: cycleNotifications, // Always include current state
        pillReminderTime: enabled && pillReminderTime ? pillReminderTime + ":00.0000000" : null
      }
      
      console.log('Sending pill reminder update:', payload)
      
      await api.put('/api/CustomerProfile/notifications', payload)
      console.log('Pill reminder updated successfully')
    } catch (error) {
      console.error('Failed to update pill reminder:', error)
      // Revert on error
      setPillReminder(!enabled)
    }
  }

  // Handle updating pill reminder time
  const handlePillReminderTimeChange = async (time: string) => {
    console.log('Pill reminder time changed:', time)
    setPillReminderTime(time)
    
    // Only update if pill reminder is enabled and cycle notifications are on
    if (pillReminder && cycleNotifications && time) {
      try {
        // ALWAYS include both fields - wantsCycleNotifications is required
        const payload = {
          wantsCycleNotifications: cycleNotifications, // Always include current state
          pillReminderTime: time + ":00.0000000"
        }
        console.log('Sending pill reminder time update:', payload)
        
        await api.put('/api/CustomerProfile/notifications', payload)
        console.log('Pill reminder time updated successfully')
      } catch (error) {
        console.error('Failed to update pill reminder time:', error)
      }
    }
  }

  // Calculate cycle predictions based on real data
  const calculateCycleInfo = () => {
    if (!menstrualCycles.length) {
      return {
        currentCycleDay: 0,
        cycleLength: 28,
        cyclePhase: 'Chưa có dữ liệu',
        nextPeriodDate: 'Chưa xác định',
        ovulationDate: 'Chưa xác định',
        fertilityWindowEnd: 'Chưa xác định'
      }
    }

    const latestCycle = menstrualCycles[0] // Assuming sorted by date
    const startDate = new Date(latestCycle.startDate)
    const today = new Date()
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    const cycleLength = latestCycle.cycleLength || 28
    const currentCycleDay = (daysSinceStart % cycleLength) + 1
    
    // Calculate phase based on cycle day
    let cyclePhase = ''
    if (currentCycleDay <= 5) {
      cyclePhase = 'Kỳ kinh'
    } else if (currentCycleDay <= 13) {
      cyclePhase = 'Giai đoạn nang trứng'
    } else if (currentCycleDay <= 15) {
      cyclePhase = 'Rụng trứng'
    } else {
      cyclePhase = 'Giai đoạn hoàng thể'
    }

    // Use predictions if available, otherwise calculate
    const nextPeriodDate = cyclePredictions?.nextPeriodDate || 
      new Date(startDate.getTime() + cycleLength * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')
    
    const ovulationDate = cyclePredictions?.ovulationDate ||
      new Date(startDate.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')
    
    const fertilityWindowEnd = cyclePredictions?.fertilityWindowEnd ||
      new Date(startDate.getTime() + (cycleLength - 13) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')

    return {
      currentCycleDay,
      cycleLength,
      cyclePhase,
      nextPeriodDate,
      ovulationDate,
      fertilityWindowEnd
    }
  }

  const fetchAppointments = async () => {
    try {
      const userAppointments = await getUserAppointments()
      setAppointments(userAppointments)
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
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
            {(() => {
              const upcomingTestBookings = bookings.filter(b => b.bookingStatus === 'Booked').length
              const upcomingConsultations = appointments.filter(a => ['Scheduled', 'Confirmed'].includes(a.appointmentStatus)).length
              const totalUpcoming = upcomingTestBookings + upcomingConsultations
              
              return totalUpcoming > 0 ? (
                <div>
                  <p className="text-2xl font-primary font-bold text-text-dark">
                    {totalUpcoming}
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
              )
            })()}
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
          onClick={() => setActiveView('appointment-booking')}
          className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-secondary font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <VideoCameraIcon className="h-6 w-6 mr-3" />
          Đặt Cuộc Hẹn Tư Vấn Online
        </button>
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
                    {(result as any).downloadUrl && (
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

  const renderMenstrualCycleView = () => {
    // Mock cycle data - would come from API
    // Calculate real cycle data
    const cycleInfo = calculateCycleInfo()
    const { currentCycleDay, cycleLength, cyclePhase, nextPeriodDate, ovulationDate, fertilityWindowEnd } = cycleInfo
    
    const cycleHistory = [
      { startDate: '2024-11-15', endDate: '2024-11-20', actualLength: 28 },
      { startDate: '2024-10-18', endDate: '2024-10-23', actualLength: 29 },
      { startDate: '2024-09-20', endDate: '2024-09-25', actualLength: 27 }
    ]


    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-primary font-semibold text-text-dark">
            Chu Kỳ Của Tôi
          </h2>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center bg-primary text-text-light px-6 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ghi nhận Kỳ kinh Mới
          </button>
        </div>

        {/* Loading State */}
        {isLoadingCycles && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 font-secondary text-gray-600">Đang tải dữ liệu chu kỳ...</span>
          </div>
        )}

        {/* Error State */}
        {cycleError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 font-secondary">{cycleError}</p>
            <button 
              onClick={fetchMenstrualData}
              className="mt-2 text-red-600 hover:text-red-800 font-secondary font-semibold"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingCycles && !cycleError && menstrualCycles.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-subtle text-center">
            <div className="max-w-md mx-auto">
              <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-primary font-semibold text-gray-600 mb-2">
                Chưa có dữ liệu chu kỳ
              </h3>
              <p className="font-secondary text-gray-500 mb-4">
                Hãy bắt đầu theo dõi chu kỳ kinh nguyệt của bạn để nhận được dự báo chính xác.
              </p>
              <button 
                onClick={() => setShowLogModal(true)}
                className="bg-primary text-text-light px-6 py-3 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
              >
                Ghi nhận Kỳ kinh Đầu tiên
              </button>
            </div>
          </div>
        )}

        {/* Current Cycle Status & Actions */}
        {!isLoadingCycles && !cycleError && menstrualCycles.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-primary font-semibold text-text-dark">
                Trạng thái chu kỳ hiện tại
              </h3>
              {menstrualCycles.find(cycle => !cycle.endDate) && (
                <button 
                  onClick={() => {
                    console.log('End cycle button clicked!') // Debug log
                    setShowEndCycleModal(true)
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-secondary font-bold hover:bg-red-600 transition-colors"
                >
                  Kết thúc chu kỳ
                </button>
              )}
            </div>
            
            {(() => {
              const activeCycle = menstrualCycles.find(cycle => !cycle.endDate)
              const latestCycle = menstrualCycles[0]
              const displayCycle = activeCycle || latestCycle
              
              console.log('Displaying cycle:', displayCycle) // Debug log
              console.log('Active cycle found:', !!activeCycle) // Debug log
              
              if (!displayCycle) return null
              
              return (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-secondary text-gray-600 text-sm mb-1">Ngày bắt đầu</p>
                    <p className="text-lg font-primary font-semibold text-text-dark">
                      {new Date(displayCycle.startDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="font-secondary text-gray-600 text-sm mb-1">Trạng thái</p>
                    <p className="text-lg font-primary font-semibold text-text-dark">
                      {displayCycle.endDate ? 'Đã kết thúc' : 'Đang diễn ra'}
                    </p>
                  </div>
                  <div>
                    <p className="font-secondary text-gray-600 text-sm mb-1">
                      {displayCycle.endDate ? 'Ngày kết thúc' : 'Ngày hiện tại'}
                    </p>
                    <p className="text-lg font-primary font-semibold text-text-dark">
                      {displayCycle.endDate 
                        ? new Date(displayCycle.endDate).toLocaleDateString('vi-VN')
                        : `Ngày ${calculateCycleInfo().currentCycleDay}`
                      }
                    </p>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Current Cycle Visual Tracker */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-subtle">
          <div className="text-center mb-8">
            {/* Circular Progress Indicator */}
            <div className="relative inline-flex items-center justify-center w-48 h-48 mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0f4f43"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(currentCycleDay / cycleLength) * 251.2} 251.2`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-primary font-bold text-text-dark">
                  Ngày {currentCycleDay}
                </div>
                <div className="text-sm font-secondary text-gray-600 mt-1">
                  {cyclePhase}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-secondary text-gray-600 text-sm mb-1">
                  Ngày rụng trứng dự kiến
                </p>
                <p className="text-lg font-primary font-semibold text-text-dark">
                  15/07/2025
                </p>
              </div>
              <div>
                <p className="font-secondary text-gray-600 text-sm mb-1">
                  Bắt đầu cửa sổ thụ thai
                </p>
                <p className="text-lg font-primary font-semibold text-text-dark">
                  10/07/2025
                </p>
              </div>
              <div>
                <p className="font-secondary text-gray-600 text-sm mb-1">
                  Kết thúc cửa sổ thụ thai
                </p>
                <p className="text-lg font-primary font-semibold text-text-dark">
                  {fertilityWindowEnd}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cycle History Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-primary font-semibold text-text-dark">
              Xem Lịch sử Chu kỳ
            </h3>
            {showHistory ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {showHistory && (
            <div className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="text-left py-3 font-secondary font-semibold text-gray-600">
                        Ngày Bắt Đầu
                      </th>
                      <th className="text-left py-3 font-secondary font-semibold text-gray-600">
                        Ngày Kết Thúc
                      </th>
                      <th className="text-left py-3 font-secondary font-semibold text-gray-600">
                        Độ Dài Thực Tế
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {menstrualCycles.map((cycle, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 font-secondary text-text-dark">
                          {new Date(cycle.startDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3 font-secondary text-text-dark">
                          {cycle.endDate ? new Date(cycle.endDate).toLocaleDateString('vi-VN') : 'Đang diễn ra'}
                        </td>
                        <td className="py-3 font-secondary text-text-dark">
                          {cycle.cycleLength} ngày
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Settings and Reminders */}
        {!isLoadingCycles && !cycleError && menstrualCycles.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <h3 className="text-lg font-primary font-semibold text-text-dark mb-6">
            Cài đặt & Nhắc nhở
          </h3>
          
          <div className="space-y-6">
            {/* Cycle Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-secondary text-text-dark">
                  Nhận email dự báo về chu kỳ
                </p>
                <p className="font-secondary text-gray-600 text-sm">
                  Cửa sổ thụ thai, ngày rụng trứng
                </p>
              </div>
              <button
                onClick={() => handleCycleNotificationsToggle(!cycleNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  cycleNotifications ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    cycleNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-border-subtle pt-6">
              {/* Pill Reminder Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-secondary text-text-dark">
                    Bật nhắc nhở uống thuốc tránh thai hàng ngày
                  </p>
                </div>
                <button
                  onClick={() => handlePillReminderToggle(!pillReminder)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pillReminder ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pillReminder ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Time Picker (conditional) */}
              {pillReminder && (
                <div className="ml-0">
                  <label className="block font-secondary text-text-dark mb-2">
                    Giờ nhắc nhở
                  </label>
                  <input
                    type="time"
                    value={pillReminderTime}
                    onChange={(e) => handlePillReminderTimeChange(e.target.value)}
                    className="px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Log New Cycle Modal */}
        {showLogModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
                Ghi nhận Kỳ kinh Mới
              </h3>
              
              <form onSubmit={handleLogNewCycle} className="space-y-4">
                <div>
                  <label className="block font-secondary text-text-dark mb-2">
                    Ngày bắt đầu kỳ kinh
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block font-secondary text-text-dark mb-2">
                    Độ dài chu kỳ dự kiến (ngày)
                  </label>
                  <input
                    type="number"
                    name="cycleLength"
                    min="21"
                    max="35"
                    defaultValue="28"
                    required
                    className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-secondary font-bold hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-text-light px-6 py-3 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
                  >
                    Lưu Chu Kỳ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* End Cycle Modal */}
        {showEndCycleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
                Kết thúc Chu kỳ Hiện tại
              </h3>
              
              {(() => {
                const activeCycle = menstrualCycles.find(cycle => !cycle.endDate)
                if (!activeCycle) return null
                
                return (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-secondary text-gray-600 text-sm">Chu kỳ bắt đầu:</p>
                    <p className="font-primary font-semibold text-text-dark">
                      {new Date(activeCycle.startDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )
              })()}
              
              <form onSubmit={handleEndCurrentCycle} className="space-y-4">
                <div>
                  <label className="block font-secondary text-text-dark mb-2">
                    Ngày kết thúc kỳ kinh
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    max={new Date().toISOString().split('T')[0]} // Cannot be future date
                    required
                    className="w-full px-4 py-3 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chọn ngày cuối cùng của kỳ kinh
                  </p>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEndCycleModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-secondary font-bold hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-secondary font-bold hover:bg-red-600 transition-colors"
                  >
                    Kết thúc chu kỳ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

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

    const groupAppointmentsByStatus = (appointments: Appointment[]) => {
      const groups = {
        upcoming: appointments.filter(a => ['Scheduled', 'Confirmed'].includes(a.appointmentStatus)),
        inProgress: appointments.filter(a => ['Pending'].includes(a.appointmentStatus)),
        completed: appointments.filter(a => ['Completed'].includes(a.appointmentStatus))
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
        case 'Scheduled':
          return 'Đã lên lịch'
        case 'Confirmed':
          return 'Đã xác nhận'
        case 'Pending':
          return 'Đang chờ'
        case 'Completed':
          return 'Đã hoàn thành'
        case 'Cancelled':
          return 'Đã hủy'
        default:
          return status
      }
    }

    const getAppointmentStatusColor = (status: string) => {
      switch (status) {
        case 'Scheduled':
          return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'Confirmed':
          return 'bg-green-50 text-green-700 border-green-200'
        case 'Pending':
          return 'bg-yellow-50 text-yellow-700 border-yellow-200'
        case 'Completed':
          return 'bg-green-50 text-green-700 border-green-200'
        case 'Cancelled':
          return 'bg-red-50 text-red-700 border-red-200'
        default:
          return 'bg-gray-50 text-gray-700 border-gray-200'
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

    const currentData = bookingType === 'test' ? bookings : appointments
    const hasData = currentData.length > 0

    if (!hasData) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-primary font-semibold text-text-dark">Lịch hẹn của tôi</h2>
            <button
              onClick={() => bookingType === 'test' ? window.location.href = '/book-service' : setActiveView('appointment-booking')}
              className="bg-primary text-text-light px-6 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
            >
              {bookingType === 'test' ? 'Đặt lịch xét nghiệm' : 'Đặt lịch tư vấn'}
            </button>
          </div>

          {/* Booking Type Toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBookingType('test')}
                className={`px-6 py-2 rounded-md font-secondary font-medium transition-colors ${
                  bookingType === 'test'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Lịch Xét Nghiệm
              </button>
              <button
                onClick={() => setBookingType('consultation')}
                className={`px-6 py-2 rounded-md font-secondary font-medium transition-colors ${
                  bookingType === 'consultation'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Lịch Tư Vấn
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border-subtle">
            <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-primary font-semibold text-text-dark mb-2">
              {bookingType === 'test' ? 'Chưa có lịch xét nghiệm nào' : 'Chưa có lịch tư vấn nào'}
            </h3>
            <p className="font-secondary text-gray-600 mb-6">
              {bookingType === 'test' 
                ? 'Bạn chưa đặt lịch hẹn xét nghiệm nào. Hãy bắt đầu hành trình chăm sóc sức khỏe của bạn.'
                : 'Bạn chưa đặt lịch tư vấn nào. Hãy đặt lịch tư vấn với chuyên gia để được hỗ trợ tốt nhất.'
              }
            </p>
            <button
              onClick={() => bookingType === 'test' ? window.location.href = '/book-service' : setActiveView('appointment-booking')}
              className="bg-primary text-text-light px-8 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
            >
              {bookingType === 'test' ? 'Đặt lịch xét nghiệm đầu tiên' : 'Đặt lịch tư vấn đầu tiên'}
            </button>
          </div>
        </div>
      )
    }

    const groupedBookings = groupBookingsByStatus(bookings)
    const groupedAppointments = groupAppointmentsByStatus(appointments)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-primary font-semibold text-text-dark">Lịch hẹn của tôi</h2>
          <button
            onClick={() => bookingType === 'test' ? window.location.href = '/book-service' : setActiveView('appointment-booking')}
            className="bg-primary text-text-light px-6 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
          >
            {bookingType === 'test' ? 'Đặt lịch xét nghiệm' : 'Đặt lịch tư vấn'}
          </button>
        </div>

        {/* Booking Type Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setBookingType('test')}
              className={`px-6 py-2 rounded-md font-secondary font-medium transition-colors ${
                bookingType === 'test'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Lịch Xét Nghiệm ({bookings.length})
            </button>
            <button
              onClick={() => setBookingType('consultation')}
              className={`px-6 py-2 rounded-md font-secondary font-medium transition-colors ${
                bookingType === 'consultation'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Lịch Tư Vấn ({appointments.length})
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {bookingType === 'test' ? (
            <>
              {/* Test Bookings - Upcoming */}
              {groupedBookings.upcoming.length > 0 && (
                <section>
                  <h3 className="text-lg font-primary font-semibold text-text-dark mb-4">
                    Lịch xét nghiệm sắp tới ({groupedBookings.upcoming.length})
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
            </>
          ) : (
            <>
              {/* Consultation Appointments - Upcoming */}
              {groupedAppointments.upcoming.length > 0 && (
                <section>
                  <h3 className="text-lg font-primary font-semibold text-text-dark mb-4">
                    Lịch tư vấn sắp tới ({groupedAppointments.upcoming.length})
                  </h3>
                  <div className="space-y-4">
                    {groupedAppointments.upcoming.map((appointment) => {
                      const startDate = new Date(appointment.startTime)
                      const endDate = new Date(appointment.endTime)
                      return (
                        <div key={appointment.appointmentId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-secondary border ${getAppointmentStatusColor(appointment.appointmentStatus)}`}>
                                  {getStatusText(appointment.appointmentStatus)}
                                </span>
                              </div>
                              
                              <h4 className="text-lg font-primary font-semibold text-text-dark mb-2">
                                Tư vấn với {appointment.consultantName}
                              </h4>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-sm font-secondary text-gray-600">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  {startDate.toLocaleDateString('vi-VN')}
                                </div>
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  {startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <p className="text-sm font-secondary text-gray-600">
                                  <strong>Mã cuộc hẹn:</strong> #{appointment.appointmentId}
                                </p>
                                <p className="text-sm font-secondary text-gray-600">
                                  <strong>Chuyên môn:</strong> {appointment.consultantSpecialization}
                                </p>
                                {appointment.meetingUrl && (
                                  <div className="mt-2">
                                    <a
                                      href={appointment.meetingUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                                    >
                                      <VideoCameraIcon className="h-4 w-4 mr-1" />
                                      Tham gia cuộc họp
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </>
          )}

          {/* In Progress Section */}
          {bookingType === 'test' ? (
            groupedBookings.inProgress.length > 0 && (
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
          )) : ""
        }
          

          {/* Completed Bookings */}
          {bookingType === 'test' ? (
            groupedBookings.completed.length > 0 && (
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
            )
          ) : (
            groupedAppointments.completed.length > 0 && (
              <section>
                <h3 className="text-lg font-primary font-semibold text-text-dark mb-4">
                  Đã hoàn thành ({groupedAppointments.completed.length})
                </h3>
                <div className="space-y-4">
                  {groupedAppointments.completed.map((appointment) => {
                    const startDate = new Date(appointment.startTime)
                    const endDate = new Date(appointment.endTime)
                    return (
                      <div key={appointment.appointmentId} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-secondary border ${getAppointmentStatusColor(appointment.appointmentStatus)}`}>
                                {getStatusText(appointment.appointmentStatus)}
                              </span>
                            </div>
                            
                            <h4 className="text-lg font-primary font-semibold text-text-dark mb-2">
                              Tư vấn với {appointment.consultantName}
                            </h4>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm font-secondary text-gray-600">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {startDate.toLocaleDateString('vi-VN')}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                {startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-sm font-secondary text-gray-600">
                                <strong>Mã cuộc hẹn:</strong> #{appointment.appointmentId}
                              </p>
                              <p className="text-sm font-secondary text-gray-600">
                                <strong>Chuyên môn:</strong> {appointment.consultantSpecialization}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
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
      case 'appointment-booking':
        return <AppointmentBooking onBack={() => setActiveView('dashboard')} />
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