import React, { useState, useEffect } from 'react'
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  UserIcon, 
  ClockIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { 
  getBlogPost, 
  type BlogPost,
  calculateReadTime,
  formatDate,
  getStatusDisplayText
} from '../services/blogService'

interface BlogPostDetailProps {
  postId: number
  onBack: () => void
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ postId, onBack }) => {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getBlogPost(postId)
        if (response.success && response.data) {
          setPost(response.data)
        } else {
          setError(response.message || 'Failed to fetch blog post')
        }
      } catch (err) {
        setError('Failed to fetch blog post')
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loading) {
    return (
      <div className="bg-background-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-background-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500 font-secondary mb-4">{error || 'Blog post not found'}</p>
            <button 
              onClick={onBack}
              className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    )
  }

  const readTime = calculateReadTime(post.content || '')
  const publishedDate = formatDate(post.publishedAt)
  const statusText = getStatusDisplayText(post.status)

  return (
    <div className="bg-background-light min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors font-secondary"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </button>
        </div>

        {/* Blog Post Content */}
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
          {/* Header Image - placeholder since backend doesn't provide imageUrl */}
          <div className="h-64 md:h-80 bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-secondary text-2xl">
                  {post.title?.charAt(0) || 'B'}
                </span>
              </div>
              <p className="text-primary font-secondary">Featured Image</p>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-8 md:p-12">
            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 font-secondary">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {publishedDate}
              </div>
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {post.authorName || 'Unknown Author'}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {readTime}
              </div>
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs">
                {statusText}
              </span>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl md:text-4xl font-primary font-bold text-text-dark mb-8 leading-tight">
              {post.title || 'Untitled Blog Post'}
            </h1>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="font-secondary text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content || 'No content available.' }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border-subtle">
              <div className="flex items-center space-x-4">
                <button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-secondary text-sm">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Chia sẻ
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-secondary text-sm">
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                  Lưu bài viết
                </button>
              </div>
              
              <div className="text-sm text-gray-500 font-secondary">
                Post ID: {post.postId}
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts Section - Optional */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-primary font-bold text-text-dark mb-6">
            Bài viết liên quan
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-border-subtle p-6">
            <p className="text-gray-500 font-secondary text-center">
              Chức năng bài viết liên quan sẽ được phát triển trong tương lai
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostDetail