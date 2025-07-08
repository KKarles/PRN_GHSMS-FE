import api from './api'

// Types for services
export interface Service {
  serviceId: number
  serviceName: string
  description: string
  price: number
  estimatedDuration: number
  analytes: string[]
  category: string
  isActive: boolean
}

export interface ServiceBookingRequest {
  serviceId: number
  appointmentTime: string
  notes?: string
}

export interface AvailableTimeSlot {
  date: string
  timeSlots: string[]
}

// Service catalog functions
export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get('/api/ServiceCatalog')
    // The API returns a wrapped response with success, message, and data
    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch services')
    }
  } catch (error) {
    console.error('Failed to fetch services:', error)
    throw error
  }
}

export const getService = async (serviceId: number): Promise<Service> => {
  try {
    const response = await api.get(`/api/ServiceCatalog/${serviceId}`)
    // The API returns a wrapped response with success, message, and data
    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch service')
    }
  } catch (error) {
    console.error('Failed to fetch service:', error)
    throw error
  }
}

export const getAvailableTimeSlots = async (serviceId: number, startDate: string, endDate: string): Promise<AvailableTimeSlot[]> => {
  try {
    const response = await api.get(`/api/servicecatalog/services/${serviceId}/availability?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch available time slots:', error)
    throw error
  }
}

export const bookService = async (bookingData: ServiceBookingRequest): Promise<any> => {
  try {
    const response = await api.post('/api/testbooking', bookingData)
    // Handle wrapped API response if needed
    if (response.data.success !== undefined) {
      if (response.data.success) {
        return response.data.data || response.data
      } else {
        throw new Error(response.data.message || 'Failed to book service')
      }
    }
    return response.data
  } catch (error) {
    console.error('Failed to book service:', error)
    throw error
  }
}

// Alias for createBooking to match component usage
export const createBooking = bookService