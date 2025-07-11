import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { submitFeedback } from '../services/feedbackService'

const FeedbackPage: React.FC = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [userId, setUserId] = useState<number | null>(null)
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    const userJson = localStorage.getItem('ghsms_user')
    const user = userJson ? JSON.parse(userJson) : null
    setUserId(user?.userId ?? null)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để gửi feedback.')
      return
    }

    try {
      await submitFeedback({
        userId,
        relatedServiceId: Number(serviceId),
        rating,
        comment
      })
      
      navigate('/services')
    } catch (error: any) {
      console.error('Gửi feedback thất bại:', error)
      navigate('/services')
    }
  }

  if (!userId) {
    return (
      <div className="text-center text-red-600 mt-10">
        Bạn chưa đăng nhập. Vui lòng đăng nhập để gửi feedback.
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Gửi đánh giá</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Đánh giá (1–5):
          <input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border p-2 mt-1"
            required
          />
        </label>
        <label className="block">
          Nhận xét:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 mt-1"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gửi đánh giá
        </button>
      </form>
    </div>
  )
}

export default FeedbackPage
