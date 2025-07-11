import api from './api'


export interface FeedbackData {
  userId: number
  relatedServiceId: number
  rating: number
  comment: string
}

export const submitFeedback = async (data: FeedbackData): Promise<any> => {
  console.log('Sending feedback:', data) // Debug
  const response = await api.post('/api/Feedback', data)
  if (response.data.success) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to submit feedback')
  }
}

export const getFeedbackByUserAndService = async (userId: number, serviceId: number) => {
  const response = await api.get(`/api/Feedback/user/${userId}/service/${serviceId}`)
  return response.data
}

export const updateFeedback = async (feedbackId: number, updatedData: { rating: number, comment: string }) => {
  const response = await api.put(`/api/Feedback/${feedbackId}`, updatedData)
  return response.data
}

export const getFeedbackById = async (feedbackId: number) => {
  const response = await api.get(`/api/Feedback/${feedbackId}`)
  return response.data
}


export const deleteFeedback = async (feedbackId: number) => {
  const response = await api.delete(`/api/Feedback/${feedbackId}`)
  return response.data
}

export const getFeedbacksByService = async (serviceId: number) => {
  const response = await api.get(`/api/Feedback/service/${serviceId}`)
  return response.data
}

export const getUserById = async (userId: number): Promise<{ firstName: string; lastName: string }> => {
  const response = await api.get(`/api/users/${userId}`)
  return response.data.data
}


