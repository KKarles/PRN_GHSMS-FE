import React, { useState, useEffect } from 'react'
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  UserIcon, 
  ClockIcon,
  ShareIcon,
  BookmarkIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  PrinterIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid'
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
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getBlogPost(postId)
        if (response.success && response.data) {
          setPost(response.data)
          // Initialize some mock data for likes and views
          setLikeCount(Math.floor(Math.random() * 100) + 1)
          setViewCount(Math.floor(Math.random() * 1000) + 50)
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

  // Function to handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || 'Blog Post',
          text: `Check out this blog post: ${post?.title}`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
        setShowShareModal(true)
      }
    } else {
      setShowShareModal(true)
    }
  }

  // Copy link to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Link copied to clipboard!')
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    }
  }

  // Handle like functionality
  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  // Handle bookmark functionality
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // In a real app, this would save to user's bookmarks
  }

  // Handle print functionality
  const handlePrint = () => {
    window.print()
  }

  // Share to social media
  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post?.title || 'Blog Post')
    const text = encodeURIComponent(`Check out this blog post: ${post?.title}`)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
    setShowShareModal(false)
  }

  if (loading) {
    return (
      <div className="bg-background-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-secondary">Đang tải bài viết...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-background-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h2>
              <p className="text-red-500 font-secondary mb-6">{error || 'Blog post not found'}</p>
              <button 
                onClick={onBack}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-secondary"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const readTime = calculateReadTime(post.content || '')
  const publishedDate = formatDate(post.publishedAt)
  const statusText = getStatusDisplayText(post.status)

  return (
    <div className="bg-background-light min-h-screen">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors font-secondary"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Quay lại danh sách
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-primary transition-colors"
                title="In bài viết"
              >
                <PrinterIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-primary transition-colors"
                title="Chia sẻ"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Blog Post Content */}
        <article className="max-w-4xl mx-auto">
          {/* Featured Image Section */}
          <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary-light to-accent-light rounded-2xl overflow-hidden mb-8 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-secondary text-3xl font-bold">
                    {post.title?.charAt(0).toUpperCase() || 'B'}
                  </span>
                </div>
                <p className="text-primary font-secondary text-lg font-medium">Featured Article</p>
              </div>
            </div>
            
            {/* Article Stats Overlay */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {viewCount}
                </div>
                <div className="flex items-center">
                  <HeartIcon className="h-4 w-4 mr-1" />
                  {likeCount}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Post Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center text-sm text-gray-600 font-secondary">
                  <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">{publishedDate}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 font-secondary">
                  <UserIcon className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">{post.authorName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 font-secondary">
                  <ClockIcon className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">{readTime}</span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  post.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {statusText}
                </span>
              </div>

              {/* Post Title */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-primary font-bold text-text-dark mb-4 leading-tight">
                  {post.title || 'Untitled Blog Post'}
                </h1>
                
                {/* Engagement Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                        isLiked 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {isLiked ? (
                        <HeartSolidIcon className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                      <span className="font-medium">{likeCount}</span>
                    </button>
                    
                    <button
                      onClick={handleBookmark}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                        isBookmarked 
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                      <span className="font-medium">
                        {isBookmarked ? 'Đã lưu' : 'Lưu'}
                      </span>
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 font-secondary">
                    <span className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {viewCount} lượt xem
                    </span>
                  </div>
                </div>
              </header>

              {/* Post Content with Rich Text Support */}
              <main className="prose prose-lg max-w-none">
                <div 
                  className="blog-rich-content font-secondary text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available.</p>' }}
                />
              </main>

              {/* Post Footer Actions */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={handleShare}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-secondary text-sm font-medium"
                    >
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Chia sẻ bài viết
                    </button>
                    
                    <button 
                      onClick={() => copyToClipboard(window.location.href)}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-secondary text-sm"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                      Copy link
                    </button>
                    
                    <button 
                      onClick={handlePrint}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-secondary text-sm"
                    >
                      <PrinterIcon className="h-4 w-4 mr-2" />
                      In bài viết
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 font-secondary">
                    ID: {post.postId}
                  </div>
                </div>
              </footer>
            </div>
          </div>

          {/* Related Posts Section */}
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-primary font-bold text-text-dark mb-8">
              Bài viết liên quan
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-border-subtle p-8">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sắp có thêm nội dung</h3>
                <p className="text-gray-500 font-secondary">
                  Chức năng gợi ý bài viết liên quan sẽ được phát triển trong tương lai
                </p>
                <button 
                  onClick={onBack}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-secondary"
                >
                  Xem thêm bài viết khác
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Chia sẻ bài viết</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="flex items-center justify-center px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                
                <button
                  onClick={() => shareToSocial('linkedin')}
                  className="flex items-center justify-center px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
                
                <button
                  onClick={() => shareToSocial('telegram')}
                  className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram
                </button>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3">Hoặc copy link:</p>
                <div className="flex">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(window.location.href)}
                    className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rich Text Content Styles */}
      <style>{`
        .blog-rich-content {
          line-height: 1.8;
        }
        
        .blog-rich-content h1,
        .blog-rich-content h2,
        .blog-rich-content h3,
        .blog-rich-content h4,
        .blog-rich-content h5,
        .blog-rich-content h6 {
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          color: #1f2937;
          scroll-margin-top: 4rem;
        }
        
        .blog-rich-content h1 { 
          font-size: 2.25rem; 
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
        }
        .blog-rich-content h2 { 
          font-size: 2rem; 
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        .blog-rich-content h3 { font-size: 1.75rem; }
        .blog-rich-content h4 { font-size: 1.5rem; }
        .blog-rich-content h5 { font-size: 1.25rem; }
        .blog-rich-content h6 { font-size: 1.125rem; }
        
        .blog-rich-content p {
          margin-bottom: 1.75rem;
          text-align: justify;
          text-justify: inter-word;
        }
        
        .blog-rich-content img {
          max-width: 100%;
          height: auto;
          margin: 2.5rem auto;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: block;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .blog-rich-content img:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .blog-rich-content ul,
        .blog-rich-content ol {
          margin: 2rem 0;
          padding-left: 2rem;
        }
        
        .blog-rich-content ul {
          list-style-type: disc;
        }
        
        .blog-rich-content ol {
          list-style-type: decimal;
        }
        
        .blog-rich-content li {
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }
        
        .blog-rich-content li::marker {
          color: #3b82f6;
          font-weight: 600;
        }
        
        .blog-rich-content blockquote {
          border-left: 5px solid #3b82f6;
          padding: 1.5rem 2rem;
          margin: 2.5rem 0;
          font-style: italic;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 0 12px 12px 0;
          position: relative;
          font-size: 1.1em;
        }
        
        .blog-rich-content blockquote::before {
          content: '"';
          font-size: 4rem;
          color: #3b82f6;
          position: absolute;
          left: 1rem;
          top: -0.5rem;
          font-family: serif;
          opacity: 0.3;
        }
        
        .blog-rich-content a {
          color: #3b82f6;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .blog-rich-content a:hover {
          color: #2563eb;
          border-bottom-color: #2563eb;
          background-color: rgba(59, 130, 246, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        .blog-rich-content strong {
          font-weight: 700;
          color: #1f2937;
        }
        
        .blog-rich-content em {
          font-style: italic;
          color: #4b5563;
        }
        
        .blog-rich-content code {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 0.875em;
          font-weight: 500;
          color: #1e293b;
          border: 1px solid #e2e8f0;
        }
        
        .blog-rich-content pre {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #f1f5f9;
          padding: 2rem;
          border-radius: 12px;
          overflow-x: auto;
          margin: 2.5rem 0;
          border: 1px solid #475569;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
          position: relative;
        }
        
        .blog-rich-content pre::before {
          content: '';
          position: absolute;
          top: 1rem;
          left: 1rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 20px 0 0 #f59e0b, 40px 0 0 #10b981;
        }
        
        .blog-rich-content pre code {
          background: none;
          padding: 0;
          color: inherit;
          border: none;
          font-size: 0.9em;
          line-height: 1.6;
        }
        
        .blog-rich-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2.5rem 0;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .blog-rich-content th,
        .blog-rich-content td {
          border: 1px solid #e5e7eb;
          padding: 1rem;
          text-align: left;
          vertical-align: top;
        }
        
        .blog-rich-content th {
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          font-weight: 700;
          color: #374151;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .blog-rich-content tr:nth-child(even) td {
          background-color: #f9fafb;
        }
        
        .blog-rich-content tr:hover td {
          background-color: #f3f4f6;
        }
        
        .blog-rich-content hr {
          margin: 4rem 0;
          border: none;
          height: 2px;
          background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
          position: relative;
        }
        
        .blog-rich-content hr::before {
          content: '✦';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: white;
          color: #9ca3af;
          padding: 0 1rem;
          font-size: 1.2rem;
        }
        
        /* Enhanced Typography */
        .blog-rich-content {
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
          text-rendering: optimizeLegibility;
        }
        
        /* Focus styles for accessibility */
        .blog-rich-content a:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        /* Selection styles */
        .blog-rich-content ::selection {
          background: rgba(59, 130, 246, 0.2);
          color: #1f2937;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .blog-rich-content {
            font-size: 1rem;
            line-height: 1.7;
          }
          
          .blog-rich-content h1 { font-size: 2rem; }
          .blog-rich-content h2 { font-size: 1.75rem; }
          .blog-rich-content h3 { font-size: 1.5rem; }
          .blog-rich-content h4 { font-size: 1.25rem; }
          
          .blog-rich-content img {
            margin: 2rem auto;
            border-radius: 8px;
          }
          
          .blog-rich-content pre {
            padding: 1.5rem;
            font-size: 0.875rem;
          }
          
          .blog-rich-content blockquote {
            padding: 1rem 1.5rem;
            margin: 2rem 0;
          }
          
          .blog-rich-content table {
            font-size: 0.875rem;
          }
          
          .blog-rich-content th,
          .blog-rich-content td {
            padding: 0.75rem;
          }
        }
        
        @media (max-width: 480px) {
          .blog-rich-content {
            font-size: 0.95rem;
          }
          
          .blog-rich-content h1 { font-size: 1.75rem; }
          .blog-rich-content h2 { font-size: 1.5rem; }
          .blog-rich-content h3 { font-size: 1.25rem; }
          
          .blog-rich-content ul,
          .blog-rich-content ol {
            padding-left: 1.5rem;
          }
          
          .blog-rich-content pre {
            padding: 1rem;
            font-size: 0.8rem;
          }
          
          .blog-rich-content blockquote {
            padding: 0.75rem 1rem;
            margin: 1.5rem 0;
          }
          
          .blog-rich-content table {
            font-size: 0.8rem;
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }
        
        /* Print styles */
        @media print {
          .blog-rich-content {
            color: black !important;
            background: white !important;
          }
          
          .blog-rich-content a {
            color: black !important;
            text-decoration: underline !important;
          }
          
          .blog-rich-content pre {
            background: #f5f5f5 !important;
            color: black !important;
            border: 1px solid #ccc !important;
          }
          
          .blog-rich-content blockquote {
            background: #f9f9f9 !important;
            border-left: 4px solid #ccc !important;
          }
          
          .blog-rich-content img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }
          
          .blog-rich-content table {
            border-collapse: collapse !important;
            border: 1px solid #ccc !important;
          }
          
          .blog-rich-content th,
          .blog-rich-content td {
            border: 1px solid #ccc !important;
            background: white !important;
          }
        }
        
        /* Dark mode support (if needed in future) */
        @media (prefers-color-scheme: dark) {
          .blog-rich-content {
            color: #e5e7eb;
          }
          
          .blog-rich-content h1,
          .blog-rich-content h2,
          .blog-rich-content h3,
          .blog-rich-content h4,
          .blog-rich-content h5,
          .blog-rich-content h6 {
            color: #f9fafb;
          }
          
          .blog-rich-content blockquote {
            background: rgba(55, 65, 81, 0.5);
            border-left-color: #60a5fa;
          }
          
          .blog-rich-content code {
            background: rgba(55, 65, 81, 0.8);
            color: #e5e7eb;
            border-color: #4b5563;
          }
        }
        
        /* Animation for images when they load */
        .blog-rich-content img {
          opacity: 0;
          animation: fadeInImage 0.5s ease-in-out forwards;
        }
        
        @keyframes fadeInImage {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Smooth scrolling for anchor links */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}

export default BlogPostDetail