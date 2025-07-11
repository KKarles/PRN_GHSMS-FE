import React, { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  UserIcon, 
  ClockIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline'
import { 
  getPublishedBlogPosts, 
  searchBlogPosts, 
  type BlogPostSummary, 
  type BlogPostSearchDto,
  calculateReadTime,
  formatDate,
  createExcerpt,
  getStatusDisplayText
} from '../services/blogService'

interface BlogListingProps {
  onSelectPost?: (post: BlogPostSummary) => void
}

const BlogListing: React.FC<BlogListingProps> = ({ onSelectPost }) => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(9) // 3x3 grid
  const [isSearching, setIsSearching] = useState(false)

  const fetchPosts = async (page = 1, search = '') => {
    try {
      setLoading(true)
      setError(null)
      
      let response
      if (search.trim()) {
        setIsSearching(true)
        response = await searchBlogPosts(search, page, pageSize)
      } else {
        setIsSearching(false)
        const searchDto: BlogPostSearchDto = {
          page,
          pageSize,
          isPublished: true
        }
        response = await getPublishedBlogPosts(searchDto)
      }

      if (response.success && response.data) {
        setPosts(response.data.posts)
        setCurrentPage(response.data.page)
        setTotalPages(response.data.totalPages)
        setTotalCount(response.data.totalCount)
      } else {
        setError(response.message || 'Failed to fetch blog posts')
      }
    } catch (err) {
      setError('Failed to fetch blog posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1, searchTerm)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPosts(1, searchTerm)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchPosts(page, searchTerm)
  }

  const handlePostClick = (post: BlogPostSummary) => {
    if (onSelectPost) {
      onSelectPost(post)
    }
  }

  const BlogPostCard: React.FC<{ post: BlogPostSummary }> = ({ post }) => {
    // Safe excerpt creation with fallback
    const excerpt = post.contentPreview || createExcerpt(post.contentPreview || '')
    const readTime = calculateReadTime(post.contentPreview || '')
    const publishedDate = formatDate(post.publishedAt)
    const statusText = getStatusDisplayText(post.status)

    return (
      <div 
        className="bg-white rounded-2xl shadow-sm border border-border-subtle hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
        onClick={() => handlePostClick(post)}
      >
        {/* Blog Image - placeholder since backend doesn't provide imageUrl */}
        <div className="h-48 bg-gradient-to-br from-primary-light to-accent-light rounded-t-2xl flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-secondary text-xl">
                {post.title?.charAt(0) || 'B'}
              </span>
            </div>
            <p className="text-primary font-secondary text-sm">Blog Image</p>
          </div>
        </div>

        {/* Blog Content */}
        <div className="p-6">
          {/* Status & Date */}
          <div className="flex items-center justify-between mb-3">
            <span className="bg-primary text-text-light px-3 py-1 rounded-full text-xs font-secondary">
              {statusText}
            </span>
            <div className="flex items-center text-gray-500 text-xs font-secondary">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {publishedDate}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-primary font-bold text-lg text-text-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title || 'Untitled Blog Post'}
          </h3>

          {/* Excerpt */}
          <p className="font-secondary text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>

          {/* Author & Read Time */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-secondary">
            <div className="flex items-center">
              <UserIcon className="h-3 w-3 mr-1" />
              {post.authorName || 'Unknown Author'}
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />
              {readTime}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Pagination: React.FC = () => {
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-border-subtle hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        
        {pages.map(page => (
          <button
            key={`page-${page}`}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-lg font-secondary text-sm ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'border border-border-subtle hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-border-subtle hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    )
  }

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

  if (error) {
    return (
      <div className="bg-background-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500 font-secondary">{error}</p>
            <button 
              onClick={() => fetchPosts(1, searchTerm)}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-light min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-primary font-bold text-text-dark mb-4">
            Blog Sức Khỏe
          </h1>
          <p className="text-lg font-secondary text-gray-600 max-w-2xl mx-auto">
            Khám phá những bài viết hữu ích về sức khỏe sinh sản và chăm sóc cá nhân
          </p>
        </div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-secondary"
              />
            </div>
          </form>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="font-secondary text-gray-600">
            {isSearching ? (
              <p>Tìm thấy {totalCount} kết quả cho "{searchTerm}"</p>
            ) : (
              <p>Hiển thị {totalCount} bài viết</p>
            )}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <BlogPostCard key={`post-${post.postId}`} post={post} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && <Pagination />}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-secondary text-lg">
              {isSearching ? 'Không tìm thấy kết quả nào' : 'Chưa có bài viết nào'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogListing