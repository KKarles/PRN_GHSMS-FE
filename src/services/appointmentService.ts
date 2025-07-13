import api from './api'

// Types for appointments
export interface Appointment {
  appointmentId: number
  customerId: number
  customerName: string
  customerEmail: string
  consultantId: number
  consultantName: string
  consultantSpecialization: string
  scheduleId: number
  startTime: string
  endTime: string
  appointmentStatus: 'Scheduled' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  meetingUrl?: string
  notes?: string
  createdAt: string
}

export interface CreateAppointmentRequest {
  preferredStartTime: string
  preferredEndTime: string
  notes?: string
  preferredConsultantId?: number
}

export interface ConsultantSchedule {
  consultantId: number
  consultantName: string
  consultantSpecialization: string
  consultantExperience: string
  scheduleId: number
  startTime: string
  endTime: string
  isAvailable: boolean
  availableSlots?: AvailableSlot[] // For backward compatibility
  hasSpecificSchedule?: boolean // true if has real schedule, false if general availability
}

export interface AvailableSlot {
  scheduleId: number
  startTime: string
  endTime: string
  date: string
  isAvailable?: boolean
}

export interface AppointmentStats {
  totalAppointments: number
  pendingAppointments: number
  completedAppointments: number
  appointmentsByConsultant: Record<string, number>
}

// Appointment functions
export const createAppointment = async (appointmentData: CreateAppointmentRequest): Promise<Appointment> => {
  try {
    console.log('DEBUG: Creating appointment with data:', appointmentData)
    console.log('DEBUG: Appointment data JSON:', JSON.stringify(appointmentData, null, 2))
    
    const response = await api.post('/api/appointment', appointmentData)
    console.log('DEBUG: Create appointment response:', response)
    
    if (response.data.success || response.data.isSuccess) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to create appointment')
    }
  } catch (error) {
    console.error('DEBUG: Failed to create appointment:', error)
    throw error
  }
}

export const getUserAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get('/api/appointment/my-appointments')
    console.log(response)
    if (response.data.isSuccess) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch appointments')
    }
  } catch (error) {
    console.error('Failed to fetch appointments:', error)
    throw error
  }
}

export const getConsultantAppointments = async (consultantId: number, startDate: string, endDate: string): Promise<Appointment[]> => {
  try {
    console.log('DEBUG: Getting consultant schedules for:', { consultantId, startDate, endDate })
    // Try different endpoints based on available backend APIs
    
    // Option 1: Try the specific consultant endpoint (if it exists)
    try {
      const response = await api.get(`/api/appointment/${consultantId}?startDate=${startDate}&endDate=${endDate}`)
      console.log('DEBUG: Consultant schedules response:', response.data)
      
      if (response.data.success || response.data.isSuccess) {
        return response.data.data || []
      }
    } catch (error) {
      console.log('DEBUG: Consultant specific endpoint failed, trying status endpoint')
    }
    
    // Option 2: Try getting all appointments by status (for consultant role)
    const response = await api.get('/api/appointment/status/all')
    console.log('DEBUG: Appointments by status response:', response.data)
    
    if (response.data.success || response.data.isSuccess) {
      // Filter appointments for this consultant if needed
      const appointments = response.data.data || []
      return appointments.filter((apt: any) => apt.consultantId === consultantId)
    } else {
      throw new Error(response.data.message || 'Failed to fetch consultant appointments')
    }
  } catch (error) {
    console.error('Failed to fetch consultant appointments:', error)
    throw error
  }
}

// Alternative function to get appointments by status
export const getAppointmentsByStatus = async (status: string): Promise<Appointment[]> => {
  try {
    console.log('DEBUG: Getting appointments by status:', status)
    const response = await api.get(`/api/appointment/status/${status}`)
    console.log('DEBUG: Appointments by status response:', response.data)
    
    if (response.data.success || response.data.isSuccess) {
      return response.data.data || []
    } else {
      throw new Error(response.data.message || 'Failed to fetch appointments by status')
    }
  } catch (error) {
    console.error('Failed to fetch appointments by status:', error)
    throw error
  }
}

export const getAvailableSchedules = async (startDate: string, endDate: string): Promise<ConsultantSchedule[]> => {
  try {
    console.log('DEBUG: API call with dates:', startDate, 'to', endDate)
    const url = `/api/appointment/available-schedules?startDate=${startDate}&endDate=${endDate}`
    console.log('DEBUG: Full URL:', url)
    
    const response = await api.get(url)
    console.log('DEBUG: Full API response:', response)
    console.log('DEBUG: Response status:', response.status)
    console.log('DEBUG: Response data:', response.data)
    
    // Backend returns isSuccess instead of success
    if (response.data && (response.data.success || response.data.isSuccess)) {
      console.log('DEBUG: Success response, returning:', response.data.data)
      return response.data.data || []
    } else {
      console.log('DEBUG: Non-success response or no data')
      console.log('DEBUG: response.data.success:', response.data?.success)
      console.log('DEBUG: response.data.isSuccess:', response.data?.isSuccess)
      console.log('DEBUG: response.data.message:', response.data?.message)
      console.log('DEBUG: response.data.data:', response.data?.data)
      return []
    }
  } catch (error) {
    console.error('DEBUG: API call failed:', error)
    return []
  }
}

export const updateAppointmentStatus = async (appointmentId: number, status: string): Promise<void> => {
  try {
    const response = await api.put(`/api/appointment/${appointmentId}/status`, { status })
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update appointment status')
    }
  } catch (error) {
    console.error('Failed to update appointment status:', error)
    throw error
  }
}

export const setMeetingUrl = async (appointmentId: number, meetingUrl: string): Promise<void> => {
  try {
    const response = await api.put(`/api/appointment/${appointmentId}/meeting-url`, { meetingUrl })
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to set meeting URL')
    }
  } catch (error) {
    console.error('Failed to set meeting URL:', error)
    throw error
  }
}

export const getAppointmentStats = async (): Promise<AppointmentStats> => {
  try {
    const response = await api.get('/api/appointment/stats')
    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch appointment stats')
    }
  } catch (error) {
    console.error('Failed to fetch appointment stats:', error)
    throw error
  }
}

