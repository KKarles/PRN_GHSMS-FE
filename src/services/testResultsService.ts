import api from './api'

// Types for test results
export interface TestResultDetail {
  analyteName: string
  result: string
  referenceRange: string
  status: 'Normal' | 'Abnormal' | 'Borderline'
  notes?: string
}

export interface TestResult {
  id: number
  bookingId: number
  serviceName: string
  testDate: string
  status: 'Pending' | 'Processing' | 'Ready'
  results: TestResultDetail[]
  downloadUrl?: string
}

export interface TestBooking {
  id: number
  serviceId: number
  serviceName: string
  appointmentTime: string
  bookingStatus: 'Booked' | 'SampleCollected' | 'Processing' | 'ResultReady'
  isPaid: boolean
  price: number
  createdAt: string
}

// Test results service functions
export const getMyTestResults = async (): Promise<TestResult[]> => {
  try {
    const response = await api.get('/api/testbooking/my-results')
    return response.data
  } catch (error) {
    console.error('Failed to fetch test results:', error)
    throw error
  }
}

export const getMyBookings = async (): Promise<TestBooking[]> => {
  try {
    const response = await api.get('/api/testbooking/my-bookings')
    return response.data
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