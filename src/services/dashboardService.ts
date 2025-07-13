import api from './api'

// Types based on the API documentation
export interface DashboardStatsDto {
  revenue: RevenueStatsDto
  bookings: BookingStatsDto
  users: UserStatsDto
  services: ServiceStatsDto
}

export interface RevenueStatsDto {
  totalRevenue: number
  monthlyRevenue: number
  weeklyRevenue: number
  dailyRevenue: number
  growthRate: number
  previousMonthRevenue: number
}

export interface BookingStatsDto {
  totalBookings: number
  monthlyBookings: number
  weeklyBookings: number
  dailyBookings: number
  completedBookings: number
  pendingBookings: number
  cancelledBookings: number
  completionRate: number
}

export interface UserStatsDto {
  totalUsers: number
  monthlyNewUsers: number
  weeklyNewUsers: number
  dailyNewUsers: number
  activeUsers: number
  userGrowthRate: number
}

export interface ServiceStatsDto {
  totalServices: number
  activeServices: number
  mostPopularServiceId: number
  mostPopularServiceName: string
  averageServiceRating: number
}

export interface PopularServiceDto {
  serviceId: number
  serviceName: string
  bookingCount: number
  revenue: number
  averageRating: number
}

export interface MonthlyRevenueDto {
  month: number
  year: number
  revenue: number
  bookingCount: number
}

export interface ServiceRevenueDto {
  serviceId: number
  serviceName: string
  revenue: number
  bookingCount: number
  percentage: number
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

class DashboardService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await api.get<ApiResponse<T>>(`api/Dashboard${endpoint}`)
      
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      
      return response.data.data
    } catch (error: any) {
      console.error(`Dashboard API Error (${endpoint}):`, error)
      throw new Error(error.response?.data?.message || error.message || 'Dashboard API request failed')
    }
  }

  // Get comprehensive dashboard statistics
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return this.makeRequest<DashboardStatsDto>('/stats')
  }

  // Get revenue statistics
  async getRevenueStats(): Promise<RevenueStatsDto> {
    return this.makeRequest<RevenueStatsDto>('/revenue')
  }

  // Get user statistics
  async getUserStats(): Promise<UserStatsDto> {
    return this.makeRequest<UserStatsDto>('/users')
  }

  // Get booking statistics
  async getBookingStats(): Promise<BookingStatsDto> {
    return this.makeRequest<BookingStatsDto>('/bookings')
  }

  // Get service statistics
  async getServiceStats(): Promise<ServiceStatsDto> {
    return this.makeRequest<ServiceStatsDto>('/services')
  }

  // Get monthly revenue for specific year
  async getMonthlyRevenue(year: number): Promise<MonthlyRevenueDto[]> {
    return this.makeRequest<MonthlyRevenueDto[]>(`/revenue/monthly/${year}`)
  }

  // Get revenue breakdown by service
  async getRevenueByService(): Promise<ServiceRevenueDto[]> {
    return this.makeRequest<ServiceRevenueDto[]>('/revenue/by-service')
  }

  // Get popular services
  async getPopularServices(limit: number = 10): Promise<PopularServiceDto[]> {
    return this.makeRequest<PopularServiceDto[]>(`/services/popular?limit=${limit}`)
  }

  // Get user registration trends
  async getUserRegistrationTrends(days: number = 30): Promise<any[]> {
    return this.makeRequest<any[]>(`/users/registration-trends?days=${days}`)
  }
}

export const dashboardService = new DashboardService()
export default dashboardService