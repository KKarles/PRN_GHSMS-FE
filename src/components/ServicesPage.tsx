import React, { useEffect, useState } from 'react'
import { getServices } from '../services/serviceService'
import type { Service } from '../services/serviceService'
import { Link } from 'react-router-dom'
import { getFeedbackByUserAndService } from '../services/feedbackService'
import { isAuthenticated } from '../services/authService'

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

  if (loading) return <p className="text-center">Đang tải dữ liệu dịch vụ...</p>
  if (error) return <p className="text-center text-red-500">Lỗi: {error}</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Danh sách dịch vụ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.serviceId} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{service.serviceName}</h2>
            <p className="text-gray-600 mt-2">
              {truncateWords(service.description, 10)}
            </p>
            <p className="mt-2 text-primary font-bold">{service.price.toLocaleString()} VND</p>
            <p className="text-sm text-gray-500">{service.category}</p>

            <Link
              to={`/feedbacks/${service.serviceId}`}
              className="inline-block mt-2 text-indigo-600 hover:underline"
            >
              Xem đánh giá
            </Link>
            <br></br>
            {isAuthenticated() ? (
              feedbacks[service.serviceId] ? (
                <Link
                  to={`/edit-feedback/${feedbacks[service.serviceId]}`}
                  className="inline-block mt-3 text-green-600 hover:underline"
                >
                  Chỉnh sửa đánh giá
                </Link>
              ) : (
                <Link
                  to={`/create-feedback/${service.serviceId}`}
                  className="inline-block mt-3 text-blue-600 hover:underline"
                >
                  Gửi đánh giá
                </Link>
              )
            ) : (
              <p className="text-sm text-red-500 mt-3">* Đăng nhập để gửi đánh giá</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServicesPage
