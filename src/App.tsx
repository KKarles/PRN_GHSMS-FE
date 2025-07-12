import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'
import Blog from './components/Blog'
import BlogRoute from './components/BlogRoute'
import BlogController from './components/BlogController' // Add this import
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
import QuestionsPage from './components/QuestionsPage'
import QuestionDetailPage from './components/QuestionDetailPage'
import AskQuestionPage from './components/AskQuestionPage'
import ServicesPage from './components/ServicesPage'
import FeedbackPage from './components/Feedback'
import EditFeedbackPage from './components/EditFeedbackPage'
import FeedbackListPage from './components/FeedbackListPage'


// Layout component for pages with header and footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen">
    <Header />
    {children}
    <Footer />
  </div>
)

// Layout component for auth pages (no header/footer)
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen">
    {children}
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Header/Footer */}
          <Route path="/" element={
            <Layout>
              <LandingPage />
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

        <Route path="/questions" element={
          <Layout>
            <QuestionsPage />
          </Layout>
        } />

        <Route path="/questions/ask" element={
          <Layout>
            <AskQuestionPage />
          </Layout>
        } />

        <Route path="/questions/:questionId" element={
          <Layout>
            <QuestionDetailPage />
          </Layout>
        } />
          {/* Blog Management Route - Protected */}
          <Route path="/blog-admin" element={
            <ProtectedRoute>
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
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          } />

          {/* Removed staff access to reports and customer management - not their job */}
          {/* <Route path="/staff/reports" element={
            <ProtectedRoute>
              <StaffReports />
            </ProtectedRoute>
          } />

          <Route path="/staff/customers" element={
            <ProtectedRoute>
              <CustomerLookup />
            </ProtectedRoute>
          } /> */}

          <Route path="/staff/samples" element={
            <ProtectedRoute>
              <SampleManagement />
            </ProtectedRoute>
          } />

          <Route path="/staff/my-profile" element={
            <ProtectedRoute>
              <StaffProfile />
            </ProtectedRoute>
          } />

          {/* Consultant Routes */}
          <Route path="/consultant/dashboard" element={
            <ProtectedRoute>
              <ConsultantDashboard />
            </ProtectedRoute>
          } />

          <Route path="/consultant/my-profile" element={
            <ProtectedRoute>
              <ConsultantProfile />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/manager/reports" element={
            <ProtectedRoute>
              <ManagerReports />
            </ProtectedRoute>
          } />

          <Route path="/manager/employees" element={
            <ProtectedRoute>
              <ManagerEmployees />
            </ProtectedRoute>
          } />

          <Route path="/manager/qualifications" element={
            <ProtectedRoute>
              <ManagerQualificationManagement />
            </ProtectedRoute>
          } />

          <Route path="/manager/my-profile" element={
            <ProtectedRoute>
              <ManagerProfile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/accounts" element={
            <ProtectedRoute>
              <AdminAccountManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/qualifications" element={
            <ProtectedRoute>
              <AdminQualificationManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/my-profile" element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          } />

          {/* Registration Route */}
          <Route path="/register" element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          } />

          <Route path="/forgot-password" element={
            <AuthLayout>
              <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-primary font-semibold text-text-dark mb-4">
                    Quen Mat Khau
                  </h2>
                  <p className="font-secondary text-gray-600 mb-6">
                    Tinh nang quen mat khau se duoc trien khai sau
                  </p>
                  <button 
                    onClick={() => window.history.back()}
                    className="bg-primary text-text-light px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
                  >
                    Quay lai
                  </button>
                </div>
              </div>
            </AuthLayout>
          } />

          <Route path="/services" element={
          <Layout>
            <ServicesPage />
          </Layout>
        } />

        <Route path="/create-feedback/:serviceId" element={
        <Layout>
          <FeedbackPage />
        </Layout>
      } />

      <Route path="/edit-feedback/:feedbackId" element={
        <Layout>
          <EditFeedbackPage />
        </Layout>
      } />

      <Route path="/feedbacks/:serviceId" element={
        <Layout>
          <FeedbackListPage />
        </Layout>
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
                    Trang ban tim kiem khong ton tai
                  </p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="bg-primary text-text-light px-6 py-2 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
                  >
                    Ve trang chu
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