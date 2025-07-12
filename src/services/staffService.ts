import api from './api'

// Staff Dashboard Types
export interface DashboardStats {
  todayAppointmentCount: number
  waitingForSampleCount: number
  pendingResultEntryCount: number
  overdueTasks: OverdueTask[]
  recentActivity: ActivityItem[]
}

export interface OverdueTask {
  bookingId: string
  customerName: string
  serviceName: string
  daysOverdue: number
  status: string
  appointmentDate: string
}

export interface ActivityItem {
  id: string
  timestamp: string
  text: string
  type: 'update' | 'result' | 'sample'
  bookingId?: string
}

// User Lookup Types
export interface UserLookupResponse {
  success: boolean
  message: string
  data: {
    pagination: {
      currentPage: number
      totalPages: number
      pageSize: number
      totalCount: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    data: User[]
  }
}

export interface User {
  userId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  registeredAt: string
  roles: string[]
  lastLoginAt?: string
  isActive: boolean
  totalBookings?: number
  lastVisit?: string
}

// Booking Management Types
export interface BookingListResponse {
  success: boolean
  message: string
  data: {
    pagination: {
      currentPage: number
      totalPages: number
      pageSize: number
      totalCount: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    data: StaffBooking[]
  }
}

export interface StaffBooking {
  bookingId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceName: string
  serviceId?: string
  appointmentDate: string
  status: 'Booked' | 'SampleCollected' | 'Processing' | 'ResultReady' | 'Completed' | 'Cancelled'
  isPaid: boolean
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ServiceWithAnalytes {
  serviceId: number
  serviceName: string
  description: string
  price: number
  serviceType: string
  analytes: Analyte[]
}

export interface Analyte {
  analyteId: number
  analyteName: string
  defaultUnit?: string
  defaultReferenceRange: string
}

export interface TestResultDetail {
  analyteName: string
  value: string
  unit?: string | null
  referenceRange: string
  flag: string
}

export interface TestResultSubmission {
  bookingId: number
  resultDetails: TestResultDetail[]
  notes?: string
}

// Staff Service Class
class StaffService {
  // Get dashboard summary data
  async getDashboardSummary(): Promise<DashboardStats> {
    try {
      const response = await api.get('/api/staff/dashboard-summary')
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error)
      throw error
    }
  }

  // Get all users with pagination and search
  async getAllUsers(
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = ''
  ): Promise<UserLookupResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      })
      
      if (searchTerm) {
        params.append('searchTerm', searchTerm)
      }

      const response = await api.get(`/api/users/all?${params}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }

  // Get all bookings for staff management
  async getAllBookings(): Promise<StaffBooking[]> {
    try {
      // Backend endpoint returns all bookings without pagination parameters
      const response = await api.get('/api/testbooking')
      
      // Handle wrapped API response {success: true, data: [...]}
      const bookingsData = response.data?.data || response.data
      
      if (Array.isArray(bookingsData)) {
        return bookingsData.map((booking: any) => ({
          bookingId: booking.bookingId?.toString() || booking.id?.toString(),
          customerName: booking.customerName || `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() || 'Unknown Customer',
          customerEmail: booking.customerEmail || booking.customer?.email || '',
          customerPhone: booking.customerPhone || booking.customer?.phoneNumber || '',
          serviceName: booking.serviceName || booking.service?.serviceName || 'Unknown Service',
          serviceId: booking.serviceId?.toString() || booking.service?.serviceId?.toString(),
          appointmentDate: booking.appointmentTime || booking.appointmentDate,
          status: booking.bookingStatus || booking.status,
          isPaid: booking.isPaid || false,
          totalAmount: booking.servicePrice || booking.service?.price || booking.totalAmount || 0,
          createdAt: booking.bookedAt || booking.createdAt,
          updatedAt: booking.updatedAt || booking.bookedAt
        }))
      }
      
      // If bookingsData is not an array, return empty array
      console.warn('API response data is not an array:', bookingsData)
      return []
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      throw error
    }
  }

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    newStatus: string,
    notes?: string
  ): Promise<void> {
    try {
      await api.put(`/api/testbooking/${bookingId}/status`, {
        bookingStatus: newStatus,
        notes
      })
    } catch (error) {
      console.error('Failed to update booking status:', error)
      throw error
    }
  }

  // Mark booking as paid (only works when status is Booked)
  async markBookingAsPaid(bookingId: string): Promise<void> {
    try {
      await api.put(`/api/testbooking/${bookingId}/status`, {
        bookingStatus: "SampleCollected", // Required status change
        isPaid: true
      })
    } catch (error) {
      console.error('Failed to mark booking as paid:', error)
      throw error
    }
  }

  // Update booking status and mark as paid (combined operation)
  async updateBookingStatusAndPayment(
    bookingId: string,
    newStatus: string,
    isPaid: boolean,
    notes?: string
  ): Promise<void> {
    try {
      await api.put(`/api/testbooking/${bookingId}/status`, {
        bookingStatus: newStatus,
        isPaid,
        notes
      })
    } catch (error) {
      console.error('Failed to update booking:', error)
      throw error
    }
  }

  // Get booking details
  async getBookingDetails(bookingId: string): Promise<StaffBooking> {
    try {
      const response = await api.get(`/api/testbooking/${bookingId}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch booking details:', error)
      throw error
    }
  }

  // Add notes to booking
  async addBookingNotes(bookingId: string, notes: string): Promise<void> {
    try {
      await api.put(`/api/testbooking/${bookingId}/notes`, {
        notes
      })
    } catch (error) {
      console.error('Failed to add booking notes:', error)
      throw error
    }
  }

  // Get service details with analytes for result entry
  async getServiceDetails(serviceId: string): Promise<ServiceWithAnalytes> {
    try {
      const response = await api.get(`/api/servicecatalog/${serviceId}`)
      console.log('Raw API response:', response.data) // Debug log
      
      // Handle wrapped response structure
      const serviceData = response.data?.data || response.data
      
      return serviceData
    } catch (error) {
      console.error('Failed to fetch service details:', error)
      throw error
    }
  }

  // Submit test results
  async submitTestResults(resultData: TestResultSubmission): Promise<void> {
    try {
      await api.post('/api/testresult', resultData)
    } catch (error) {
      console.error('Failed to submit test results:', error)
      throw error
    }
  }

  // Delete user by ID (Admin only)
  async deleteUser(userId: number): Promise<void> {
    try {
      const response = await api.delete(`/api/User/${userId}`)
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}

export default new StaffService()