import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserCircleIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth?: string
  sex?: string
}

interface StaffQualification {
  qualifications: string
  experience: string
  specialization: string
}

interface QualificationResponse {
  hasProfile: boolean
  qualifications?: string
  experience?: string
  specialization?: string
}

const ConsultantProfile: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  })
  const [qualification, setQualification] = useState<StaffQualification>({
    qualifications: '',
    experience: '',
    specialization: ''
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingQualification, setIsLoadingQualification] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingQualification, setIsSavingQualification] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [qualificationError, setQualificationError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [qualificationSuccess, setQualificationSuccess] = useState(false)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)

  // Check if user can manage their own qualifications (Staff and Consultant only)
  const canManageOwnQualifications = user?.roles?.some(role => 
    ['Consultant', 'Staff'].includes(role)
  ) || false

  const menuItems = [
    { id: 'dashboard', text: 'Tổng quan', icon: ChartBarIcon, path: '/consultant/dashboard' },
    { id: 'appointments', text: 'Cuộc hẹn', icon: CalendarIcon, path: '/consultant/dashboard' },
    { id: 'settings', text: 'Cài đặt', icon: Cog6ToothIcon, path: '/consultant/dashboard' },
  ]

  const handleMenuClick = (path: string, id: string) => {
    if (id === 'dashboard') {
      navigate(path)
    } else {
      // Navigate to consultant dashboard with specific view
      navigate(path, { state: { activeView: id } })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    fetchProfile()
    if (canManageOwnQualifications) {
      fetchQualification()
    } else {
      setIsLoadingQualification(false)
    }
  }, [canManageOwnQualifications])

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true)
      setProfileError(null)
      
      const response = await api.get('/api/auth/profile')
      const profileData = response.data?.data || response.data
      
      setProfile({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        dateOfBirth: profileData.dateOfBirth || '',
        sex: profileData.sex || ''
      })
      
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      setProfileError('Không thể tải thông tin cá nhân. Vui lòng thử lại.')
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const fetchQualification = async () => {
    try {
      setIsLoadingQualification(true)
      setQualificationError(null)
      
      const response = await api.get('/api/staffqualification/my-qualifications')
      const qualData = response.data?.data || response.data
      
      if (qualData) {
        // Check if response indicates existing profile
        const hasProfile = qualData.hasProfile !== undefined ? qualData.hasProfile : true
        setHasExistingProfile(hasProfile)
        
        if (hasProfile) {
          setQualification({
            qualifications: qualData.qualifications || '',
            experience: qualData.experience || '',
            specialization: qualData.specialization || ''
          })
        }
      }
      
    } catch (error) {
      console.error('Failed to fetch qualification:', error)
      // 404 means no qualification exists yet - this is normal for new staff/consultants
      if ((error as any)?.response?.status === 404) {
        setHasExistingProfile(false)
        setQualification({
          qualifications: '',
          experience: '',
          specialization: ''
        })
      } else {
        setQualificationError('Không thể tải thông tin chuyên môn. Vui lòng thử lại.')
      }
    } finally {
      setIsLoadingQualification(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSavingProfile(true)
      setProfileError(null)
      setProfileSuccess(false)
      
      await api.put('/api/auth/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        dateOfBirth: profile.dateOfBirth || null,
        sex: profile.sex || null
      })
      
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
      
    } catch (error) {
      console.error('Failed to update profile:', error)
      setProfileError('Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleQualificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!qualification.qualifications.trim() || !qualification.experience.trim() || !qualification.specialization.trim()) {
      setQualificationError('Vui lòng điền đầy đủ tất cả các trường bắt buộc.')
      return
    }
    
    try {
      setIsSavingQualification(true)
      setQualificationError(null)
      setQualificationSuccess(false)
      
      // Use intelligent POST vs PUT logic based on hasExistingProfile
      if (hasExistingProfile) {
        // Update existing profile
        await api.put('/api/staffqualification/my-qualifications', qualification)
      } else {
        // Create new profile
        await api.post('/api/staffqualification/my-qualifications', qualification)
        setHasExistingProfile(true) // Update state to reflect new profile exists
      }
      
      setQualificationSuccess(true)
      setTimeout(() => setQualificationSuccess(false), 3000)
      
    } catch (error) {
      console.error('Failed to update qualification:', error)
      setQualificationError('Không thể cập nhật hồ sơ chuyên môn. Vui lòng thử lại.')
    } finally {
      setIsSavingQualification(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Main Navigation */}
      <div className="bg-white shadow-sm mb-6">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200">
            <nav className="flex items-center justify-between px-2">
              {/* Left side - Main menu items */}
              <div className="flex space-x-8">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.path, item.id)}
                      className="flex items-center px-3 py-4 text-sm font-secondary font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.text}
                    </button>
                  )
                })}
              </div>
              
              {/* Right side - Profile and Logout */}
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center px-3 py-2 text-sm font-secondary font-medium text-primary border-b-2 border-primary"
                >
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  Hồ sơ của tôi
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-secondary font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                  Đăng xuất
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Hồ Sơ Của Tôi
            </h1>
            <p className="font-secondary text-gray-600">
              Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
            <div className="flex items-center mb-6">
              <UserCircleIcon className="h-8 w-8 text-primary mr-3" />
              <div>
                <h2 className="text-xl font-primary font-semibold text-text-dark">
                  Thông Tin Cá Nhân
                </h2>
                <p className="font-secondary text-gray-600 text-sm">
                  Quản lý thông tin liên hệ và tài khoản đăng nhập của bạn.
                </p>
              </div>
            </div>

            <hr className="border-gray-200 mb-6" />

            {profileError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-secondary text-sm">{profileError}</p>
              </div>
            )}

            {profileSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-700 font-secondary text-sm">
                    Thông tin cá nhân đã được cập nhật thành công!
                  </p>
                </div>
              </div>
            )}

            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                      Họ *
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                      Tên *
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                </div>

                <div>
                  <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full bg-primary text-white py-3 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSavingProfile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu Thông Tin Cá Nhân'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Professional Profile Card - Only for Staff and Consultant */}
          {canManageOwnQualifications && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center mb-6">
                <AcademicCapIcon className="h-8 w-8 text-primary mr-3" />
                <div>
                  <h2 className="text-xl font-primary font-semibold text-text-dark">
                    Hồ Sơ Chuyên Môn
                  </h2>
                  <p className="font-secondary text-gray-600 text-sm">
                    {user?.roles?.includes('Consultant') 
                      ? 'Thông tin này sẽ được hiển thị công khai trên trang "Đội ngũ tư vấn" của chúng tôi.'
                      : 'Quản lý thông tin chuyên môn và kinh nghiệm làm việc của bạn.'
                    }
                  </p>
                </div>
              </div>

              <hr className="border-gray-200 mb-6" />

              {/* Qualification Error */}
              {qualificationError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-secondary text-sm">{qualificationError}</p>
                </div>
              )}

              {/* Qualification Success */}
              {qualificationSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-700 font-secondary text-sm">
                      Hồ sơ chuyên môn đã được cập nhật thành công!
                    </p>
                  </div>
                </div>
              )}

              {/* Qualification Form */}
              {isLoadingQualification ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <form onSubmit={handleQualificationSubmit} className="space-y-4">
                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                      Bằng cấp & Chứng chỉ *
                    </label>
                    <textarea
                      value={qualification.qualifications}
                      onChange={(e) => setQualification(prev => ({ ...prev, qualifications: e.target.value }))}
                      placeholder="VD: Thạc sĩ Tâm lý học, Chứng chỉ Tư vấn Sức khỏe Giới tính..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                      Kinh nghiệm *
                    </label>
                    <textarea
                      value={qualification.experience}
                      onChange={(e) => setQualification(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="VD: 5 năm kinh nghiệm làm việc tại Bệnh viện Phụ sản..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-secondary text-gray-700 text-sm font-medium mb-2">
                      Lĩnh vực chuyên môn *
                    </label>
                    <input
                      type="text"
                      value={qualification.specialization}
                      onChange={(e) => setQualification(prev => ({ ...prev, specialization: e.target.value }))}
                      placeholder="VD: Sức khỏe sinh sản, STIs, Tư vấn thanh thiếu niên"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Các lĩnh vực cách nhau bởi dấu phẩy.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingQualification}
                    className="w-full bg-primary text-white py-3 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSavingQualification ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang cập nhật...
                      </>
                    ) : (
                      'Cập nhật Hồ Sơ Chuyên Môn'
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConsultantProfile