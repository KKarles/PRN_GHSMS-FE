import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BeakerIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const ManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Manager Navigation */}
      <nav className="bg-white shadow-sm border-b border-border-subtle">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Navigation Items */}
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/manager/dashboard')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-secondary font-medium bg-primary-light text-primary border-b-2 border-primary"
              >
                <BeakerIcon className="h-5 w-5 mr-2" />
                Tổng quan
              </button>
              <button
                onClick={() => navigate('/manager/samples')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-secondary font-medium text-gray-600 hover:text-primary hover:bg-primary-light"
              >
                <BeakerIcon className="h-5 w-5 mr-2" />
                Quản lý Mẫu
              </button>
              <button
                onClick={() => navigate('/manager/my-profile')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-secondary font-medium text-gray-600 hover:text-primary hover:bg-primary-light"
              >
                <UserCircleIcon className="h-5 w-5 mr-2" />
                Hồ Sơ Của Tôi
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-secondary font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-primary font-semibold text-text-dark mb-2">
              Chào mừng, {user?.firstName} {user?.lastName}
            </h1>
            <p className="font-secondary text-gray-600">
              Dashboard Quản lý - Quản lý mẫu xét nghiệm
            </p>
          </div>

          {/* Quick Actions - Only Sample Management */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
            <h2 className="text-xl font-primary font-semibold text-text-dark mb-6">
              Thao tác nhanh
            </h2>
            
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/manager/samples')}
                className="flex items-center justify-center p-6 border-2 border-primary text-primary rounded-xl hover:bg-primary-light transition-colors w-64"
              >
                <BeakerIcon className="h-8 w-8 mr-4" />
                <span className="font-secondary font-semibold text-lg">Quản lý Mẫu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard