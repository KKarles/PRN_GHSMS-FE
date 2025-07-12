import React, { useState, useEffect } from 'react'
import {
  UserCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import ManagerNavigation from './ManagerNavigation'
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

const ManagerProfile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

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

  return (
    <div className="min-h-screen bg-background-light">
      <ManagerNavigation />
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
        </div>
      </div>
    </div>
  )
}

export default ManagerProfile