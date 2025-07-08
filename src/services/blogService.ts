import api from './api'

// Types for blog system
export interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  author: string
  publishedDate: string
  category: string
  slug: string
  imageUrl?: string
}

export interface BlogPostsResponse {
  posts: BlogPost[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export interface BlogPostDetail extends BlogPost {
  content: string
  tags: string[]
  relatedPosts?: BlogPost[]
}

// Blog service functions
export const getBlogPosts = async (page = 1, limit = 10): Promise<BlogPostsResponse> => {
  try {
    const response = await api.get(`/api/blog/posts?page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    throw error
  }
}

export const getBlogPost = async (id: number): Promise<BlogPostDetail> => {
  try {
    const response = await api.get(`/api/blog/posts/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    throw error
  }
}

export const getBlogPostBySlug = async (slug: string): Promise<BlogPostDetail> => {
  try {
    const response = await api.get(`/api/blog/posts/slug/${slug}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch blog post by slug:', error)
    throw error
  }
}

export const getBlogCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get('/api/blog/categories')
    return response.data
  } catch (error) {
    console.error('Failed to fetch blog categories:', error)
    throw error
  }
}

export const searchBlogPosts = async (query: string, page = 1, limit = 10): Promise<BlogPostsResponse> => {
  try {
    const response = await api.get(`/api/blog/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('Failed to search blog posts:', error)
    throw error
  }
}