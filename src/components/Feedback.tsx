import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { submitFeedback } from '../services/feedbackService'
import { Star } from 'lucide-react'
import { isAuthenticated } from '../services/authService'
import { motion } from 'framer-motion'

const FeedbackPage: React.FC = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [userId, setUserId] = useState<number | null>(null)
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Bạn cần đăng nhập để gửi đánh giá.')
      navigate('/login')
      return
    }

    const userJson = localStorage.getItem('ghsms_user')
    const user = userJson ? JSON.parse(userJson) : null
    setUserId(user?.userId ?? null)
  }, [navigate])

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
        comment,
      })

      navigate('/services')
    } catch (error: any) {
      console.error('Gửi feedback thất bại:', error)
      navigate('/services')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        damping: 12,
        stiffness: 120,
        delay: 0.2,
      }}
      className="max-w-2xl mx-auto p-8 mt-14 bg-gradient-to-tr from-white via-gray-50 to-blue-50 shadow-xl rounded-3xl border border-blue-100"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-4xl font-bold mb-8 text-center text-green-800 tracking-tight"
      >
        Gửi đánh giá của bạn
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
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
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <label className="block text-lg font-medium text-gray-700 mb-3">Nhận xét:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="Viết cảm nhận của bạn về dịch vụ..."
            className="w-full border border-blue-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner resize-none bg-white"
            required
          />
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 300 }}
          className="flex justify-center"
        >
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.08,
              backgroundColor: '#2563eb',
              boxShadow: '0 0 14px rgba(37,99,235,0.5)',
            }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
          >
            Gửi đánh giá
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default FeedbackPage
