import React, { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import ManagerNavigation from './ManagerNavigation'
import dashboardService from '../services/dashboardService'

interface ReportData {
  totalRevenue: number
  totalBookings: number
  totalCustomers: number
  growthRate: number
}

interface ServicePopularity {
  serviceName: string
  bookingCount: number
  revenue: number
}

const ManagerReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    growthRate: 0
  })
  const [servicePopularity, setServicePopularity] = useState<ServicePopularity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load dashboard data from API
  useEffect(() => {
    loadDashboardData()
  }, [selectedPeriod])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get comprehensive dashboard stats
      const dashboardStats = await dashboardService.getDashboardStats()
      
      // Update report data with API response
      setReportData({
        totalRevenue: dashboardStats.revenue.totalRevenue,
        totalBookings: dashboardStats.bookings.totalBookings,
        totalCustomers: dashboardStats.users.totalUsers,
        growthRate: dashboardStats.revenue.growthRate
      })

      // Get popular services
      const popularServices = await dashboardService.getPopularServices(10)
      
      // Transform API data to match component interface
      const transformedServices: ServicePopularity[] = popularServices.map(service => ({
        serviceName: service.serviceName,
        bookingCount: service.bookingCount,
        revenue: service.revenue
      }))
      
      setServicePopularity(transformedServices)

    } catch (error: any) {
      console.error('Failed to load dashboard data:', error)
      setError(error.message || 'Failed to load dashboard data')
      
      // Fallback to mock data if API fails
      setReportData({
        totalRevenue: 45750000,
        totalBookings: 127,
        totalCustomers: 89,
        growthRate: 12.5
      })
      
      setServicePopularity([
        {
          serviceName: 'Gói Xét Nghiệm STIs Cơ Bản (4 Bệnh)',
          bookingCount: 45,
          revenue: 38250000
        },
        {
          serviceName: 'Xét nghiệm HIV Combo Ab/Ag',
          bookingCount: 32,
          revenue: 8000000
        },
        {
          serviceName: 'Gói Xét Nghiệm STIs Nâng Cao (9 Bệnh)',
          bookingCount: 28,
          revenue: 50400000
        },
        {
          serviceName: 'Xét nghiệm Viêm Gan C (Anti-HCV)',
          bookingCount: 22,
          revenue: 3960000
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Service Name', 'Booking Count', 'Revenue'],
      ...servicePopularity.map(service => [
        service.serviceName,
        service.bookingCount.toString(),
        service.revenue.toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `service-report-${selectedPeriod}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background-light">
      <ManagerNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Báo cáo
            </h1>
            <p className="font-secondary text-gray-600">
              Phân tích doanh thu và hiệu suất dịch vụ
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-600 text-sm">
                  <strong>Lỗi:</strong> {error}
                </div>
                <button
                  onClick={loadDashboardData}
                  className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Period Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-primary font-semibold text-text-dark">
                Chọn khoảng thời gian
              </h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              >
                <option value="thisWeek">Tuần này</option>
                <option value="thisMonth">Tháng này</option>
                <option value="thisQuarter">Quý này</option>
                <option value="thisYear">Năm này</option>
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {loading && (
              <div className="col-span-4 text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
              </div>
            )}
            {!loading && (
              <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-secondary text-gray-600 text-sm">Tổng doanh thu</p>
                  <p className="text-2xl font-primary font-bold text-green-600 mt-1">
                    {formatCurrency(reportData.totalRevenue)}
                  </p>
                </div>
                <CurrencyDollarIcon className="h-12 w-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-secondary text-gray-600 text-sm">Tổng booking</p>
                  <p className="text-2xl font-primary font-bold text-blue-600 mt-1">
                    {reportData.totalBookings}
                  </p>
                </div>
                <ChartBarIcon className="h-12 w-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-secondary text-gray-600 text-sm">Khách hàng</p>
                  <p className="text-2xl font-primary font-bold text-purple-600 mt-1">
                    {reportData.totalCustomers}
                  </p>
                </div>
                <UserGroupIcon className="h-12 w-12 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-secondary text-gray-600 text-sm">Tăng trưởng</p>
                  <p className="text-2xl font-primary font-bold text-green-600 mt-1">
                    +{reportData.growthRate}%
                  </p>
                </div>
                <ArrowTrendingUpIcon className="h-12 w-12 text-green-500" />
              </div>
            </div>
            </>
            )}
          </div>

          {/* Service Popularity Report */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-primary font-semibold text-text-dark">
                Báo cáo độ phổ biến dịch vụ
              </h2>
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Xuất CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh thu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ lệ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <p className="mt-2 text-gray-600">Đang tải dữ liệu dịch vụ...</p>
                      </td>
                    </tr>
                  ) : servicePopularity.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Không có dữ liệu dịch vụ
                      </td>
                    </tr>
                  ) : (
                    servicePopularity.map((service, index) => {
                    const percentage = ((service.bookingCount / reportData.totalBookings) * 100).toFixed(1)
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {service.serviceName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.bookingCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(service.revenue)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerReports