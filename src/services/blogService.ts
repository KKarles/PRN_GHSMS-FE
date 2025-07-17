import api from './api'

// Types matching your backend DTOs
export interface BlogPost {
  postId: number
  title: string
  content: string
  authorId?: number
  authorName?: string
  publishedAt?: string
  isPublished: boolean
  status: string
}

export interface BlogPostSummary {
  postId: number
  title: string
  contentPreview: string
  authorId?: number
  authorName?: string
  publishedAt?: string
  isPublished: boolean
  status: string
}

export interface BlogPostCreateDto {
  title: string
  content: string
  publishNow?: boolean
}

export interface BlogPostUpdateDto {
  title?: string
  content?: string
  isPublished?: boolean
}

export interface BlogPostSearchDto {
  searchTerm?: string
  authorId?: number
  startDate?: string
  endDate?: string
  isPublished?: boolean
  page?: number
  pageSize?: number
}

export interface PaginatedBlogPostsResponse {
  success: boolean
  message: string
  data: {
    posts: BlogPostSummary[]
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface BlogPostResponse {
  success: boolean
  message: string
  data: BlogPost
}

export interface BlogPostStats {
  totalPosts: number
  publishedPosts: number
  unpublishedPosts: number
  totalAuthors: number
  postsThisMonth: number
  postsThisWeek: number
}

// Blog service functions matching your backend endpoints
export const getPublishedBlogPosts = async (searchDto: BlogPostSearchDto = {}): Promise<PaginatedBlogPostsResponse> => {
  try {
    const params = new URLSearchParams()
    Object.entries(searchDto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/api/BlogPost/published?${params}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch published blog posts:', error)
    throw error
  }
}

export const getBlogPost = async (id: number): Promise<BlogPostResponse> => {
  try {
    const response = await api.get(`/api/BlogPost/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    throw error
  }
}

// New function specifically for getting full blog post content for editing
// This is an alias for getBlogPost but with clearer naming for the edit functionality
export const getBlogPostById = async (id: number): Promise<BlogPostResponse> => {
  try {
    const response = await api.get(`/api/BlogPost/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch blog post by ID:', error)
    throw error
  }
}

// Alternative function if your backend has a specific endpoint for full content
export const getBlogPostFullContent = async (id: number): Promise<BlogPostResponse> => {
  try {
    // Try the full content endpoint first if it exists
    let response
    try {
      response = await api.get(`/api/BlogPost/${id}/full`)
    } catch (fullContentError) {
      // Fallback to regular endpoint if full content endpoint doesn't exist
      console.warn('Full content endpoint not available, using regular endpoint')
      response = await api.get(`/api/BlogPost/${id}`)
    }
    return response.data
  } catch (error) {
    console.error('Failed to fetch full blog post content:', error)
    throw error
  }
}

export const searchBlogPosts = async (
  searchTerm: string, 
  page = 1, 
  pageSize = 10
): Promise<PaginatedBlogPostsResponse> => {
  try {
    const response = await api.get(`/api/BlogPost/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`)
    return response.data
  } catch (error) {
    console.error('Failed to search blog posts:', error)
    throw error
  }
}

export const getRecentBlogPosts = async (count = 5): Promise<PaginatedBlogPostsResponse> => {
  try {
    const response = await api.get(`/api/BlogPost/recent?count=${count}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch recent blog posts:', error)
    throw error
  }
}

export const getBlogPostsByAuthor = async (
  authorId: number, 
  searchDto: BlogPostSearchDto = {}
): Promise<PaginatedBlogPostsResponse> => {
  try {
    const params = new URLSearchParams()
    Object.entries(searchDto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/api/BlogPost/author/${authorId}?${params}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch blog posts by author:', error)
    throw error
  }
}

// Admin functions (require authentication)
export const getAllBlogPosts = async (searchDto: BlogPostSearchDto = {}): Promise<PaginatedBlogPostsResponse> => {
  try {
    const params = new URLSearchParams()
    Object.entries(searchDto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/api/BlogPost/admin/all?${params}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch all blog posts:', error)
    throw error
  }
}

export const getMyBlogPosts = async (searchDto: BlogPostSearchDto = {}): Promise<PaginatedBlogPostsResponse> => {
  try {
    const params = new URLSearchParams()
    Object.entries(searchDto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/api/BlogPost/my-posts?${params}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch my blog posts:', error)
    throw error
  }
}

export const createBlogPost = async (blogPost: BlogPostCreateDto): Promise<BlogPostResponse> => {
  try {
    const response = await api.post('/api/BlogPost', blogPost)
    return response.data
  } catch (error) {
    console.error('Failed to create blog post:', error)
    throw error
  }
}

export const updateBlogPost = async (id: number, blogPost: BlogPostUpdateDto): Promise<BlogPostResponse> => {
  try {
    const response = await api.put(`/api/BlogPost/${id}`, blogPost)
    return response.data
  } catch (error) {
    console.error('Failed to update blog post:', error)
    throw error
  }
}

export const deleteBlogPost = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/api/BlogPost/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete blog post:', error)
    throw error
  }
}

export const getBlogPostStats = async (): Promise<{ success: boolean; message: string; data: BlogPostStats }> => {
  try {
    const response = await api.get('/api/BlogPost/admin/stats')
    return response.data
  } catch (error) {
    console.error('Failed to fetch blog post stats:', error)
    throw error
  }
}

// Utility functions with improved error handling
export const calculateReadTime = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '1 phút đọc'
  }
  
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} phút đọc`
}

export const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return 'Không xác định'
  }
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Không xác định'
    }
    
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Không xác định'
  }
}

export const createExcerpt = (content: string, maxLength = 150): string => {
  if (!content || typeof content !== 'string') {
    return 'Nội dung không có sẵn...'
  }
  
  try {
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    if (!textContent) {
      return 'Nội dung không có sẵn...'
    }
    
    if (textContent.length <= maxLength) {
      return textContent
    }
    
    return textContent.substring(0, maxLength).trim() + '...'
  } catch (error) {
    console.error('Error creating excerpt:', error)
    return 'Nội dung không có sẵn...'
  }
}

// Helper function to get status display text
export const getStatusDisplayText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'published':
      return 'Đã xuất bản'
    case 'draft':
      return 'Bản nháp'
    case 'pending':
      return 'Chờ duyệt'
    default:
      return status
  }
}

// Helper function to validate HTML content and ensure it's safe
export const sanitizeHtmlContent = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return ''
  }
  
  // Basic HTML validation - you might want to use a proper HTML sanitizer library
  // like DOMPurify for production use
  try {
    // Remove script tags for basic security
    const cleaned = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    return cleaned
  } catch (error) {
    console.error('Error sanitizing HTML content:', error)
    return content
  }
}

// Helper function to check if content has rich formatting
export const hasRichFormatting = (content: string): boolean => {
  if (!content || typeof content !== 'string') {
    return false
  }
  
  // Check for common HTML tags that indicate rich formatting
  const richFormattingTags = /<(img|a|strong|em|b|i|u|ul|ol|li|blockquote|h[1-6]|p|div|span)[^>]*>/i
  return richFormattingTags.test(content)
}

// Function to extract images from content
export const extractImagesFromContent = (content: string): string[] => {
  if (!content || typeof content !== 'string') {
    return []
  }
  
  const imgRegex = /<img[^>]+src="([^">]+)"/g
  const images: string[] = []
  let match
  
  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1])
  }
  
  return images
}