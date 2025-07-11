import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { updateFeedback, getFeedbackById, deleteFeedback } from '../services/feedbackService'
import { Star } from 'lucide-react'
import { isAuthenticated } from '../services/authService'
import { motion } from 'framer-motion'

const EditFeedbackPage: React.FC = () => {
  const { feedbackId } = useParams()
  const navigate = useNavigate()

  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Bạn cần đăng nhập để chỉnh sửa đánh giá.')
      navigate('/login')
      return
    }

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
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
      className="max-w-2xl mx-auto p-8 mt-14 bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl border border-gray-100"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center text-green-800 tracking-tight"
      >
        Chỉnh sửa đánh giá
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label className="block text-lg font-medium text-gray-700 mb-3">Đánh giá:</label>
          <div className="flex space-x-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                whileHover={{ y: -6, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Star
                  size={40}
                  className={`cursor-pointer transition-colors duration-200 
                    ${hoverRating !== null
                      ? star <= hoverRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                      : star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  fill={(hoverRating ?? rating) >= star ? 'currentColor' : 'none'}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <label className="block text-lg font-medium text-gray-700 mb-3">Nhận xét:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="Viết cảm nhận của bạn về dịch vụ..."
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner resize-none bg-white"
            required
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-between gap-4"
        >
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.05,
              backgroundColor: '#16a34a',
              boxShadow: '0 0 10px rgba(22,163,74,0.4)',
            }}
            transition={{ type: 'spring', stiffness: 250 }}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md w-full"
          >
            Cập nhật đánh giá
          </motion.button>

          <motion.button
            type="button"
            onClick={handleDelete}
            whileHover={{
                scale: 1.05,
                backgroundColor: '#dc2626',
                boxShadow: '0 0 10px rgba(220,38,38,0.4)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 250 }}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md w-full"
            >
            Xoá đánh giá
            </motion.button>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default EditFeedbackPage
