import React, { useState, useEffect } from 'react'
import {
  XMarkIcon,
  BeakerIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import staffService, { 
  type StaffBooking, 
  type ServiceWithAnalytes, 
  type Analyte, 
  type TestResultDetail,
  type TestResultSubmission 
} from '../services/staffService'

interface ResultEntryModalProps {
  booking: StaffBooking
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface AnalyteResult {
  analyteId: number
  analyteName: string
  result: string
  unit: string
  referenceRange: string
  isNormal: boolean
}

const ResultEntryModal: React.FC<ResultEntryModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [serviceDetails, setServiceDetails] = useState<ServiceWithAnalytes | null>(null)
  const [analyteResults, setAnalyteResults] = useState<AnalyteResult[]>([])
  const [generalNotes, setGeneralNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && booking.serviceId) {
      fetchServiceDetails()
    }
  }, [isOpen, booking.serviceId])

  const fetchServiceDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const details = await staffService.getServiceDetails(booking.serviceId!)
      console.log('Service details response:', details) // Debug log
      
      setServiceDetails(details)
      
      // Handle different response structures
      const analytes = details.analytes || details.data?.analytes || []
      
      if (!Array.isArray(analytes) || analytes.length === 0) {
        setError('Dịch vụ này không có analytes để nhập kết quả.')
        return
      }
      
      // Initialize analyte results with default values
      const initialResults = analytes.map((analyte: Analyte) => ({
        analyteId: analyte.analyteId,
        analyteName: analyte.analyteName,
        result: '',
        unit: analyte.defaultUnit || '',
        referenceRange: analyte.defaultReferenceRange || '',
        isNormal: true
      }))
      
      setAnalyteResults(initialResults)
      
    } catch (error) {
      console.error('Failed to fetch service details:', error)
      setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateAnalyteResult = (analyteId: number, field: keyof AnalyteResult, value: string | boolean) => {
    setAnalyteResults(prev => prev.map(result => 
      result.analyteId === analyteId 
        ? { ...result, [field]: value }
        : result
    ))
  }

  const validateForm = (): boolean => {
    // Check if all analytes have results
    for (const result of analyteResults) {
      if (!result.result.trim()) {
        setError(`Vui lòng nhập kết quả cho "${result.analyteName}"`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const resultDetails: TestResultDetail[] = analyteResults.map(result => ({
        analyteName: result.analyteName,
        value: result.result,
        unit: result.unit || null,
        referenceRange: result.referenceRange,
        flag: result.isNormal ? "Normal" : "Abnormal"
      }))

      const submissionData: TestResultSubmission = {
        bookingId: parseInt(booking.bookingId),
        resultDetails,
        notes: generalNotes.trim() || undefined
      }

      await staffService.submitTestResults(submissionData)
      
      // Don't update status here - the API should handle it automatically
      // The test result submission should update the status to ResultReady
      
      onSuccess()
      onClose()
      
    } catch (error) {
      console.error('Failed to submit test results:', error)
      setError('Không thể lưu kết quả. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-primary font-semibold text-text-dark">
                Nhập Kết quả cho Booking #{booking.bookingId}
              </h2>
              <p className="font-secondary text-gray-600 mt-1">
                Dịch vụ: {booking.serviceName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-secondary">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600 font-secondary">Đang tải thông tin dịch vụ...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Form */}
              <div className="space-y-6 mb-6">
                {analyteResults.map((result) => (
                  <div key={result.analyteId} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-primary font-semibold text-text-dark mb-4">
                      {result.analyteName}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Result */}
                      <div>
                        <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                          Kết quả *
                        </label>
                        <input
                          type="text"
                          value={result.result}
                          onChange={(e) => updateAnalyteResult(result.analyteId, 'result', e.target.value)}
                          placeholder="e.g., Non-Reactive, 1.25, Detected"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Unit */}
                      <div>
                        <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                          Đơn vị (Unit)
                        </label>
                        <input
                          type="text"
                          value={result.unit}
                          onChange={(e) => updateAnalyteResult(result.analyteId, 'unit', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      {/* Reference Range */}
                      <div>
                        <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                          Khoảng tham chiếu
                        </label>
                        <input
                          type="text"
                          value={result.referenceRange}
                          onChange={(e) => updateAnalyteResult(result.analyteId, 'referenceRange', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      {/* Is Normal */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`normal-${result.analyteId}`}
                          checked={result.isNormal}
                          onChange={(e) => updateAnalyteResult(result.analyteId, 'isNormal', e.target.checked)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={`normal-${result.analyteId}`}
                          className="ml-2 font-secondary text-gray-700 text-sm font-medium"
                        >
                          Kết quả bình thường (Is Normal)
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* General Notes */}
              <div className="mb-6">
                <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                  Ghi chú chung (Tùy chọn)
                </label>
                <textarea
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="Thêm ghi chú tổng quan về kết quả nếu cần..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-secondary font-bold hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Lưu và Gửi Kết Quả
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultEntryModal