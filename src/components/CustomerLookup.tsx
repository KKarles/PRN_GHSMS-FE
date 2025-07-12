import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  UserIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import StaffNavigation from './StaffNavigation'
import staffService, { type User, type UserLookupResponse } from '../services/staffService'

// Remove local interfaces since they're now in staffService

const CustomerLookup: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  useEffect(() => {
    fetchCustomers()
  }, [pagination.currentPage, searchTerm])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      // TODO: Replace with actual API call
      // const response = await api.get(`/api/users/all?role=Customer&page=${pagination.currentPage}&limit=${pagination.itemsPerPage}`)
      
      // Mock data for now
      const mockCustomers: User[] = [
        {
          userId: 1,
          firstName: 'Nguyễn',
          lastName: 'Thị Lan',
          email: 'lan.nguyen@email.com',
          phoneNumber: '0901234567',
          registeredAt: '2024-01-15T10:30:00Z',
          roles: ['Customer'],
          isActive: true,
          totalBookings: 3,
          lastVisit: '2024-11-20T14:30:00Z'
        },
        {
          userId: 2,
          firstName: 'Trần',
          lastName: 'Văn Minh',
          email: 'minh.tran@email.com',
          phoneNumber: '0912345678',
          registeredAt: '2024-02-10T09:15:00Z',
          roles: ['Customer'],
          isActive: true,
          totalBookings: 1,
          lastVisit: '2024-11-18T11:00:00Z'
        },
        {
          userId: 3,
          firstName: 'Lê',
          lastName: 'Thị Hoa',
          email: 'hoa.le@email.com',
          phoneNumber: '0923456789',
          dateOfBirth: '1992-12-03',
          registeredAt: '2024-03-05T16:45:00Z',
          totalBookings: 5,
          lastVisit: '2024-11-25T09:30:00Z'
        },
        {
          userId: 4,
          firstName: 'Phạm',
          lastName: 'Văn Đức',
          email: 'duc.pham@email.com',
          phoneNumber: '0934567890',
          dateOfBirth: '1988-07-18',
          registeredAt: '2024-01-28T13:20:00Z',
          totalBookings: 2,
          lastVisit: '2024-11-15T16:15:00Z'
        },
        {
          userId: 5,
          firstName: 'Hoàng',
          lastName: 'Thị Mai',
          email: 'mai.hoang@email.com',
          phoneNumber: '0945678901',
          dateOfBirth: '1995-03-10',
          registeredAt: '2024-04-12T11:10:00Z',
          totalBookings: 1,
          lastVisit: '2024-11-22T10:45:00Z'
        }
      ]

      setCustomers(mockCustomers)
      setPagination(prev => ({
        ...prev,
        totalItems: mockCustomers.length,
        totalPages: Math.ceil(mockCustomers.length / prev.itemsPerPage)
      }))
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterCustomers = () => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers)
      return
    }

    const filtered = customers.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase()
      const searchLower = searchTerm.toLowerCase()
      
      return (
        fullName.includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phoneNumber.includes(searchTerm)
      )
    })

    setFilteredCustomers(filtered)
  }

  const handleViewCustomer = (customer: User) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  return (
    <div className="min-h-screen bg-background-light">
      <StaffNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-2xl font-primary font-semibold text-text-dark">
                Quản lý Khách hàng
              </h2>
            </div>

            {/* Filter Toolbar */}
            <div className="p-6 border-b border-border-subtle bg-gray-50">
              <div className="relative max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo Tên, Email hoặc SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Data Grid */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="font-secondary text-gray-600">Đang tải dữ liệu khách hàng...</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-primary font-semibold text-text-dark border-b border-gray-200">
                        UserID
                      </th>
                      <th className="text-left py-4 px-6 font-primary font-semibold text-text-dark border-b border-gray-200">
                        Họ và Tên
                      </th>
                      <th className="text-left py-4 px-6 font-primary font-semibold text-text-dark border-b border-gray-200">
                        Email
                      </th>
                      <th className="text-left py-4 px-6 font-primary font-semibold text-text-dark border-b border-gray-200">
                        Số điện thoại
                      </th>
                      <th className="text-left py-4 px-6 font-primary font-semibold text-text-dark border-b border-gray-200">
                        Ngày đăng ký
                      </th>
                      <th className="text-left py-4 px-6 font-primary font-semibold text-text-dark border-b border-gray-200">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12">
                          <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="font-secondary text-gray-500">
                            {searchTerm ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng nào'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <tr key={customer.userId} className="hover:bg-gray-50 border-b border-gray-100">
                          <td className="py-4 px-6 font-secondary text-text-dark">
                            #{customer.userId}
                          </td>
                          <td className="py-4 px-6 font-secondary text-text-dark">
                            {customer.firstName} {customer.lastName}
                          </td>
                          <td className="py-4 px-6 font-secondary text-text-dark">
                            {customer.email}
                          </td>
                          <td className="py-4 px-6 font-secondary text-text-dark">
                            {customer.phoneNumber}
                          </td>
                          <td className="py-4 px-6 font-secondary text-text-dark">
                            {formatDate(customer.registeredAt)}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleViewCustomer(customer)}
                              className="flex items-center px-3 py-2 bg-primary text-text-light rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors text-sm"
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              Xem
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Footer */}
            {!isLoading && filteredCustomers.length > 0 && (
              <div className="p-6 border-t border-border-subtle bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="font-secondary text-gray-600 text-sm">
                    Hiển thị {filteredCustomers.length} trên tổng số {pagination.totalItems} khách hàng
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    
                    <span className="px-4 py-2 font-secondary text-text-dark">
                      Trang {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-primary font-semibold text-text-dark">
                Thông tin khách hàng
              </h3>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-secondary text-gray-600 text-sm mb-1">Họ và tên</label>
                  <p className="font-primary font-semibold text-text-dark">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </p>
                </div>
                <div>
                  <label className="block font-secondary text-gray-600 text-sm mb-1">Email</label>
                  <p className="font-secondary text-text-dark">{selectedCustomer.email}</p>
                </div>
                <div>
                  <label className="block font-secondary text-gray-600 text-sm mb-1">Số điện thoại</label>
                  <p className="font-secondary text-text-dark">{selectedCustomer.phoneNumber}</p>
                </div>
                <div>
                  <label className="block font-secondary text-gray-600 text-sm mb-1">Ngày sinh</label>
                  <p className="font-secondary text-text-dark">{selectedCustomer.registeredAt ? formatDate(selectedCustomer.registeredAt) : 'N/A'}</p>
                </div>
                <div>
                  <label className="block font-secondary text-gray-600 text-sm mb-1">Ngày đăng ký</label>
                  <p className="font-secondary text-text-dark">{formatDateTime(selectedCustomer.registeredAt)}</p>
                </div>
                <div>
                  <label className="block font-secondary text-gray-600 text-sm mb-1">Lần cuối truy cập</label>
                  <p className="font-secondary text-text-dark">
                    {selectedCustomer.lastVisit ? formatDateTime(selectedCustomer.lastVisit) : 'Chưa có'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-primary-light p-4 rounded-lg">
                  <h4 className="font-primary font-semibold text-primary">Tổng lượt đặt hẹn</h4>
                  <p className="text-2xl font-primary font-bold text-primary">
                    {selectedCustomer.totalBookings || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-primary font-semibold text-green-700">Trạng thái</h4>
                  <p className="font-secondary text-green-700">Hoạt động</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button className="flex-1 bg-primary text-text-light py-3 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors">
                  Xem lịch sử đặt hẹn
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-secondary font-bold hover:bg-gray-300 transition-colors">
                  Xem kết quả xét nghiệm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerLookup