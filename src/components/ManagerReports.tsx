import React, { useState } from 'react'
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import ManagerNavigation from './ManagerNavigation'

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
    totalRevenue: 45750000,
    totalBookings: 127,
    totalCustomers: 89,
    growthRate: 12.5
  })

  const [servicePopularity, setServicePopularity] = useState<ServicePopularity[]>([
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

          {/* Period Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-primary font-semibold text-text-dark">
                Chọn khoảng thời gian
              </h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  {servicePopularity.map((service, index) => {
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
                  })}
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