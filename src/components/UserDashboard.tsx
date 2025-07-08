import React, { useState, useEffect } from 'react'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const UserDashboard: React.FC = () => {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')
  const [expandedResult, setExpandedResult] = useState<number | null>(null)
  const [pillReminder, setPillReminder] = useState(false)

  // Initialize pill reminder from user profile
  useEffect(() => {
    if (user?.wantsCycleNotifications) {
      setPillReminder(user.wantsCycleNotifications)
    }
  }, [user])

  const testResults = [
    {
      id: 1,
      title: "Gói Xét Nghiệm STIs Cơ Bản - 01/07/2025",
      status: "Đã có kết quả",
      date: "01/07/2025",
      results: [
        { test: "HIV", result: "Âm tính", status: "normal" },
        { test: "Syphilis", result: "Âm tính", status: "normal" },
        { test: "Chlamydia", result: "Âm tính", status: "normal" },
        { test: "Gonorrhea", result: "Âm tính", status: "normal" }
      ]
    },
    {
      id: 2,
      title: "Xét nghiệm HIV Combo - 15/06/2025",
      status: "Đã có kết quả",
      date: "15/06/2025",
      results: [
        { test: "HIV Combo", result: "Âm tính", status: "normal" }
      ]
    }
  ]

  const sidebarItems = [
    { id: 'dashboard', text: 'Tổng quan', icon: HomeIcon },
    { id: 'test-results', text: 'Kết quả Xét nghiệm', icon: DocumentTextIcon },
    { id: 'menstrual-cycle', text: 'Chu kỳ của tôi', icon: CalendarIcon },
    { id: 'account', text: 'Tài khoản', icon: UserIcon }
  ]

  const renderDashboardView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-primary font-semibold text-text-dark">Tổng quan</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <h3 className="font-primary font-semibold text-text-dark mb-4">Xét nghiệm gần đây</h3>
          <p className="font-secondary text-gray-600 mb-4">
            Bạn có {testResults.length} kết quả xét nghiệm
          </p>
          <button 
            onClick={() => setActiveView('test-results')}
            className="text-primary font-secondary font-semibold hover:text-primary-600"
          >
            Xem tất cả →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <h3 className="font-primary font-semibold text-text-dark mb-4">Chu kỳ kinh nguyệt</h3>
          <p className="font-secondary text-gray-600 mb-4">
            Ngày rụng trứng dự kiến: 20/07/2025
          </p>
          <button 
            onClick={() => setActiveView('menstrual-cycle')}
            className="text-primary font-secondary font-semibold hover:text-primary-600"
          >
            Theo dõi chu kỳ →
          </button>
        </div>
      </div>
    </div>
  )

  const renderTestResultsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-primary font-semibold text-text-dark">Kết quả Xét nghiệm của bạn</h2>
      
      {testResults.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border-subtle">
          <h3 className="text-xl font-primary font-semibold text-text-dark mb-4">
            Bắt đầu hành trình sức khỏe của bạn
          </h3>
          <p className="font-secondary text-gray-600 mb-6">
            Sau khi xét nghiệm hoàn tất, bạn có thể kiểm tra trạng thái và xem kết quả tại đây.
          </p>
          <button className="bg-primary text-text-light px-6 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors">
            Đặt lịch xét nghiệm
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {testResults.map((result) => (
            <div key={result.id} className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
              <button
                onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-primary font-semibold text-text-dark">{result.title}</h3>
                  <p className="font-secondary text-green-600 text-sm mt-1">{result.status}</p>
                </div>
                {expandedResult === result.id ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {expandedResult === result.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="mt-4">
                    <h4 className="font-primary font-semibold text-text-dark mb-3">Chi tiết kết quả:</h4>
                    <div className="space-y-2">
                      {result.results.map((test, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="font-secondary text-text-dark">{test.test}</span>
                          <span className={`font-secondary font-semibold ${
                            test.status === 'normal' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {test.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderMenstrualCycleView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-primary font-semibold text-text-dark">Theo dõi chu kỳ</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <h3 className="font-primary font-semibold text-text-dark mb-4">Ghi nhận kỳ kinh</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-secondary text-text-dark mb-2">Ngày bắt đầu</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-secondary text-text-dark mb-2">Độ dài kỳ kinh (ngày)</label>
              <input 
                type="number" 
                placeholder="5"
                className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="w-full bg-primary text-text-light py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors">
              Lưu
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
          <h3 className="font-primary font-semibold text-text-dark mb-4">Dự đoán</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-secondary text-text-dark">Ngày rụng trứng dự kiến</span>
              <span className="font-secondary font-semibold text-primary">20/07/2025</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-secondary text-text-dark">Cửa sổ thụ thai</span>
              <span className="font-secondary font-semibold text-primary">15/07 - 20/07/2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-primary font-semibold text-text-dark">Nhắc nhở uống thuốc hàng ngày</h3>
            <p className="font-secondary text-gray-600 text-sm mt-1">
              Nhận thông báo nhắc nhở uống thuốc tránh thai
            </p>
          </div>
          <button
            onClick={() => setPillReminder(!pillReminder)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              pillReminder ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pillReminder ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )

  const renderAccountView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-primary font-semibold text-text-dark">Tài khoản</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
        <h3 className="font-primary font-semibold text-text-dark mb-6">Thông tin liên hệ</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-secondary text-text-dark mb-2">Họ</label>
            <input 
              type="text" 
              value={user?.lastName || ''}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-secondary text-text-dark mb-2">Tên</label>
            <input 
              type="text" 
              value={user?.firstName || ''}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-secondary text-text-dark mb-2">Email</label>
            <input 
              type="email" 
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block font-secondary text-text-dark mb-2">Số điện thoại</label>
            <input 
              type="tel" 
              value={user?.phoneNumber || ''}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-primary text-text-light px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case 'test-results':
        return renderTestResultsView()
      case 'menstrual-cycle':
        return renderMenstrualCycleView()
      case 'account':
        return renderAccountView()
      default:
        return renderDashboardView()
    }
  }

  return (
    <div className="bg-background-light min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle sticky top-8">
              <h3 className="font-primary font-semibold text-text-dark mb-6">
                Xin chào, {user?.firstName || 'Người dùng'}
              </h3>
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-secondary transition-colors ${
                        activeView === item.id
                          ? 'bg-primary-light text-primary'
                          : 'text-text-dark hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.text}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
          

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
           {/* Back to Home */}
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="font-secondary text-gray-600 hover:text-primary transition-colors"
          >
            ← Quay về trang chủ
          </a>
        </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard