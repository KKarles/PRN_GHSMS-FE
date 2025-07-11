import React, { useState, useEffect } from 'react'
import BlogListing from './BlogListing'
import BlogPostDetail from './BlogPostDetail'
import { type BlogPostSummary } from '../services/blogService'

interface BlogProps {
  className?: string
  initialPostId?: number // Allow direct navigation to a specific post
}

const Blog: React.FC<BlogProps> = ({ className = '', initialPostId }) => {
  const [currentView, setCurrentView] = useState<'listing' | 'detail'>('listing')
  const [selectedPost, setSelectedPost] = useState<BlogPostSummary | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

  // Handle initial post ID if provided
  useEffect(() => {
    if (initialPostId) {
      setSelectedPostId(initialPostId)
      setCurrentView('detail')
    }
  }, [initialPostId])

  const handleSelectPost = (post: BlogPostSummary) => {
    setSelectedPost(post)
    setSelectedPostId(post.postId)
    setCurrentView('detail')
    
    // Scroll to top when navigating to post detail
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToListing = () => {
    setCurrentView('listing')
    setSelectedPost(null)
    setSelectedPostId(null)
    
    // Scroll to top when going back to listing
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`blog-container ${className}`}>
      {currentView === 'listing' ? (
        <BlogListing onSelectPost={handleSelectPost} />
      ) : (
        selectedPostId && (
          <BlogPostDetail 
            postId={selectedPostId} 
            onBack={handleBackToListing} 
          />
        )
      )}
    </div>
  )
}

export default Blog