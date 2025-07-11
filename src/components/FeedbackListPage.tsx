import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFeedbacksByService, getUserById } from '../services/feedbackService'
import { getService } from '../services/serviceService'
import { motion } from 'framer-motion'

interface Feedback {
  feedbackId: number
  userId: number
  rating: number
  comment: string
}

interface UserNameMap {
  [userId: number]: string
}

const FeedbackListPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>()
  const [serviceName, setServiceName] = useState<string>('')
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [userNames, setUserNames] = useState<UserNameMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!serviceId) throw new Error('Thiếu serviceId')

        const service = await getService(Number(serviceId))
        setServiceName(service.serviceName)

        const feedbackList = await getFeedbacksByService(Number(serviceId))
        setFeedbacks(feedbackList)

        const nameMap: UserNameMap = {}
        for (const fb of feedbackList) {
          if (!nameMap[fb.userId]) {
            try {
              const user = await getUserById(fb.userId)
              nameMap[fb.userId] = `${user.firstName} ${user.lastName}`
            } catch {
              nameMap[fb.userId] = `Người dùng #${fb.userId}`
            }
          }
        }
        setUserNames(nameMap)
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [serviceId])

  if (loading) return <p className="text-center text-lg text-gray-500 mt-10">Đang tải đánh giá...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl border border-gray-100"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Đánh giá dịch vụ</h1>
      <h2 className="text-4xl text-center text-blue-600 font-semibold mb-8">{serviceName}</h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có đánh giá nào.</p>
      ) : (
        <ul className="space-y-6">
          {feedbacks.map((fb, idx) => (
            <motion.li
              key={fb.feedbackId}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-lg text-gray-800">
                  {userNames[fb.userId] || `Người dùng #${fb.userId}`}
                </p>
                <p className="text-5xl text-yellow-500 font-bold text-sm">
                  {fb.rating} <span className="text-yellow-400">★</span>
                </p>
              </div>
              <p className="text-gray-700 text-base whitespace-pre-wrap">{fb.comment}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

export default FeedbackListPage
