import api from './api'

// Types for test results (matching actual API response)
export interface TestResultDetail {
  analyteName: string
  value: string  // API uses 'value' not 'result'
  unit: string | null
  referenceRange: string
  flag: 'Normal' | 'Abnormal' | 'Borderline'  // API uses 'flag' not 'status'
}

export interface TestResult {
  resultId: number  // API uses 'resultId' not 'id'
  bookingId: number
  customerName: string
  serviceName: string
  notes: string
  issuedByName: string
  issuedAt: string  // API uses 'issuedAt' not 'testDate'
  resultDetails: TestResultDetail[]  // API uses 'resultDetails' not 'results'
}

export interface TestBooking {
  bookingId: number  // API uses 'bookingId' not 'id'
  customerId: number
  customerName: string
  serviceId: number
  serviceName: string
  servicePrice: number  // API includes price
  appointmentTime: string
  bookingStatus: 'Booked' | 'SampleCollected' | 'Processing' | 'ResultReady'
  isPaid: boolean
  bookedAt: string  // API uses 'bookedAt' not 'createdAt'
  resultDate: string | null
}

// API Response wrapper types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Test results service functions
export const getMyTestResults = async (): Promise<TestResult[]> => {
  try {
    const response = await api.get<ApiResponse<TestResult[]>>('/api/testresult/my-results')
    
    // Handle the wrapped API response format
    if (response.data.success) {
      return response.data.data  // Extract the actual data array
    } else {
      throw new Error(response.data.message || 'Failed to fetch test results')
    }
  } catch (error) {
    console.error('Failed to fetch test results:', error)
    throw error
  }
}

export const getMyBookings = async (): Promise<TestBooking[]> => {
  try {
    const response = await api.get<ApiResponse<TestBooking[]>>('/api/testbooking/my-bookings')
    
    // Handle the wrapped API response format
    if (response.data.success) {
      return response.data.data  // Extract the actual data array
    } else {
      throw new Error(response.data.message || 'Failed to fetch bookings')
    }
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    throw error
  }
}

export const getTestResult = async (resultId: number): Promise<TestResult> => {
  try {
    const response = await api.get(`/api/testbooking/results/${resultId}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch test result:', error)
    throw error
  }
}

export const downloadTestResult = async (resultId: number): Promise<Blob> => {
  try {
    const response = await api.get(`/api/testbooking/results/${resultId}/download`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    console.error('Failed to download test result:', error)
    throw error
  }
}

// Add cancelBooking function
export const cancelBooking = async (bookingId: number): Promise<void> => {
  try {
    await api.delete(`/api/testbooking/${bookingId}`)
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    throw error
  }
}