import React, { useState } from 'react'
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import StaffNavigation from './StaffNavigation'

interface ReportData {
  type: 'monthly-revenue' | 'service-popularity' | 'user-growth'
  title: string
  headers: string[]
  rows: any[]
  chartData?: any
}

const StaffReports: React.FC = () => {
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateMonthlyRevenue = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/api/dashboard/monthly-revenue')
      
      // Mock data
      const mockData: ReportData = {
        type: 'monthly-revenue',
        title: 'Báo cáo Doanh thu Tháng này',
        headers: ['Ngày', 'Số lượt đặt hẹn', 'Doanh thu (VNĐ)', 'Dịch vụ phổ biến'],
        rows: [
          ['01/12/2024', '12', '3,200,000', 'Xét nghiệm HIV'],
          ['02/12/2024', '8', '2,100,000', 'Gói STIs Cơ bản'],
          ['03/12/2024', '15', '4,500,000', 'Gói STIs Nâng cao'],
          ['04/12/2024', '10', '2,800,000', 'Xét nghiệm Giang mai'],
          ['05/12/2024', '18', '5,200,000', 'Gói STIs Nâng cao']
        ],
        chartData: {
          labels: ['01/12', '02/12', '03/12', '04/12', '05/12'],
          values: [3200000, 2100000, 4500000, 2800000, 5200000]
        }
      }
      setCurrentReport(mockData)
    } catch (error) {
      console.error('Failed to generate monthly revenue report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateServicePopularity = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/api/dashboard/revenue-by-service')
      
      // Mock data
      const mockData: ReportData = {
        type: 'service-popularity',
        title: 'Báo cáo Dịch vụ Phổ biến',
        headers: ['Tên dịch vụ', 'Số lượt đặt', 'Doanh thu (VNĐ)', 'Tỷ lệ (%)'],
        rows: [
          ['Gói STIs Nâng cao', '45', '81,000,000', '35.2%'],
          ['Xét nghiệm HIV Combo', '38', '9,500,000', '16.8%'],
          ['Gói STIs Cơ bản', '32', '27,200,000', '14.1%'],
          ['Xét nghiệm Giang mai', '28', '5,600,000', '12.4%'],
          ['Xét nghiệm HPV', '25', '23,750,000', '11.0%'],
          ['Gói Sức khỏe Phụ nữ', '18', '27,000,000', '7.9%'],
          ['Xét nghiệm Viêm gan B', '12', '2,160,000', '5.3%']
        ]
      }
      setCurrentReport(mockData)
    } catch (error) {
      console.error('Failed to generate service popularity report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!currentReport) return

    const csvContent = [
      currentReport.headers.join(','),
      ...currentReport.rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${currentReport.title.replace(/\s+/g, '_')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-background-light">
      <StaffNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Báo Cáo & Thống Kê
            </h1>
            <p className="font-secondary text-gray-600">
              Chọn một trong các báo cáo có sẵn dưới đây để xem dữ liệu thống kê.
            </p>
          </div>

          {/* Report Generator Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle mb-8">
            <h3 className="text-xl font-primary font-semibold text-text-dark mb-4">
              Tạo Báo Cáo Mới
            </h3>
            <p className="font-secondary text-gray-600 mb-6">
              Lựa chọn loại báo cáo bạn muốn tạo:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={generateMonthlyRevenue}
                disabled={isLoading}
                className="flex items-center justify-center p-6 border-2 border-primary text-primary rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CurrencyDollarIcon className="h-8 w-8 mr-3" />
                <div className="text-left">
                  <div className="font-primary font-semibold">Doanh thu Tháng này</div>
                  <div className="font-secondary text-sm">Xem chi tiết doanh thu</div>
                </div>
              </button>

              <button
                onClick={generateServicePopularity}
                disabled={isLoading}
                className="flex items-center justify-center p-6 border-2 border-primary text-primary rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChartBarIcon className="h-8 w-8 mr-3" />
                <div className="text-left">
                  <div className="font-primary font-semibold">Dịch vụ Phổ biến</div>
                  <div className="font-secondary text-sm">Thống kê theo dịch vụ</div>
                </div>
              </button>

              <button
                disabled={true}
                className="flex items-center justify-center p-6 border-2 border-gray-300 text-gray-400 rounded-xl cursor-not-allowed"
                title="Tính năng sắp ra mắt"
              >
                <ArrowTrendingUpIcon className="h-8 w-8 mr-3" />
                <div className="text-left">
                  <div className="font-primary font-semibold">Tăng trưởng Người dùng</div>
                  <div className="font-secondary text-sm">Sắp ra mắt</div>
                </div>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-border-subtle text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="font-secondary text-gray-600">Đang tạo báo cáo...</p>
            </div>
          )}

          {/* Report Display Area */}
          {currentReport && !isLoading && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-primary font-semibold text-text-dark">
                  Kết quả Báo cáo: {currentReport.title}
                </h3>
                <button
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-secondary font-bold hover:bg-gray-200 transition-colors"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Export to CSV
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      {currentReport.headers.map((header, index) => (
                        <th key={index} className="text-left py-3 px-4 font-primary font-semibold text-text-dark">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentReport.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                        {row.map((cell: any, cellIndex: number) => (
                          <td key={cellIndex} className="py-3 px-4 font-secondary text-text-dark">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chart Display (if available) */}
              {currentReport.chartData && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-primary font-semibold text-text-dark mb-4">
                    Biểu đồ doanh thu
                  </h4>
                  <div className="h-64 flex items-center justify-center bg-white rounded-lg border border-gray-200">
                    <p className="font-secondary text-gray-500">
                      [Biểu đồ sẽ được hiển thị ở đây - cần tích hợp thư viện chart]
                    </p>
                  </div>
                </div>
              )}

              {/* Summary Statistics */}
              {currentReport.type === 'monthly-revenue' && (
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-primary-light p-4 rounded-lg">
                    <h5 className="font-primary font-semibold text-primary">Tổng doanh thu</h5>
                    <p className="text-2xl font-primary font-bold text-primary">17,800,000 VNĐ</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-primary font-semibold text-green-700">Tổng lượt đặt hẹn</h5>
                    <p className="text-2xl font-primary font-bold text-green-700">63</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-primary font-semibold text-blue-700">Trung bình/ngày</h5>
                    <p className="text-2xl font-primary font-bold text-blue-700">3,560,000 VNĐ</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StaffReports