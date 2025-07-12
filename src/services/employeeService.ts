import api from './api'

export interface Employee {
  userId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth?: string
  sex?: string
  wantsCycleNotifications: boolean
  pillReminderTime?: string | null
  roles: string[]
}

export interface EmployeeQualification {
  consultantId: number
  firstName: string
  lastName: string
  email: string
  qualifications: string
  experience: string
  specialization: string
  hasProfile: boolean
}

// API response might be direct array or wrapped in response object
export type EmployeesResponse = Employee[] | {
  success: boolean
  message: string
  data: Employee[]
}

// API returns direct array, not wrapped in response object
export type AllQualificationsResponse = EmployeeQualification[]

// Cache for all qualifications to avoid multiple API calls
let allQualificationsCache: EmployeeQualification[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Get all employees (staff and consultants)
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await api.get<EmployeesResponse>('/api/Users/employees')
    
    // Handle both direct array response and wrapped response
    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data && typeof response.data === 'object' && 'success' in response.data && response.data.success) {
      return response.data.data
    }
    
    throw new Error('Failed to fetch employees')
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

// Get all staff qualifications
export const getAllStaffQualifications = async (): Promise<EmployeeQualification[]> => {
  try {
    // Check cache first
    const now = Date.now()
    if (allQualificationsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Using cached qualifications:', allQualificationsCache)
      return allQualificationsCache
    }

    console.log('Fetching qualifications from API...')
    const response = await api.get('/api/staffqualification')
    console.log('Full API response:', response)
    console.log('Response data:', response.data)
    console.log('Response data type:', typeof response.data)
    console.log('Is array?', Array.isArray(response.data))
    
    // Handle different response formats
    let qualifications: EmployeeQualification[] = []
    
    if (Array.isArray(response.data)) {
      qualifications = response.data
    } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
      qualifications = response.data.data
    } else if (response.data && Array.isArray(response.data.result)) {
      qualifications = response.data.result
    } else {
      console.error('Unexpected response format:', response.data)
      throw new Error('Invalid response format')
    }
    
    allQualificationsCache = qualifications
    cacheTimestamp = now
    console.log('Cached qualifications:', allQualificationsCache)
    return qualifications
  } catch (error) {
    console.error('Error fetching all staff qualifications:', error)
    throw error
  }
}

// Get employee qualification by userId (using cached data from getAllStaffQualifications)
export const getEmployeeQualification = async (userId: number): Promise<EmployeeQualification | null> => {
  try {
    console.log('Getting qualification for userId:', userId)
    const allQualifications = await getAllStaffQualifications()
    console.log('All qualifications:', allQualifications)
    // Match by consultantId since API uses consultantId instead of userId
    const qualification = allQualifications.find(qual => qual.consultantId === userId) || null
    console.log('Found qualification for user:', qualification)
    return qualification
  } catch (error) {
    console.error('Error fetching employee qualification:', error)
    throw error
  }
}

// Clear cache (useful when qualifications are updated)
export const clearQualificationsCache = (): void => {
  allQualificationsCache = null
  cacheTimestamp = 0
}

// Filter employees by role
export const filterEmployeesByRole = (employees: Employee[], role: 'Staff' | 'Consultant' | 'All'): Employee[] => {
  if (role === 'All') {
    return employees.filter(emp => emp.roles.includes('Staff') || emp.roles.includes('Consultant'))
  }
  return employees.filter(emp => emp.roles.includes(role))
}

export default {
  getEmployees,
  getEmployeeQualification,
  getAllStaffQualifications,
  clearQualificationsCache,
  filterEmployeesByRole
}