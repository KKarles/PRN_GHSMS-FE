import React from 'react'
import { useParams } from 'react-router-dom'
import Blog from './Blog'

const BlogRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const postId = id ? parseInt(id, 10) : undefined

  return <Blog initialPostId={postId} />
}

export default BlogRoute