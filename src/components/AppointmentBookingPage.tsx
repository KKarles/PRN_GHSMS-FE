import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { createAppointment, getAvailableSchedules, type ConsultantSchedule, type CreateAppointmentRequest } from '../services/appointmentService'
import { useAuth } from '../contexts/AuthContext'

const AppointmentBookingPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultantSchedule | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null)
  const [notes, setNotes] = useState<string>('')
  const [availableSchedules, setAvailableSchedules] = useState<ConsultantSchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate next 14 days for date selection
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('vi-VN', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      })
    }
    return dates
  }

  const availableDates = generateDates()

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
      console.log(selectedDate, endDate)
      setAvailableSchedules(schedules)
    } catch (err) {
      setError('Không thể tải lịch trống')
      console.error('Failed to fetch available schedules:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedConsultant(null)
    setSelectedTimeSlot(null)
    setCurrentStep(2)
  }

  const handleConsultantSelect = (consultant: ConsultantSchedule, timeSlot: any) => {
    setSelectedConsultant(consultant)
    setSelectedTimeSlot(timeSlot)
    setCurrentStep(3)
  }

  const handleBookAppointment = async () => {
    if (!selectedTimeSlot || !selectedConsultant) return

    try {
      setIsLoading(true)
      const appointmentData: CreateAppointmentRequest = {
        preferredStartTime: selectedTimeSlot.startTime,
        preferredEndTime: selectedTimeSlot.endTime,
        notes: notes.trim() || undefined,
        preferredConsultantId: selectedConsultant.consultantId
      }

      await createAppointment(appointmentData)
      navigate('/dashboard?appointment=success')
    } catch (err) {
      setError('Không thể đặt lịch hẹn. Vui lòng thử lại.')
      console.error('Failed to book appointment:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step 
              ? 'bg-primary border-primary text-white' 
              : 'border-gray-300 text-gray-400'
          }`}>
            {currentStep > step ? (
              <CheckIcon className="w-6 h-6" />
            ) : (
              <span className="font-semibold">{step}</span>
            )}
          </div>
          {step < 3 && (
            <div className={`w-16 h-0.5 mx-2 ${
              currentStep > step ? 'bg-primary' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderDateSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-primary font-semibold text-text-dark mb-2">
          Chọn ngày tư vấn
        </h2>
        <p className="font-secondary text-gray-600">
          Vui lòng chọn ngày bạn muốn đặt lịch tư vấn trực tuyến
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableDates.map((dateItem) => (
          <button
            key={dateItem.date}
            onClick={() => handleDateSelect(dateItem.date)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="font-secondary font-semibold text-text-dark">
              {dateItem.display}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderConsultantSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-primary font-semibold text-text-dark mb-2">
          Chọn chuyên gia và giờ tư vấn
        </h2>
        <p className="font-secondary text-gray-600">
          Ngày đã chọn: {new Date(selectedDate).toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-secondary text-gray-600">Đang tải lịch trống...</p>
        </div>
      ) : availableSchedules.length === 0 ? (
        <div className="text-center py-8">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-primary font-semibold text-text-dark mb-2">
            Không có lịch trống
          </h3>
          <p className="font-secondary text-gray-600 mb-4">
            Không có chuyên gia nào có lịch trống trong ngày này
          </p>
          <button
            onClick={() => setCurrentStep(1)}
            className="bg-primary text-white px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
          >
            Chọn ngày khác
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {availableSchedules.map((consultant) => (
            <div key={consultant.consultantId} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-primary font-semibold text-text-dark">
                      {consultant.consultantName}
                    </h3>
                    <p className="font-secondary text-gray-600 text-sm">
                      Chuyên khoa: {consultant.specialization}
                    </p>
                    <p className="font-secondary text-gray-500 text-sm">
                      Kinh nghiệm: {consultant.experience}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {consultant.availableSlots.map((slot) => (
                  <button
                    key={slot.scheduleId}
                    onClick={() => handleConsultantSelect(consultant, slot)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
                  >
                    <ClockIcon className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="font-secondary text-sm font-semibold text-text-dark">
                      {new Date(slot.startTime).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(slot.endTime).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-secondary font-bold hover:bg-gray-200 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Quay lại</span>
        </button>
      </div>
    </div>
  )

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-primary font-semibold text-text-dark mb-2">
          Xác nhận đặt lịch
        </h2>
        <p className="font-secondary text-gray-600">
          Vui lòng kiểm tra thông tin và xác nhận đặt lịch tư vấn
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-primary font-semibold text-text-dark mb-2">Thông tin cuộc hẹn</h3>
            <div className="space-y-2 font-secondary text-sm">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span>
                  {new Date(selectedDate).toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-primary" />
                <span>
                  {selectedTimeSlot && new Date(selectedTimeSlot.startTime).toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} - {selectedTimeSlot && new Date(selectedTimeSlot.endTime).toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-primary font-semibold text-text-dark mb-2">Chuyên gia tư vấn</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-secondary font-semibold text-text-dark">
                  {selectedConsultant?.consultantName}
                </div>
                <div className="font-secondary text-gray-600 text-sm">
                  {selectedConsultant?.specialization}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block font-primary font-semibold text-text-dark mb-2">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Mô tả vấn đề cần tư vấn hoặc câu hỏi..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-secondary focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={4}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-secondary text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-secondary font-bold hover:bg-gray-200 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Quay lại</span>
        </button>
        <button
          onClick={handleBookAppointment}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang đặt lịch...</span>
            </>
          ) : (
            <>
              <CheckIcon className="w-5 h-5" />
              <span>Xác nhận đặt lịch</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-primary font-bold text-text-dark mb-4">
            Đặt lịch tư vấn trực tuyến
          </h1>
          <p className="font-secondary text-gray-600 max-w-2xl mx-auto">
            Đặt lịch tư vấn với các chuyên gia sức khỏe phụ khoa của chúng tôi. 
            Cuộc tư vấn sẽ được thực hiện trực tuyến qua video call.
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {currentStep === 1 && renderDateSelection()}
          {currentStep === 2 && renderConsultantSelection()}
          {currentStep === 3 && renderConfirmation()}
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="font-secondary text-primary hover:text-primary-600 transition-colors"
          >
            ← Quay lại Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentBookingPage