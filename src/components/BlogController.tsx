import React, { useState, useEffect, useCallback } from 'react'

import { 
  getAllBlogPosts, 
  getMyBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  getBlogPostStats,
  type BlogPostSummary, 
  type BlogPostCreateDto, 
  type BlogPostUpdateDto, 
  type BlogPostSearchDto,
  type PaginatedBlogPostsResponse,
  type BlogPostStats,
  getStatusDisplayText,
  formatDate,
  createExcerpt
} from '../services/blogService'

interface BlogControllerProps {
  userRole?: 'admin' | 'staff' | 'manager' | 'author'
  className?: string
}

type SortField = 'title' | 'authorName' | 'publishedAt' | 'status'
type SortOrder = 'asc' | 'desc'

interface BlogFormData {
  title: string
  content: string
  publishNow: boolean
}

const BlogController: React.FC<BlogControllerProps> = ({ 
  userRole = 'staff', 
  className = '' 
}) => {
  // State management
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [stats, setStats] = useState<BlogPostStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<SortField>('publishedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  
  // Form and modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostSummary | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null)
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    publishNow: false
  })
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [authorFilter, setAuthorFilter] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('')

  // Fetch blog posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const searchDto: BlogPostSearchDto = {
        searchTerm: searchTerm || undefined,
        isPublished: statusFilter === 'published' ? true : statusFilter === 'draft' ? false : undefined,
        authorId: authorFilter ? parseInt(authorFilter) : undefined,
        page: currentPage,
        pageSize: pageSize
      }

      const response: PaginatedBlogPostsResponse = userRole === 'admin' 
        ? await getAllBlogPosts(searchDto)
        : await getMyBlogPosts(searchDto)

      if (response.success) {
        setPosts(response.data.posts)
        setTotalPages(response.data.totalPages)
      } else {
        setError(response.message || 'Failed to fetch posts')
      }
    } catch (err) {
      setError('Failed to fetch blog posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm, statusFilter, authorFilter, userRole])

  // Fetch stats (admin only)
  const fetchStats = useCallback(async () => {
    if (userRole !== 'admin') return
    
    try {
      const response = await getBlogPostStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [userRole])

  // Initial data fetch
  useEffect(() => {
    fetchPosts()
    fetchStats()
  }, [fetchPosts, fetchStats])

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Sort posts client-side
  const sortedPosts = React.useMemo(() => {
    return [...posts].sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'authorName':
          aValue = (a.authorName || '').toLowerCase()
          bValue = (b.authorName || '').toLowerCase()
          break
        case 'publishedAt':
          aValue = new Date(a.publishedAt || 0)
          bValue = new Date(b.publishedAt || 0)
          break
        case 'status':
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [posts, sortField, sortOrder])

  // Handle form submission for create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      if (editingPost) {
        // Update existing post
        const updateDto: BlogPostUpdateDto = {
          title: formData.title,
          content: formData.content,
          isPublished: formData.publishNow
        }
        
        const response = await updateBlogPost(editingPost.postId, updateDto)
        
        if (response.success) {
          setShowEditModal(false)
          setEditingPost(null)
          resetForm()
          fetchPosts()
        } else {
          setError(response.message || 'Failed to update post')
        }
      } else {
        // Create new post
        const createDto: BlogPostCreateDto = {
          title: formData.title,
          content: formData.content,
          publishNow: formData.publishNow
        }
        
        const response = await createBlogPost(createDto)
        
        if (response.success) {
          setShowCreateModal(false)
          resetForm()
          fetchPosts()
        } else {
          setError(response.message || 'Failed to create post')
        }
      }
    } catch (err) {
      setError('Failed to save post')
      console.error('Error saving post:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deletingPostId) return
    
    try {
      setLoading(true)
      const response = await deleteBlogPost(deletingPostId)
      
      if (response.success) {
        setShowDeleteModal(false)
        setDeletingPostId(null)
        fetchPosts()
      } else {
        setError(response.message || 'Failed to delete post')
      }
    } catch (err) {
      setError('Failed to delete post')
      console.error('Error deleting post:', err)
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      publishNow: false
    })
  }

  // Handle edit button click
  const handleEdit = (post: BlogPostSummary) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.contentPreview, // Note: This might be truncated
      publishNow: post.isPublished
    })
    setShowEditModal(true)
  }

  // Handle delete button click
  const handleDeleteClick = (postId: number) => {
    setDeletingPostId(postId)
    setShowDeleteModal(true)
  }

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? ' ↑' : ' ↓'
  }

  // Render stats cards (admin only)
  const renderStatsCards = () => {
    if (userRole !== 'admin' || !stats) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Tổng bài viết</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalPosts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Đã xuất bản</h3>
          <p className="text-2xl font-bold text-green-600">{stats.publishedPosts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Bản nháp</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.unpublishedPosts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Tác giả</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalAuthors}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Tháng này</h3>
          <p className="text-2xl font-bold text-indigo-600">{stats.postsThisMonth}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Tuần này</h3>
          <p className="text-2xl font-bold text-pink-600">{stats.postsThisWeek}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`blog-controller ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý Blog
        </h1>
        <p className="text-gray-600">
          {userRole === 'admin' ? 'Quản lý tất cả bài viết' : 'Quản lý bài viết của bạn'}
        </p>
      </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>

          {/* Page Size */}
          <div>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10/trang</option>
              <option value={25}>25/trang</option>
              <option value={50}>50/trang</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tạo bài viết
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchPosts}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  Tiêu đề{renderSortIndicator('title')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('authorName')}
                >
                  Tác giả{renderSortIndicator('authorName')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Trạng thái{renderSortIndicator('status')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('publishedAt')}
                >
                  Ngày xuất bản{renderSortIndicator('publishedAt')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : sortedPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Không có bài viết nào
                  </td>
                </tr>
              ) : (
                sortedPosts.map((post) => (
                  <tr key={post.postId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {post.authorName || 'Không xác định'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getStatusDisplayText(post.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(post.publishedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {createExcerpt(post.contentPreview, 100)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(post.postId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Trang <span className="font-medium">{currentPage}</span> trên{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.publishNow}
                      onChange={(e) => setFormData({ ...formData, publishNow: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Xuất bản ngay lập tức
                    </span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                      setEditingPost(null)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : (editingPost ? 'Cập nhật' : 'Tạo')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác nhận xóa
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletingPostId(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogController