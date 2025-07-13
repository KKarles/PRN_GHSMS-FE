import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'
import Services from './components/Services'
import About from './components/About'
import Blog from './components/Blog'
import BlogRoute from './components/BlogRoute'
import BlogController from './components/BlogController'
import Login from './components/Login'
import Register from './components/Register'
import UserDashboard from './components/UserDashboard'
import ConsultantDashboard from './components/ConsultantDashboard'
import ServiceBookingPage from './components/ServiceBookingPage'
import StaffDashboard from './components/StaffDashboard'
import StaffReports from './components/StaffReports'
import CustomerLookup from './components/CustomerLookup'
import SampleManagement from './components/SampleManagement'
import StaffProfile from './components/StaffProfile'
import ManagerDashboard from './components/ManagerDashboard'
import ManagerEmployees from './components/ManagerEmployees'
import AdminDashboard from './components/AdminDashboard'
import AdminAccountManagement from './components/AdminAccountManagement'
import AdminQualificationManagement from './components/AdminQualificationManagement'
import AdminProfile from './components/AdminProfile'
import ManagerReports from './components/ManagerReports'
import ManagerProfile from './components/ManagerProfile'
import ManagerQualificationManagement from './components/ManagerQualificationManagement'
import ConsultantProfile from './components/ConsultantProfile'
import ProtectedRoute from './components/ProtectedRoute'
import ServicesPage from './components/ServicesPage'
import FeedbackPage from './components/Feedback'
import EditFeedbackPage from './components/EditFeedbackPage'
import FeedbackListPage from './components/FeedbackListPage'

// Route Guard Component to handle unwanted redirects
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Check for unwanted paths and redirect to home
    const unwantedPaths = ['/msedge', '/edge', '/chrome', '/firefox', '/safari']
    const currentPath = location.pathname.toLowerCase()
    
    if (unwantedPaths.some(path => currentPath.includes(path))) {
      console.warn('Detected unwanted redirect to:', currentPath, 'Redirecting to home...')
      navigate('/', { replace: true })
      return
    }

    // Additional check for browser-specific redirects
    if (currentPath.includes('browser') || currentPath.includes('extension')) {
      console.warn('Detected browser extension redirect, going to home...')
      navigate('/', { replace: true })
      return
    }
  }, [location.pathname, navigate])

  return <>{children}</>
}

// Layout component for pages with header and footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen">
    <Header />
    <RouteGuard>
      {children}
    </RouteGuard>
    <Footer />
  </div>
)

// Layout component for auth pages (no header/footer)
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen">
    <RouteGuard>
      {children}
    </RouteGuard>
  </div>
)

// Blog Route with role-based access
const BlogManagementRoute: React.FC<{ userRole: 'admin' | 'author' }> = ({ userRole }) => {
  return (
    <ProtectedRoute>
      <Layout>
        <BlogController userRole={userRole} />
      </Layout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Catch unwanted browser redirects */}
          <Route path="/msedge" element={<Navigate to="/" replace />} />
          <Route path="/edge" element={<Navigate to="/" replace />} />
          <Route path="/chrome" element={<Navigate to="/" replace />} />
          <Route path="/firefox" element={<Navigate to="/" replace />} />
          <Route path="/safari" element={<Navigate to="/" replace />} />
          
          {/* Public Routes with Header/Footer */}
          <Route path="/" element={
            <Layout>
              <LandingPage />
            </Layout>
          } />
          
          <Route path="/services" element={
            <Layout>
              <ServicesPage />
            </Layout>
          } />
          
          <Route path="/about" element={
            <Layout>
              <About />
            </Layout>
          } />
          
          <Route path="/blog" element={
            <Layout>
              <Blog />
            </Layout>
          } />
          
          <Route path="/blog/:id" element={
            <Layout>
              <BlogRoute />
            </Layout>
          } />

          {/* Blog Management Routes - Protected with role-based access */}
          <Route path="/blog-admin" element={
            <ProtectedRoute requiredRoles={['Admin', 'Manager']}>
              <Layout>
                <BlogController userRole="admin" />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/my-blog" element={
            <ProtectedRoute>
              <Layout>
                <BlogController userRole="author" />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Auth Routes (no header/footer) */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />

          <Route path="/register" element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRoles={['Customer']}>
              <Layout>
                <UserDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/consultant-dashboard" element={
            <ProtectedRoute requiredRoles={['Consultant']}>
              <ConsultantDashboard />
            </ProtectedRoute>
          } />

          <Route path="/book-service" element={
            <ProtectedRoute>
              <Layout>
                <ServiceBookingPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Staff Routes */}
          <Route path="/staff/dashboard" element={
            <ProtectedRoute requiredRoles={['Staff', 'Manager', 'Admin']}>
              <StaffDashboard />
            </ProtectedRoute>
          } />

          <Route path="/staff/samples" element={
            <ProtectedRoute requiredRoles={['Staff', 'Manager', 'Admin']}>
              <SampleManagement />
            </ProtectedRoute>
          } />

          <Route path="/staff/my-profile" element={
            <ProtectedRoute requiredRoles={['Staff', 'Manager', 'Admin']}>
              <StaffProfile />
            </ProtectedRoute>
          } />

          {/* Consultant Routes */}
          <Route path="/consultant/dashboard" element={
            <ProtectedRoute requiredRoles={['Consultant']}>
              <ConsultantDashboard />
            </ProtectedRoute>
          } />

          <Route path="/consultant/my-profile" element={
            <ProtectedRoute requiredRoles={['Consultant']}>
              <ConsultantProfile />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={
            <ProtectedRoute requiredRoles={['Manager', 'Admin']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/manager/reports" element={
            <ProtectedRoute requiredRoles={['Manager', 'Admin']}>
              <ManagerReports />
            </ProtectedRoute>
          } />

          <Route path="/manager/employees" element={
            <ProtectedRoute requiredRoles={['Manager', 'Admin']}>
              <ManagerEmployees />
            </ProtectedRoute>
          } />

          <Route path="/manager/qualifications" element={
            <ProtectedRoute requiredRoles={['Manager', 'Admin']}>
              <ManagerQualificationManagement />
            </ProtectedRoute>
          } />

          <Route path="/manager/my-profile" element={
            <ProtectedRoute requiredRoles={['Manager', 'Admin']}>
              <ManagerProfile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/accounts" element={
            <ProtectedRoute requiredRoles={['Admin']}>
              <AdminAccountManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/qualifications" element={
            <ProtectedRoute requiredRoles={['Admin']}>
              <AdminQualificationManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/my-profile" element={
            <ProtectedRoute requiredRoles={['Admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />

          {/* Feedback Routes */}
          <Route path="/create-feedback/:serviceId" element={
            <ProtectedRoute>
              <Layout>
                <FeedbackPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/edit-feedback/:feedbackId" element={
            <ProtectedRoute>
              <Layout>
                <EditFeedbackPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/feedbacks/:serviceId" element={
            <Layout>
              <FeedbackListPage />
            </Layout>
          } />

          {/* Forgot Password */}
          <Route path="/forgot-password" element={
            <AuthLayout>
              <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-primary font-semibold text-text-dark mb-4">
                    Quên Mật Khẩu
                  </h2>
                  <p className="font-secondary text-gray-600 mb-6">
                    Tính năng quên mật khẩu sẽ được triển khai sau
                  </p>
                  <button 
                    onClick={() => window.history.back()}
                    className="bg-primary text-text-light px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            </AuthLayout>
          } />

          {/* 404 Page */}
          <Route path="*" element={
            <Layout>
              <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl font-primary font-semibold text-text-dark mb-4">
                    404
                  </h2>
                  <p className="font-secondary text-gray-600 mb-6">
                    Trang bạn tìm kiếm không tồn tại
                  </p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="bg-primary text-text-light px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App