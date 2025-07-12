import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  UserIcon,
  EyeIcon,
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
      
      const mockCustomers: User[] = [
        {
          userId: 1,
          firstName: 'Nguyen',
          lastName: 'Thi Lan',
          email: 'lan.nguyen@email.com',
          phoneNumber: '0901234567',
          registeredAt: '2024-01-15T10:30:00Z',
          roles: ['Customer'],
          isActive: true,
          totalBookings: 3,
          lastVisit: '2024-11-20T14:30:00Z'
        }
      ]
      
      setCustomers(mockCustomers)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewCustomer = (customer: User) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light">
        <AdminNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-secondary">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      <AdminNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Account Management
            </h1>
            <p className="font-secondary text-gray-600">
              Search and manage customer account information
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle mb-6">
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">ID: {customer.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(customer.registeredAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.totalBookings || 0} booking(s)
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.lastVisit ? `Last: ${formatDate(customer.lastVisit)}` : 'No activity'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="text-primary hover:text-primary-600 flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-primary font-semibold text-text-dark">
                  Customer Information
                </h3>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <p className="font-secondary text-text-dark">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                  </div>
                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-1">
                      Email
                    </label>
                    <p className="font-secondary text-text-dark">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <p className="font-secondary text-text-dark">{selectedCustomer.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-1">
                      Registration Date
                    </label>
                    <p className="font-secondary text-text-dark">{formatDate(selectedCustomer.registeredAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAccountManagement