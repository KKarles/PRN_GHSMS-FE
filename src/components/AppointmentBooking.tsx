import React, { useState, useEffect } from 'react'
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { 
  createAppointment, 
  getAvailableSchedules,
  type CreateAppointmentRequest,
  type ConsultantSchedule 
} from '../services/appointmentService'

interface AppointmentBookingProps {
  onBack: () => void
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedConsultant, setSelectedConsultant] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [isFlexibleTime, setIsFlexibleTime] = useState(false)
  const [customTime, setCustomTime] = useState('')
  const [availableSchedules, setAvailableSchedules] = useState<ConsultantSchedule[]>([])
  const [bookedTimeSlots, setBookedTimeSlots] = useState<{[key: string]: string[]}>({}) // consultantId -> booked times
  const [availableConsultants, setAvailableConsultants] = useState<any[]>([]) // Store consultants from backend
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBookingSuccess, setIsBookingSuccess] = useState(false)

  // Generate next 14 days for date selection (only future dates)
  const generateDates = () => {
    const dates = []
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // Reset time to 00:00:00
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Only add dates that are in the future
      if (date > today) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('vi-VN', { 
            weekday: 'short', 
            day: '2-digit', 
            month: '2-digit' 
          }),
          isPast: false
        })
      }
    }
    return dates
  }

  const [availableDates, setAvailableDates] = useState(generateDates())

  // Update available dates every minute to hide past dates
  useEffect(() => {
    const updateDates = () => {
      setAvailableDates(generateDates())
    }

    // Update dates immediately
    updateDates()

    // Update dates every minute
    const interval = setInterval(updateDates, 60000)

    return () => clearInterval(interval)
  }, [])

  // Fetch available schedules when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSchedules()
    }
  }, [selectedDate])

  const fetchAvailableSchedules = async () => {
    try {
      setIsLoading(true)
      const endDate = new Date(selectedDate)
      endDate.setDate(endDate.getDate() + 1)
      
      const schedules = await getAvailableSchedules(
        selectedDate, 
        endDate.toISOString().split('T')[0]
      )
      
      setAvailableSchedules(schedules)
      
      console.log('DEBUG: Raw schedules received:', schedules)
      console.log('DEBUG: Schedules length:', schedules.length)
      console.log('DEBUG: First schedule item:', schedules[0])
      
      // Extract consultants from schedules response (works for both cases)
      // Backend returns AvailableScheduleDto with consultant info
      const consultantsFromResponse = schedules.map(schedule => {
        console.log('DEBUG: Processing schedule:', schedule)
        return {
          consultantId: schedule.consultantId,
          consultantName: schedule.consultantName,
          specialization: schedule.consultantSpecialization || 'Chuyên khoa tổng quát',
          experience: schedule.consultantExperience || 'Kinh nghiệm chuyên môn',
          scheduleId: schedule.scheduleId,
          isAvailable: schedule.isAvailable,
          hasSpecificSchedule: schedule.scheduleId > 0
        }
      })
      
      console.log('DEBUG: Mapped consultants:', consultantsFromResponse)
      
      // Remove duplicates based on consultantId (in case same consultant has multiple slots)
      const uniqueConsultants = consultantsFromResponse.filter((consultant, index, self) => 
        index === self.findIndex(c => c.consultantId === consultant.consultantId)
      )
      
      console.log('DEBUG: Unique consultants:', uniqueConsultants)
      console.log('DEBUG: Setting availableConsultants to:', uniqueConsultants)
      setAvailableConsultants(uniqueConsultants)
      
      // Extract booked time slots for each consultant (if they have specific schedules)
      const bookedSlots: {[key: string]: string[]} = {}
      schedules.forEach(schedule => {
        if (schedule.scheduleId > 0) { // Real schedule means this time is booked
          const consultantId = schedule.consultantId.toString()
          if (!bookedSlots[consultantId]) {
            bookedSlots[consultantId] = []
          }
          const timeStr = new Date(schedule.startTime).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })
          bookedSlots[consultantId].push(timeStr)
        }
      })
      setBookedTimeSlots(bookedSlots)
      
    } catch (err) {
      setError('Không thể tải lịch trống. Vui lòng thử lại.')
      console.error('Failed to fetch available schedules:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Check if a time slot is booked for a specific consultant
  const checkIfTimeSlotBooked = (timeSlot: string, consultantId: number | null): boolean => {
    if (!consultantId) return false
    const bookedTimes = bookedTimeSlots[consultantId.toString()] || []
    return bookedTimes.includes(timeSlot)
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedConsultant) {
      setError('Vui lòng chọn đầy đủ thông tin')
      return
    }

    if (isFlexibleTime && !customTime) {
      setError('Vui lòng chọn thời gian tư vấn')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Use custom time for flexible appointments, otherwise use selected time
      const appointmentTime = isFlexibleTime ? customTime : selectedTime
      console.log('DEBUG: Booking appointment with:', {
        selectedDate,
        appointmentTime,
        isFlexibleTime,
        customTime,
        selectedTime,
        selectedConsultant,
        notes
      })
      
      const startTime = new Date(`${selectedDate}T${appointmentTime}:00`)
      const endTime = new Date(startTime)
      endTime.setHours(endTime.getHours() + 1) // 1 hour appointment

      console.log('DEBUG: Calculated times:', {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      })

      const appointmentData: CreateAppointmentRequest = {
        preferredStartTime: startTime.toISOString(),
        preferredEndTime: endTime.toISOString(),
        notes: notes,
        preferredConsultantId: selectedConsultant
      }
      
      console.log('DEBUG: Final appointment data:', appointmentData)

      await createAppointment(appointmentData)
      setIsBookingSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Không thể đặt lịch hẹn. Vui lòng thử lại.')
      console.error('Failed to book appointment:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            currentStep >= step 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? 'bg-primary' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderDateSelection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-primary font-semibold text-text-dark text-center">
        Chọn ngày tư vấn
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableDates.map((dateOption) => {
          const isToday = dateOption.date === new Date().toISOString().split('T')[0]
          const isTomorrow = dateOption.date === new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          
          return (
            <button
              key={dateOption.date}
              onClick={() => setSelectedDate(dateOption.date)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                selectedDate === dateOption.date
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-gray-200 hover:border-primary hover:bg-primary-50'
              }`}
            >
              <div className="text-sm font-medium">{dateOption.display}</div>
              {isToday && (
                <div className="text-xs text-gray-500 mt-1">Hôm nay</div>
              )}
              {isTomorrow && (
                <div className="text-xs text-gray-500 mt-1">Ngày mai</div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep(2)}
          disabled={!selectedDate}
          className="bg-primary text-white px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  )

  const renderConsultantSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-primary font-semibold text-text-dark">
          Chọn bác sĩ và giờ tư vấn
        </h3>
        <p className="text-sm text-gray-600">
          Ngày: {new Date(selectedDate).toLocaleDateString('vi-VN')}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải lịch trống...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {availableConsultants.length > 0 && availableConsultants.every(c => c.scheduleId === 0) && (
            <div className="text-center">
              <CalendarIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-green-600 font-medium">Tất cả khung giờ đều trống!</p>
              <p className="text-gray-600 text-sm mt-2">Chọn bác sĩ tư vấn và khung giờ phù hợp</p>
            </div>
          )}

          {/* Consultant Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-dark">Chọn bác sĩ tư vấn</h3>
            <div className="text-xs text-gray-500 mb-2">
              DEBUG: availableConsultants.length = {availableConsultants.length}
            </div>
            {availableConsultants.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Không có bác sĩ tư vấn nào. Đang tải...
                <div className="text-xs mt-2">
                  DEBUG: availableConsultants = {JSON.stringify(availableConsultants)}
                </div>
              </div>
            ) : (
              <>
                {console.log('DEBUG: Rendering consultants:', availableConsultants)}
                {availableConsultants.map((consultant) => (
                <div 
                  key={consultant.consultantId} 
                  onClick={() => setSelectedConsultant(consultant.consultantId)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedConsultant === consultant.consultantId
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-200 hover:border-primary hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-text-dark">
                          {consultant.consultantName || 'Bác sĩ'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {consultant.specialization}
                        </p>
                        <p className="text-xs text-gray-500">
                          {consultant.experience}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedConsultant === consultant.consultantId
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedConsultant === consultant.consultantId ? 'Đã chọn' : 'Chọn'}
                    </div>
                  </div>
                </div>
                ))}
              </>
            )}
          </div>

          {/* Time Selection - Only show when consultant is selected */}
          {selectedConsultant && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-3">Chọn khung giờ tư vấn (mỗi khung 1 tiếng)</h4>
              
              {/* Morning Session */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-green-700 mb-2">Buổi sáng (8:00 - 11:00)</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { time: '08:00', label: '8:00 - 9:00' },
                    { time: '09:00', label: '9:00 - 10:00' },
                    { time: '10:00', label: '10:00 - 11:00' }
                  ].map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => {
                        setCustomTime(slot.time)
                        setSelectedTime(slot.time)
                        setIsFlexibleTime(false)
                      }}
                      className={`p-3 text-sm rounded border transition-all ${
                        customTime === slot.time
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-green-200 hover:border-green-400 hover:bg-green-100'
                      }`}
                    >
                      <div className="font-medium">{slot.label}</div>
                      <div className="text-xs mt-1 opacity-75">Trống</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon Session */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-green-700 mb-2">Buổi chiều (13:00 - 16:00)</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { time: '13:00', label: '13:00 - 14:00' },
                    { time: '14:00', label: '14:00 - 15:00' },
                    { time: '15:00', label: '15:00 - 16:00' }
                  ].map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => {
                        setCustomTime(slot.time)
                        setSelectedTime(slot.time)
                        setIsFlexibleTime(false)
                      }}
                      className={`p-3 text-sm rounded border transition-all ${
                        customTime === slot.time
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-green-200 hover:border-green-400 hover:bg-green-100'
                      }`}
                    >
                      <div className="font-medium">{slot.label}</div>
                      <div className="text-xs mt-1 opacity-75">Trống</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-green-600 mt-2">
                * Tất cả khung giờ đều có sẵn. Chọn khung giờ phù hợp với bạn.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Time Selection for Flexible Consultants - Only show when consultant has flexible schedule */}
      {isFlexibleTime && selectedConsultant && availableSchedules.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-3">Chọn khung giờ tư vấn (mỗi khung 1 tiếng)</h4>
          
          {/* Morning Session: 8h - 11h */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-blue-700 mb-2">Buổi sáng (8:00 - 11:00)</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { time: '08:00', label: '8:00 - 9:00', endTime: '09:00' },
                { time: '09:00', label: '9:00 - 10:00', endTime: '10:00' },
                { time: '10:00', label: '10:00 - 11:00', endTime: '11:00' }
              ].map((slot) => {
                const isBooked = checkIfTimeSlotBooked(slot.time, selectedConsultant)
                return (
                  <button
                    key={slot.time}
                    onClick={() => !isBooked && setCustomTime(slot.time)}
                    disabled={isBooked}
                    className={`p-3 text-sm rounded border transition-all ${
                      customTime === slot.time
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : isBooked
                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        : 'border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                    }`}
                  >
                    <div className="font-medium">{slot.label}</div>
                    {isBooked && <div className="text-xs mt-1">Đã đặt</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Afternoon Session: 13h - 16h */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-blue-700 mb-2">Buổi chiều (13:00 - 16:00)</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { time: '13:00', label: '13:00 - 14:00', endTime: '14:00' },
                { time: '14:00', label: '14:00 - 15:00', endTime: '15:00' },
                { time: '15:00', label: '15:00 - 16:00', endTime: '16:00' }
              ].map((slot) => {
                const isBooked = checkIfTimeSlotBooked(slot.time, selectedConsultant)
                return (
                  <button
                    key={slot.time}
                    onClick={() => !isBooked && setCustomTime(slot.time)}
                    disabled={isBooked}
                    className={`p-3 text-sm rounded border transition-all ${
                      customTime === slot.time
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : isBooked
                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        : 'border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                    }`}
                  >
                    <div className="font-medium">{slot.label}</div>
                    {isBooked && <div className="text-xs mt-1">Đã đặt</div>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="text-xs text-blue-600 mt-2">
            * Mỗi buổi tư vấn kéo dài 1 tiếng. Các khung giờ đã được đặt sẽ bị làm mờ.
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-secondary font-bold hover:bg-gray-600 transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={!selectedTime || !selectedConsultant || (isFlexibleTime && !customTime)}
          className="bg-primary text-white px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  )

  const renderConfirmation = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-primary font-semibold text-text-dark text-center">
        Xác nhận thông tin đặt lịch
      </h3>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="font-medium">Ngày tư vấn</p>
            <p className="text-gray-600">{new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="font-medium">Thời gian</p>
            <p className="text-gray-600">
              {isFlexibleTime ? (customTime || 'Chưa chọn') : selectedTime}
              {isFlexibleTime && <span className="text-blue-600 text-sm ml-2">(Linh hoạt)</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="font-medium">Bác sĩ tư vấn</p>
            <p className="text-gray-600">
              {availableSchedules.find(c => c.consultantId === selectedConsultant)?.consultantName}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="font-medium">Hình thức</p>
            <p className="text-gray-600">Tư vấn trực tuyến</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ghi chú (tùy chọn)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Mô tả triệu chứng hoặc vấn đề cần tư vấn..."
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-secondary font-bold hover:bg-gray-600 transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={handleBookAppointment}
          disabled={isLoading}
          className="bg-primary text-white px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
        </button>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-2xl font-primary font-semibold text-text-dark">
        Đặt lịch thành công!
      </h3>
      <p className="text-gray-600">
        Cuộc hẹn tư vấn của bạn đã được đặt thành công. Bác sĩ sẽ xác nhận và gửi link meeting cho bạn sớm nhất.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Lưu ý:</strong> Vui lòng kiểm tra email và thông báo để nhận link meeting từ bác sĩ.
        </p>
      </div>
      <button
        onClick={onBack}
        className="bg-primary text-white px-8 py-3 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
      >
        Quay về Dashboard
      </button>
    </div>
  )

  if (isBookingSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        {renderSuccess()}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-primary font-semibold text-text-dark">
            Đặt Cuộc Hẹn Tư Vấn Online
          </h2>
        </div>

        {renderStepIndicator()}

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

        {currentStep === 1 && renderDateSelection()}
        {currentStep === 2 && renderConsultantSelection()}
        {currentStep === 3 && renderConfirmation()}
      </div>
    </div>
  )
}

export default AppointmentBooking