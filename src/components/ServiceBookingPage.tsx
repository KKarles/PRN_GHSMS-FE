import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline'
import { getServices, createBooking, type Service } from '../services/serviceService'
import { useAuth } from '../contexts/AuthContext'

interface TimeSlot {
  time: string
  available: boolean
}

const ServiceBookingPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock time slots - in real app, this would come from API
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: false },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const servicesData = await getServices()
      setServices(servicesData)
    } catch (err) {
      setError('Không thể tải danh sách dịch vụ')
      console.error('Failed to fetch services:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('') // Reset time when date changes
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Vui lòng hoàn tất tất cả các bước')
      return
    }

    try {
      setIsLoading(true)
      const appointmentDateTime = `${selectedDate}T${selectedTime}:00`
      
      await createBooking({
        serviceId: selectedService.serviceId,
        appointmentTime: appointmentDateTime,
        notes: ''
      })

      // Navigate to success page or dashboard
      navigate('/dashboard?booking=success')
    } catch (err) {
      setError('Không thể đặt lịch hẹn. Vui lòng thử lại.')
      console.error('Booking failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1: return !!selectedService
      case 2: return !!selectedDate && !!selectedTime
      case 3: return true
      default: return false
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedService
      case 2: return !!selectedDate && !!selectedTime
      case 3: return true
      default: return false
    }
  }

  // Generate next 30 days for date picker
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      // Skip weekends for this example
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    return dates
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-background-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-primary hover:text-primary-600 mb-4"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              Quay lại Dashboard
            </button>
            <h1 className="text-3xl font-primary font-semibold text-text-dark">
              Đặt Lịch Hẹn Mới
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step Indicator */}
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-border-subtle">
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-primary font-bold
                        ${currentStep >= step 
                          ? 'bg-primary text-text-light' 
                          : 'bg-gray-200 text-gray-500'
                        }
                      `}>
                        {isStepComplete(step) && currentStep > step ? (
                          <CheckIcon className="h-5 w-5" />
                        ) : (
                          step
                        )}
                      </div>
                      <span className={`
                        ml-3 font-secondary
                        ${currentStep >= step ? 'text-text-dark' : 'text-gray-500'}
                      `}>
                        {step === 1 && 'Chọn dịch vụ'}
                        {step === 2 && 'Chọn thời gian'}
                        {step === 3 && 'Xác nhận'}
                      </span>
                      {step < 3 && (
                        <ChevronRightIcon className="h-5 w-5 mx-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                {/* Step 1: Select Service */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
                      Chọn một dịch vụ
                    </h3>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-gray-600">Đang tải dịch vụ...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {services.map((service) => (
                          <div
                            key={service.serviceId}
                            className={`
                              border-2 rounded-xl p-4 cursor-pointer transition-all
                              ${selectedService?.serviceId === service.serviceId
                                ? 'border-primary bg-primary-light'
                                : 'border-border-subtle hover:border-primary'
                              }
                            `}
                            onClick={() => handleServiceSelect(service)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-primary font-semibold text-text-dark mb-2">
                                  {service.serviceName}
                                </h4>
                                <p className="font-secondary text-gray-600 mb-2">
                                  {service.description}
                                </p>
                                <p className="font-secondary text-sm text-gray-500">
                                  Thời gian: {service.estimatedDuration} phút
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-primary font-bold text-primary">
                                  {service.price.toLocaleString('vi-VN')} VNĐ
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Select Date & Time */}
                {currentStep === 2 && (
                  <div>
                    <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
                      Chọn ngày và giờ
                    </h3>
                    
                    {/* Date Selection */}
                    <div className="mb-8">
                      <h4 className="font-primary font-semibold text-text-dark mb-4">
                        Chọn ngày
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {generateAvailableDates().slice(0, 12).map((date) => (
                          <button
                            key={date}
                            onClick={() => handleDateSelect(date)}
                            className={`
                              p-3 rounded-lg border-2 text-left transition-all
                              ${selectedDate === date
                                ? 'border-primary bg-primary-light text-primary'
                                : 'border-border-subtle hover:border-primary'
                              }
                            `}
                          >
                            <div className="font-secondary text-sm">
                              {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                            </div>
                            <div className="font-primary font-semibold">
                              {new Date(date).getDate()}/{new Date(date).getMonth() + 1}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <h4 className="font-primary font-semibold text-text-dark mb-4">
                          Chọn giờ
                        </h4>
                        <div className="grid grid-cols-4 gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => slot.available && handleTimeSelect(slot.time)}
                              disabled={!slot.available}
                              className={`
                                p-3 rounded-lg border-2 font-secondary transition-all
                                ${!slot.available
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : selectedTime === slot.time
                                    ? 'border-primary bg-primary-light text-primary'
                                    : 'border-border-subtle hover:border-primary'
                                }
                              `}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <div>
                    <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
                      Xác nhận thông tin đặt hẹn
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-primary font-semibold text-text-dark mb-2">
                          Thông tin khách hàng
                        </h4>
                        <p className="font-secondary text-gray-600">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="font-secondary text-gray-600">
                          {user?.email}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-primary font-semibold text-text-dark mb-2">
                          Chi tiết đặt hẹn
                        </h4>
                        <p className="font-secondary text-gray-600">
                          <strong>Dịch vụ:</strong> {selectedService?.serviceName}
                        </p>
                        <p className="font-secondary text-gray-600">
                          <strong>Ngày:</strong> {selectedDate && formatDate(selectedDate)}
                        </p>
                        <p className="font-secondary text-gray-600">
                          <strong>Giờ:</strong> {selectedTime}
                        </p>
                        <p className="font-secondary text-gray-600">
                          <strong>Chi phí:</strong> {selectedService?.price.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="font-secondary text-yellow-800">
                          <strong>Lưu ý:</strong> Thanh toán sẽ được thực hiện trực tiếp tại cơ sở của chúng tôi. 
                          Vui lòng đến đúng giờ hẹn.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className={`
                      px-6 py-3 rounded-full font-secondary font-bold transition-colors
                      ${currentStep === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }
                    `}
                  >
                    Quay lại
                  </button>

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      disabled={!canProceed()}
                      className={`
                        px-6 py-3 rounded-full font-secondary font-bold transition-colors
                        ${canProceed()
                          ? 'bg-primary text-text-light hover:bg-primary-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      Tiếp tục
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmBooking}
                      disabled={isLoading}
                      className="bg-primary text-text-light px-8 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Đang xử lý...' : 'Xác Nhận Đặt Hẹn'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle sticky top-8">
                <h3 className="text-xl font-primary font-semibold text-text-dark mb-4">
                  Tóm Tắt Đặt Hẹn
                </h3>
                <div className="border-t border-border-subtle pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-secondary text-gray-600 text-sm">Dịch vụ đã chọn</p>
                      <p className="font-primary font-semibold text-text-dark">
                        {selectedService?.serviceName || 'Chưa chọn'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-secondary text-gray-600 text-sm">Thời gian hẹn</p>
                      <p className="font-primary font-semibold text-text-dark">
                        {selectedDate && selectedTime 
                          ? `${formatDate(selectedDate)} lúc ${selectedTime}`
                          : 'Chưa chọn'
                        }
                      </p>
                    </div>
                    
                    <div className="border-t border-border-subtle pt-3">
                      <p className="font-secondary text-gray-600 text-sm">Tổng chi phí</p>
                      <p className="text-2xl font-primary font-bold text-primary">
                        {selectedService?.price.toLocaleString('vi-VN') || '0'} VNĐ
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <p className="font-secondary text-gray-600 text-sm">
                      <strong>Lưu ý:</strong> Thanh toán sẽ được thực hiện trực tiếp tại cơ sở của chúng tôi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceBookingPage