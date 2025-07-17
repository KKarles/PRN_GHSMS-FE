import React, { useState, useEffect, useCallback } from 'react'

import { 
  getAllBlogPosts, 
  getMyBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  getBlogPostStats,
  getBlogPostById,
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

// Rich Text Editor Component
interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = React.useRef<HTMLDivElement>(null)

  // Handle paste events to preserve formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    
    // Get clipboard data
    const clipboardData = e.clipboardData
    const htmlData = clipboardData.getData('text/html')
    const textData = clipboardData.getData('text/plain')
    
    // Use HTML if available, otherwise plain text
    const content = htmlData || textData
    
    if (content) {
      // Insert content at cursor position
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = content
        
        // Insert each node
        const fragment = document.createDocumentFragment()
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild)
        }
        range.insertNode(fragment)
        
        // Update the state
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML)
        }
      }
    }
  }

  // Handle input changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Update editor content when value changes - Fixed to preserve HTML
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Preserve cursor position
      const selection = window.getSelection()
      let cursorPos = 0
      
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        cursorPos = range.startOffset
      }
      
      editorRef.current.innerHTML = value
      
      // Restore cursor position if possible
      if (selection && editorRef.current.firstChild) {
        try {
          const range = document.createRange()
          const textNode = editorRef.current.firstChild
          range.setStart(textNode, Math.min(cursorPos, textNode.textContent?.length || 0))
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        } catch (e) {
          // Ignore cursor positioning errors
        }
      }
    }
  }, [value])

  return (
    <div className="border border-gray-300 rounded-md">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
        <button
          type="button"
          onClick={() => document.execCommand('bold')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('italic')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('underline')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => document.execCommand('justifyLeft')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Align Left"
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('justifyCenter')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Align Center"
        >
          ≣
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('justifyRight')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Align Right"
        >
          ≡
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => document.execCommand('insertUnorderedList')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('insertOrderedList')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter image URL:')
            if (url) {
              document.execCommand('insertImage', false, url)
            }
          }}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Insert Image"
        >
          🖼️
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter link URL:')
            if (url) {
              document.execCommand('createLink', false, url)
            }
          }}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Insert Link"
        >
          🔗
        </button>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        onInput={handleInput}
        className="rich-text-editor p-3 min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none"
        style={{ 
          wordBreak: 'break-word',
          lineHeight: '1.6'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      <style>{`
        .rich-text-editor [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        .rich-text-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 8px 0;
        }
        
        .rich-text-editor ul, .rich-text-editor ol {
          padding-left: 20px;
          margin: 8px 0;
        }
        
        .rich-text-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 12px;
          margin: 12px 0;
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 4px;
        }
        
        .rich-text-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .rich-text-editor p {
          margin: 8px 0;
        }
        
        .rich-text-editor h1, .rich-text-editor h2, .rich-text-editor h3,
        .rich-text-editor h4, .rich-text-editor h5, .rich-text-editor h6 {
          margin: 12px 0 8px 0;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
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
  
  // Add loading state for fetching full post content
  const [loadingFullPost, setLoadingFullPost] = useState(false)
  
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

  // Fetch full blog post content for editing
  const fetchFullPost = async (postId: number) => {
    try {
      setLoadingFullPost(true)
      // You need to implement this API call in your blogService
      const response = await getBlogPostById(postId)
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch full post')
      }
    } catch (err) {
      console.error('Error fetching full post:', err)
      setError('Failed to load full post content')
      return null
    } finally {
      setLoadingFullPost(false)
    }
  }

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
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Vui lòng điền đầy đủ tiêu đề và nội dung')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      if (editingPost) {
        // Update existing post
        const updateDto: BlogPostUpdateDto = {
          title: formData.title.trim(),
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
          title: formData.title.trim(),
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

  // Handle edit button click - FIXED to fetch full content
  const handleEdit = async (post: BlogPostSummary) => {
    setEditingPost(post)
    
    // Fetch the full post content instead of using contentPreview
    const fullPost = await fetchFullPost(post.postId)
    
    if (fullPost) {
      setFormData({
        title: fullPost.title,
        content: fullPost.content, // Use full HTML content, not contentPreview
        publishNow: fullPost.isPublished
      })
      setShowEditModal(true)
    } else {
      // Fallback to using available data if fetch fails
      setFormData({
        title: post.title,
        content: post.contentPreview || '', // This is still not ideal but better than nothing
        publishNow: post.isPublished
      })
      setShowEditModal(true)
    }
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
                        disabled={loadingFullPost}
                        className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                      >
                        {loadingFullPost ? 'Đang tải...' : 'Sửa'}
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
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white my-8">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
              </h3>
              
              {/* Show loading indicator when fetching full post */}
              {loadingFullPost && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Đang tải nội dung bài viết...</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={loadingFullPost ? 'opacity-50 pointer-events-none' : ''}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung *
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Nhập nội dung bài viết... Bạn có thể dán nội dung từ trang web khác với định dạng và hình ảnh."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hỗ trợ paste nội dung từ trang web với định dạng và hình ảnh. Sử dụng thanh công cụ để định dạng văn bản.
                  </p>
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
                      setError(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading || loadingFullPost}
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