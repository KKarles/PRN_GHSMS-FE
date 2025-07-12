import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  UserIcon,
  EyeIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import AdminNavigation from './AdminNavigation'
import staffService, { type User } from '../services/staffService'

const AdminAccountManagement: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
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
      
      const response = await staffService.getAllUsers(
        pagination.currentPage,
        pagination.itemsPerPage,
        searchTerm
      )
      
      setCustomers(response.data.data)
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages,
        totalItems: response.data.pagination.totalCount
      }))
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewCustomer = (customer: User) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setIsDeleting(true)
      await staffService.deleteUser(userToDelete.userId)
      
      // Refresh the user list
      await fetchCustomers()
      
      // Close modal and reset state
      setShowDeleteModal(false)
      setUserToDelete(null)
      
      // Show success message
      alert('Xóa người dùng thành công!')
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Không thể xóa người dùng. Vui lòng thử lại.')
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDeleteUser = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    fetchCustomers()
  }

  const getRoleColor = (roles: string[]) => {
    if (roles.includes('Admin')) {
      return 'bg-red-100 text-red-800'
    } else if (roles.includes('Manager')) {
      return 'bg-orange-100 text-orange-800'
    } else if (roles.includes('Consultant')) {
      return 'bg-purple-100 text-purple-800'
    } else if (roles.includes('Staff')) {
      return 'bg-green-100 text-green-800'
    } else if (roles.includes('Customer')) {
      return 'bg-blue-100 text-blue-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const getRoleText = (roles: string[]) => {
    if (roles.includes('Admin')) {
      return 'Quản trị viên'
    } else if (roles.includes('Manager')) {
      return 'Quản lý'
    } else if (roles.includes('Consultant')) {
      return 'Chuyên gia tư vấn'
    } else if (roles.includes('Staff')) {
      return 'Nhân viên'
    } else if (roles.includes('Customer')) {
      return 'Khách hàng'
    }
    return roles.join(', ')
  }

  return (
    <div className="min-h-screen bg-background-light">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Quản lý Tài khoản
            </h1>
            <p className="font-secondary text-gray-600">
              Xem và quản lý tất cả tài khoản người dùng trong hệ thống
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo tên, email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đăng ký
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Đang tải...
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {customer.firstName} {customer.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {customer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(customer.roles)}`}>
                            {getRoleText(customer.roles)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {customer.isActive ? 'Hoạt động' : 'Bị khóa'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(customer.registeredAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewCustomer(customer)}
                              className="text-primary hover:text-primary-dark p-1 rounded"
                              title="Xem chi tiết"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(customer)}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="Xóa người dùng"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
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
            )}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Chi tiết người dùng</h3>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Đóng</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Họ và tên</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Vai trò</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedCustomer.roles)}`}>
                    {getRoleText(selectedCustomer.roles)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Trạng thái</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedCustomer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedCustomer.isActive ? 'Hoạt động' : 'Bị khóa'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Ngày đăng ký</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedCustomer.registeredAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa người dùng</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete.firstName} {userToDelete.lastName}</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDeleteUser}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAccountManagement