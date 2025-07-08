import api from './api'

// Types for services
export interface Service {
  id: number
  name: string
  description: string
  price: number
  estimatedDuration: string
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
    const response = await api.get('/api/servicecatalog/services')
    return response.data
  } catch (error) {
    console.error('Failed to fetch services:', error)
    throw error
  }
}

export const getService = async (serviceId: number): Promise<Service> => {
  try {
    const response = await api.get(`/api/servicecatalog/services/${serviceId}`)
    return response.data
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
    const response = await api.post('/api/testbooking/book', bookingData)
    return response.data
  } catch (error) {
    console.error('Failed to book service:', error)
    throw error
  }
}