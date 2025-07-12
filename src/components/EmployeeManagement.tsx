import React, { useState, useEffect } from 'react'
import {
  UserGroupIcon,
  AcademicCapIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { getEmployees, getEmployeeQualification, filterEmployeesByRole, type Employee, type EmployeeQualification } from '../services/employeeService'

interface EmployeeManagementProps {
  onClose: () => void
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ onClose }) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [selectedRole, setSelectedRole] = useState<'All' | 'Staff' | 'Consultant'>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employeeQualification, setEmployeeQualification] = useState<EmployeeQualification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingQualification, setIsLoadingQualification] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    filterAndSearchEmployees()
  }, [employees, selectedRole, searchTerm])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const data = await getEmployees()
      setEmployees(data)
    } catch (err) {
      setError('Không thể tải danh sách nhân viên')
      console.error('Failed to fetch employees:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSearchEmployees = () => {
    let filtered = filterEmployeesByRole(employees, selectedRole)
    
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredEmployees(filtered)
  }

  const handleEmployeeClick = async (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsLoadingQualification(true)
    setEmployeeQualification(null)
    
    try {
      const qualification = await getEmployeeQualification(employee.userId)
      setEmployeeQualification(qualification)
    } catch (err) {
      console.error('Failed to fetch employee qualification:', err)
    } finally {
      setIsLoadingQualification(false)
    }
  }

  const getRoleColor = (roles: string[]) => {
    if (roles.includes('Staff')) {
      return 'bg-blue-100 text-blue-800'
    } else if (roles.includes('Consultant')) {
      return 'bg-green-100 text-green-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const getRoleText = (roles: string[]) => {
    if (roles.includes('Staff')) {
      return 'Nhân viên'
    } else if (roles.includes('Consultant')) {
      return 'Chuyên gia tư vấn'
    }
    return roles.join(', ')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-primary font-semibold text-text-dark">
              Quản lý Nhân viên
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Employee List */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Filters and Search */}
            <div className="p-4 border-b border-gray-200 space-y-4">
              {/* Role Filter */}
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Lọc theo vai trò
                </label>
                <div className="flex space-x-2">
                  {(['All', 'Staff', 'Consultant'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-4 py-2 rounded-lg text-sm font-secondary font-medium transition-colors ${
                        selectedRole === role
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {role === 'All' ? 'Tất cả' : role === 'Staff' ? 'Nhân viên' : 'Chuyên gia tư vấn'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên hoặc email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Employee List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="text-gray-600">Đang tải...</div>
                </div>
              ) : error ? (
                <div className="p-4 text-red-600 text-center">{error}</div>
              ) : filteredEmployees.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  Không tìm thấy nhân viên nào
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.userId}
                      onClick={() => handleEmployeeClick(employee)}
                      className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedEmployee?.userId === employee.userId ? 'bg-primary-light border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-secondary font-semibold text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.roles)}`}>
                          {getRoleText(employee.roles)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          {employee.email}
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          {employee.phoneNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Employee Details */}
          <div className="w-1/2 flex flex-col">
            {selectedEmployee ? (
              <div className="flex-1 overflow-y-auto p-6">
                {/* Employee Info */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <UserIcon className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-xl font-primary font-semibold text-text-dark">
                      Thông tin nhân viên
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-secondary font-medium text-gray-500 mb-1">
                        Họ và tên
                      </label>
                      <p className="text-gray-900">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-secondary font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        <p className="text-gray-900">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-secondary font-medium text-gray-500 mb-1">
                          Số điện thoại
                        </label>
                        <p className="text-gray-900">{selectedEmployee.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-secondary font-medium text-gray-500 mb-1">
                          Vai trò
                        </label>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedEmployee.roles)}`}>
                          {getRoleText(selectedEmployee.roles)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-secondary font-medium text-gray-500 mb-1">
                          Ngày tham gia
                        </label>
                        <p className="text-gray-900">
                          Chưa có thông tin
                        </p>
                      </div>
                    </div>

                    {selectedEmployee.dateOfBirth && (
                      <div>
                        <label className="block text-sm font-secondary font-medium text-gray-500 mb-1">
                          Ngày sinh
                        </label>
                        <p className="text-gray-900">
                          {new Date(selectedEmployee.dateOfBirth).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <div className="flex items-center mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-xl font-primary font-semibold text-text-dark">
                      Trình độ chuyên môn
                    </h3>
                  </div>

                  {isLoadingQualification ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="text-gray-600">Đang tải trình độ chuyên môn...</div>
                    </div>
                  ) : employeeQualification ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-secondary font-medium text-gray-500 mb-2">
                          Bằng cấp & Chứng chỉ
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {employeeQualification.qualifications}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-secondary font-medium text-gray-500 mb-2">
                          Kinh nghiệm làm việc
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {employeeQualification.experience}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-secondary font-medium text-gray-500 mb-2">
                          Chuyên môn
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {employeeQualification.specialization}
                          </p>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Nhân viên này chưa cập nhật thông tin trình độ chuyên môn
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Chọn một nhân viên để xem thông tin chi tiết
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeManagement