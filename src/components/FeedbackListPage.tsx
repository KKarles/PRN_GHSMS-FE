// src/pages/FeedbackListPage.tsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFeedbacksByService } from '../services/feedbackService'

interface Feedback {
  feedbackId: number
  userId: number
  rating: number
  comment: string
}

const FeedbackListPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await getFeedbacksByService(Number(serviceId))
        setFeedbacks(data)
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải feedback')
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [serviceId])

  if (loading) return <p className="text-center">Đang tải đánh giá...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Đánh giá dịch vụ #{serviceId}</h1>
      {feedbacks.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li key={fb.feedbackId} className="border p-4 rounded shadow">
              <p className="font-semibold">Người dùng #{fb.userId}</p>
              <p>Đánh giá: {fb.rating} ⭐</p>
              <p className="mt-1">{fb.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FeedbackListPage
