import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Login from './components/Login'
import Register from './components/Register'
import UserDashboard from './components/UserDashboard'
import ServiceBookingPage from './components/ServiceBookingPage'
import ProtectedRoute from './components/ProtectedRoute'

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
              <BlogPost />
            </Layout>
          } />

          {/* Auth Routes (no header/footer) */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <UserDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/book-service" element={
            <ProtectedRoute>
              <Layout>
                <ServiceBookingPage />
              </Layout>
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