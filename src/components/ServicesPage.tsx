import React, { useEffect, useState } from 'react'
import { getServices } from '../services/serviceService'
import type { Service } from '../services/serviceService'
import { Link } from 'react-router-dom'
import { getFeedbackByUserAndService } from '../services/feedbackService'
import { isAuthenticated } from '../services/authService'
import { motion } from 'framer-motion'

const truncateWords = (text: string, maxWords: number): string => {
  const words = text.split(/\s+/)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(' ') + '...'
}

const ServicesPage: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [feedbacks, setFeedbacks] = useState<Record<number, number>>({})

  useEffect(() => {
    const userJson = localStorage.getItem('ghsms_user')
    const user = userJson ? JSON.parse(userJson) : null
    setUserId(user?.userId ?? null)
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices()
        setServices(data)

        if (isAuthenticated() && userId) {
          const feedbackMap: Record<number, number> = {}
          for (const s of data) {
            try {
              const feedback = await getFeedbackByUserAndService(userId, s.serviceId)
              if (feedback?.feedbackId) {
                feedbackMap[s.serviceId] = feedback.feedbackId
              }
            } catch (err: any) {
              if (err.response && err.response.status !== 404) {
                console.error(`Lỗi khi lấy feedback cho serviceId ${s.serviceId}:`, err)
              }
            }
          }
          setFeedbacks(feedbackMap)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [userId])

  if (loading) return <p className="text-center text-lg mt-10">⏳ Đang tải dữ liệu dịch vụ...</p>
  if (error) return <p className="text-center text-red-500 mt-10">❌ Lỗi: {error}</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">🌿 Danh sách dịch vụ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.serviceId}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 p-6"
          >
            <h2 className="text-2xl font-semibold text-indigo-700">{service.serviceName}</h2>
            <p className="text-gray-600 mt-2 italic">{truncateWords(service.description, 10)}</p>
            <p className="mt-3 text-lg text-blue-600 font-semibold">
              💰 {service.price.toLocaleString()} VND
            </p>
            <div className="space-y-1">
              <Link
                to={`/feedbacks/${service.serviceId}`}
                className="block text-indigo-600 hover:underline"
              >
                🔍 Xem đánh giá
              </Link>

              {isAuthenticated() ? (
                feedbacks[service.serviceId] ? (
                  <Link
                    to={`/edit-feedback/${feedbacks[service.serviceId]}`}
                    className="block text-green-600 hover:underline"
                  >
                    ✏️ Chỉnh sửa đánh giá
                  </Link>
                ) : (
                  <Link
                    to={`/create-feedback/${service.serviceId}`}
                    className="block text-blue-600 hover:underline"
                  >
                    ✍️ Gửi đánh giá
                  </Link>
                )
              ) : (
                <p className="text-sm text-red-500 mt-2">* Đăng nhập để gửi đánh giá</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ServicesPage
