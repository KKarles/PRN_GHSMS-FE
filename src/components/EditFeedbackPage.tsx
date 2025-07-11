import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { updateFeedback, getFeedbackById, deleteFeedback } from '../services/feedbackService'

const EditFeedbackPage: React.FC = () => {
  const { feedbackId } = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        if (!feedbackId) throw new Error('Thiếu feedbackId')
        const feedback = await getFeedbackById(Number(feedbackId))
        setRating(feedback.rating)
        setComment(feedback.comment)
      } catch (error) {
        alert('Không tìm thấy đánh giá!')
        navigate('/services')
      }
    }

    fetchFeedback()
  }, [feedbackId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!feedbackId) throw new Error('Thiếu feedbackId')
      await updateFeedback(Number(feedbackId), { rating, comment })
      navigate('/services')
    } catch (error) {
      alert('Lỗi khi cập nhật đánh giá!')
    }
  }

  const handleDelete = async () => {
    if (!feedbackId) return
    if (!window.confirm('Bạn có chắc muốn xoá đánh giá này?')) return

    try {
      await deleteFeedback(Number(feedbackId))
      alert('Đã xoá đánh giá!')
      navigate('/services')
    } catch (error) {
      alert('Lỗi khi xoá đánh giá!')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa đánh giá</h1>
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
        <div className="flex justify-between">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Cập nhật đánh giá
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Xoá đánh giá
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditFeedbackPage
