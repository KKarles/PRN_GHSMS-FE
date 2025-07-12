import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  BeakerIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import StaffNavigation from './StaffNavigation'
import ResultEntryModal from './ResultEntryModal'
import staffService, { type StaffBooking } from '../services/staffService'

interface SampleFilters {
  status: string
  searchTerm: string
  dateFrom: string
  dateTo: string
}

const SampleManagement: React.FC = () => {
  const navigate = useNavigate()
  const [allBookings, setAllBookings] = useState<StaffBooking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<StaffBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<StaffBooking | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showResultEntryModal, setShowResultEntryModal] = useState(false)
  const [filters, setFilters] = useState<SampleFilters>({
    status: '',
    searchTerm: '',
    dateFrom: '',
    dateTo: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    // Only apply filters if allBookings is an array
    if (Array.isArray(allBookings)) {
      applyFilters()
    }
  }, [allBookings, filters])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Backend returns all bookings without pagination
      const bookingsData = await staffService.getAllBookings()
      
      // Ensure we always set an array
      if (Array.isArray(bookingsData)) {
        setAllBookings(bookingsData)
      } else {
        console.warn('API returned non-array data:', bookingsData)
        setAllBookings([])
      }
      
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      setError('Không thể tải danh sách booking. Vui lòng thử lại.')
      
      // Fallback mock data
      const mockBookings = [
        {
          bookingId: '152',
          customerName: 'Nguyễn Thị Lan',
          customerEmail: 'lan.nguyen@email.com',
          customerPhone: '0901234567',
          serviceName: 'Gói Xét Nghiệm STIs Cơ Bản',
          appointmentDate: '2025-01-08T14:30:00Z',
          status: 'Booked' as any,
          isPaid: false,
          totalAmount: 850000,
          createdAt: '2025-01-06T10:00:00Z',
          updatedAt: '2025-01-06T10:00:00Z'
        },
        {
          bookingId: '151',
          customerName: 'Trần Văn Minh',
          customerEmail: 'minh.tran@email.com',
          customerPhone: '0912345678',
          serviceName: 'Xét nghiệm HIV Combo',
          appointmentDate: '2025-01-08T10:00:00Z',
          status: 'SampleCollected' as any,
          isPaid: true,
          totalAmount: 250000,
          createdAt: '2025-01-05T14:00:00Z',
          updatedAt: '2025-01-08T10:30:00Z'
        }
      ]
      setAllBookings(mockBookings)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    // Ensure allBookings is an array before spreading
    if (!Array.isArray(allBookings)) {
      return
    }
    
    let filtered = [...allBookings]

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status)
    }

    // Filter by search term
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.customerEmail.toLowerCase().includes(searchLower) ||
        booking.customerPhone.includes(filters.searchTerm) ||
        booking.bookingId.includes(filters.searchTerm) ||
        booking.serviceName.toLowerCase().includes(searchLower)
      )
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filtered = filtered.filter(booking => 
        new Date(booking.appointmentDate) >= fromDate
      )
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(booking => 
        new Date(booking.appointmentDate) <= toDate
      )
    }

    setFilteredBookings(filtered)
    
    // Update pagination
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage)
    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages || 1)
    }))
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await staffService.updateBookingStatus(bookingId, newStatus)
      
      // Update local state
      setAllBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId 
          ? { ...booking, status: newStatus as any, updatedAt: new Date().toISOString() }
          : booking
      ))
      
      // Close modal if open
      if (selectedBooking?.bookingId === bookingId) {
        setShowBookingModal(false)
        setSelectedBooking(null)
      }
      
    } catch (error) {
      console.error('Failed to update booking status:', error)
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.')
    }
  }

  const handleMarkAsPaid = async (bookingId: string) => {
    try {
      // Find the current booking to check its status
      const currentBooking = allBookings.find(b => b.bookingId === bookingId)
      
      if (!currentBooking) {
        alert('Không tìm thấy booking.')
        return
      }
      
      // Can only mark as paid when status is "Booked"
      if (currentBooking.status !== 'Booked') {
        alert('Chỉ có thể đánh dấu thanh toán khi trạng thái là "Đã đặt".')
        return
      }
      
      await staffService.markBookingAsPaid(bookingId)
      
      // Update local state - booking becomes SampleCollected and paid
      setAllBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId 
          ? { 
              ...booking, 
              status: 'SampleCollected' as any, 
              isPaid: true, 
              updatedAt: new Date().toISOString() 
            }
          : booking
      ))
      
    } catch (error) {
      console.error('Failed to mark as paid:', error)
      alert('Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại.')
    }
  }

  // Get valid next statuses based on current status
  const getValidNextStatuses = (currentStatus: string): string[] => {
    const validTransitions: { [key: string]: string[] } = {
      'Booked': ['SampleCollected', 'Completed'],
      'SampleCollected': ['Processing', 'Completed'],
      'Processing': ['ResultReady', 'Completed'],
      'ResultReady': ['Completed'],
      'Completed': []
    }
    
    return validTransitions[currentStatus] || []
  }

  const handleResultEntry = (booking: StaffBooking) => {
    setSelectedBooking(booking)
    setShowResultEntryModal(true)
  }

  const handleResultEntrySuccess = () => {
    // Refresh the bookings list
    fetchBookings()
    setShowResultEntryModal(false)
    setSelectedBooking(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Booked': { color: 'bg-blue-100 text-blue-800', text: 'Đã đặt' },
      'SampleCollected': { color: 'bg-yellow-100 text-yellow-800', text: 'Đã lấy mẫu' },
      'Processing': { color: 'bg-purple-100 text-purple-800', text: 'Đang xử lý' },
      'ResultReady': { color: 'bg-indigo-100 text-indigo-800', text: 'Kết quả sẵn sàng' },
      'Completed': { color: 'bg-green-100 text-green-800', text: 'Hoàn thành' },
      'Cancelled': { color: 'bg-red-100 text-red-800', text: 'Đã hủy' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Booked
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  const getCurrentPageBookings = () => {
    // Ensure filteredBookings is an array
    if (!Array.isArray(filteredBookings)) {
      return []
    }
    
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    return filteredBookings.slice(startIndex, endIndex)
  }

  const handleViewBooking = (booking: StaffBooking) => {
    setSelectedBooking(booking)
    setShowBookingModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light">
        <StaffNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-secondary">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      <StaffNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Quản lý Mẫu & Booking
            </h1>
            <p className="font-secondary text-gray-600">
              Quản lý trạng thái booking, lấy mẫu và thanh toán
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 font-secondary">{error}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Booked">Đã đặt</option>
                <option value="SampleCollected">Đã lấy mẫu</option>
                <option value="Processing">Đang xử lý</option>
                <option value="ResultReady">Kết quả sẵn sàng</option>
                <option value="Completed">Hoàn thành</option>
              </select>

              {/* Date From */}
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />

              {/* Date To */}
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày hẹn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentPageBookings().map((booking) => (
                    <tr key={booking.bookingId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-primary">#{booking.bookingId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{booking.customerName}</div>
                          <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.serviceName}</div>
                        <div className="text-sm text-gray-500">{formatCurrency(booking.totalAmount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(booking.appointmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.isPaid ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Đã thanh toán
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Chưa thanh toán
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="text-primary hover:text-primary-600"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          {getValidNextStatuses(booking.status).length > 0 && (
                            <button
                              onClick={() => {
                                const nextStatuses = getValidNextStatuses(booking.status)
                                if (nextStatuses.includes('ResultReady')) {
                                  // If ResultReady is an option, show result entry modal
                                  handleResultEntry(booking)
                                } else if (nextStatuses.length === 1) {
                                  handleStatusUpdate(booking.bookingId, nextStatuses[0])
                                } else {
                                  // Show modal for multiple options
                                  handleViewBooking(booking)
                                }
                              }}
                              className="text-green-600 hover:text-green-800"
                              title={getValidNextStatuses(booking.status).includes('ResultReady') ? 'Nhập kết quả' : 'Cập nhật trạng thái'}
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                          )}
                          
                          {/* Dedicated Result Entry Button for Processing status */}
                          {booking.status === 'Processing' && (
                            <button
                              onClick={() => handleResultEntry(booking)}
                              className="text-purple-600 hover:text-purple-800"
                              title="Nhập kết quả xét nghiệm"
                            >
                              <BeakerIcon className="h-5 w-5" />
                            </button>
                          )}
                          {!booking.isPaid && booking.status === 'Booked' && (
                            <button
                              onClick={() => handleMarkAsPaid(booking.bookingId)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Đánh dấu đã thanh toán (chuyển sang Đã lấy mẫu)"
                            >
                              <BeakerIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                    </span>{' '}
                    đến{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span>{' '}
                    trong tổng số{' '}
                    <span className="font-medium">{pagination.totalItems}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-primary border-primary text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Entry Modal */}
      {showResultEntryModal && selectedBooking && (
        <ResultEntryModal
          booking={selectedBooking}
          isOpen={showResultEntryModal}
          onClose={() => {
            setShowResultEntryModal(false)
            setSelectedBooking(null)
          }}
          onSuccess={handleResultEntrySuccess}
        />
      )}

      {/* Booking Detail Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-primary font-semibold text-text-dark">
                  Chi tiết Booking #{selectedBooking.bookingId}
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-primary font-semibold text-text-dark mb-3">Thông tin khách hàng</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Tên:</span> {selectedBooking.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.customerEmail}</p>
                    <p><span className="font-medium">Điện thoại:</span> {selectedBooking.customerPhone}</p>
                  </div>
                </div>

                {/* Service Info */}
                <div>
                  <h4 className="font-primary font-semibold text-text-dark mb-3">Thông tin dịch vụ</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Dịch vụ:</span> {selectedBooking.serviceName}</p>
                    <p><span className="font-medium">Giá:</span> {formatCurrency(selectedBooking.totalAmount)}</p>
                    <p><span className="font-medium">Ngày hẹn:</span> {formatDateTime(selectedBooking.appointmentDate)}</p>
                  </div>
                </div>

                {/* Status Info */}
                <div>
                  <h4 className="font-primary font-semibold text-text-dark mb-3">Trạng thái</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Trạng thái booking:</span>
                      {getStatusBadge(selectedBooking.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Thanh toán:</span>
                      {selectedBooking.isPaid ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Chưa thanh toán
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  {/* Status Update Buttons */}
                  {getValidNextStatuses(selectedBooking.status).length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Cập nhật trạng thái:</h5>
                      <div className="flex flex-wrap gap-2">
                        {getValidNextStatuses(selectedBooking.status).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              if (status === 'ResultReady') {
                                // Close current modal and open result entry
                                setShowBookingModal(false)
                                handleResultEntry(selectedBooking)
                              } else {
                                handleStatusUpdate(selectedBooking.bookingId, status)
                              }
                            }}
                            className={`px-4 py-2 text-white rounded-lg font-secondary font-bold transition-colors text-sm ${
                              status === 'ResultReady' 
                                ? 'bg-purple-600 hover:bg-purple-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {status === 'ResultReady' ? 'Nhập kết quả' : getStatusBadge(status).props.children}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Direct Result Entry for Processing */}
                  {selectedBooking.status === 'Processing' && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Nhập kết quả:</h5>
                      <button
                        onClick={() => {
                          setShowBookingModal(false)
                          handleResultEntry(selectedBooking)
                        }}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-secondary font-bold hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        <BeakerIcon className="h-5 w-5 mr-2" />
                        Nhập kết quả xét nghiệm
                      </button>
                    </div>
                  )}
                  
                  {/* Payment Button */}
                  {!selectedBooking.isPaid && selectedBooking.status === 'Booked' && (
                    <button
                      onClick={() => handleMarkAsPaid(selectedBooking.bookingId)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-secondary font-bold hover:bg-blue-700 transition-colors"
                    >
                      Đánh dấu đã thanh toán (chuyển sang Đã lấy mẫu)
                    </button>
                  )}
                  
                  {/* Combined Status + Payment Button for Booked items */}
                  {selectedBooking.status === 'Booked' && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Thao tác nhanh:</h5>
                      <button
                        onClick={() => {
                          // Use the combined update function
                          staffService.updateBookingStatusAndPayment(
                            selectedBooking.bookingId, 
                            'SampleCollected', 
                            true
                          ).then(() => {
                            setAllBookings(prev => prev.map(booking => 
                              booking.bookingId === selectedBooking.bookingId 
                                ? { 
                                    ...booking, 
                                    status: 'SampleCollected' as any, 
                                    isPaid: true, 
                                    updatedAt: new Date().toISOString() 
                                  }
                                : booking
                            ))
                            setShowBookingModal(false)
                            setSelectedBooking(null)
                          }).catch(error => {
                            console.error('Failed to update booking:', error)
                            alert('Không thể cập nhật. Vui lòng thử lại.')
                          })
                        }}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-secondary font-bold hover:bg-green-700 transition-colors"
                      >
                        Lấy mẫu + Đánh dấu đã thanh toán
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SampleManagement