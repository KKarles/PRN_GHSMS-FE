import React from 'react'
import { ArrowLeftIcon, CalendarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline'

interface BlogPostProps {
  postId?: string
}

const BlogPost: React.FC<BlogPostProps> = ({ postId }) => {
  // Mock blog post data - this would come from your .NET API via GET /api/blog/posts/{id}
  const post = {
    id: 1,
    title: "Hiểu đúng về HPV và tầm quan trọng của việc tầm soát",
    content: `
      <p>Sức khỏe sinh sản là một phần quan trọng trong cuộc sống của mỗi người. Việc hiểu rõ về cơ thể và cách chăm sóc bản thân một cách đúng đắn sẽ giúp bạn duy trì sức khỏe tốt và phòng ngừa các vấn đề có thể xảy ra.</p>
      
      <h2>Tại sao sức khỏe sinh sản quan trọng?</h2>
      <p>Sức khỏe sinh sản không chỉ liên quan đến khả năng sinh sản mà còn bao gồm sức khỏe tổng thể của hệ sinh dục. Việc chăm sóc sức khỏe sinh sản đúng cách có thể:</p>
      <ul>
        <li>Phòng ngừa các bệnh lây truyền qua đường tình dục</li>
        <li>Duy trì chu kỳ kinh nguyệt đều đặn</li>
        <li>Cải thiện chất lượng cuộc sống tình dục</li>
        <li>Hỗ trợ kế hoạch hóa gia đình</li>
      </ul>
      
      <h2>Các bước cơ bản để chăm sóc sức khỏe sinh sản</h2>
      <p>Dưới đây là những hướng dẫn cơ bản mà mọi người nên biết:</p>
      
      <h3>1. Vệ sinh cá nhân</h3>
      <p>Việc duy trì vệ sinh cá nhân đúng cách là bước đầu tiên và quan trọng nhất. Hãy nhớ:</p>
      <ul>
        <li>Tắm rửa hàng ngày với xà phòng nhẹ</li>
        <li>Thay đồ lót sạch mỗi ngày</li>
        <li>Sử dụng các sản phẩm vệ sinh phù hợp</li>
      </ul>
      
      <h3>2. Xét nghiệm định kỳ</h3>
      <p>Việc xét nghiệm định kỳ giúp phát hiện sớm các vấn đề sức khỏe. Bạn nên:</p>
      <ul>
        <li>Thực hiện xét nghiệm STI ít nhất 6 tháng một lần</li>
        <li>Khám phụ khoa định kỳ</li>
        <li>Theo dõi chu kỳ kinh nguyệt</li>
      </ul>
      
      <h3>3. Lối sống lành mạnh</h3>
      <p>Lối sống có ảnh hưởng trực tiếp đến sức khỏe sinh sản:</p>
      <ul>
        <li>Ăn uống cân bằng, đủ chất</li>
        <li>Tập thể dục đều đặn</li>
        <li>Tránh stress và nghỉ ngơi đủ giấc</li>
        <li>Hạn chế rượu bia và không hút thuốc</li>
      </ul>
      
      <h2>Khi nào cần tìm kiếm sự hỗ trợ y tế?</h2>
      <p>Bạn nên liên hệ với chuyên gia y tế khi gặp các triệu chứng sau:</p>
      <ul>
        <li>Chu kỳ kinh nguyệt bất thường</li>
        <li>Đau bụng dưới kéo dài</li>
        <li>Tiết dịch âm đạo bất thường</li>
        <li>Đau khi quan hệ tình dục</li>
        <li>Các triệu chứng nhiễm trùng</li>
      </ul>
      
      <h2>Kết luận</h2>
      <p>Chăm sóc sức khỏe sinh sản là một quá trình liên tục và cần sự chú ý đặc biệt. Hãy luôn lắng nghe cơ thể mình và không ngần ngại tìm kiếm sự hỗ trợ từ các chuyên gia y tế khi cần thiết.</p>
      
      <p>Tại GHSMS, chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe sinh sản chất lượng cao với sự bảo mật và thấu hiểu. Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.</p>
    `,
    author: "Dr. Nguyễn Thị Lan",
    date: "15 Tháng 12, 2024",
    readTime: "8 phút đọc",
    category: "Sức khỏe sinh sản",
    image: "/images/blog/blog-featured-reproductive-health.jpg",
    tags: ["sức khỏe sinh sản", "chăm sóc cá nhân", "xét nghiệm", "phòng ngừa"]
  }

  const relatedPosts = [
    {
      id: 2,
      title: "Xét nghiệm STI: Những điều cần biết",
      image: "/images/blog/blog-thumbnail-sti-testing.jpg",
      readTime: "6 phút đọc"
    },
    {
      id: 3,
      title: "Theo dõi chu kỳ kinh nguyệt hiệu quả",
      image: "/images/blog/blog-thumbnail-menstrual-cycle.jpg",
      readTime: "5 phút đọc"
    }
  ]

  return (
    <div className="bg-background-light min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button className="flex items-center text-primary font-secondary hover:text-primary-600 transition-colors">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Quay lại Blog
        </button>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="mb-8">
            <div className="bg-accent-50 rounded-2xl h-96 flex items-center justify-center">
              <p className="text-accent font-secondary text-lg">[Featured Article Image]</p>
            </div>
          </div>

          {/* Article Meta */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-primary text-text-light px-3 py-1 rounded-full text-sm font-secondary">
                {post.category}
              </span>
              <div className="flex items-center text-gray-500 text-sm font-secondary">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {post.date}
              </div>
              <div className="flex items-center text-gray-500 text-sm font-secondary">
                <ClockIcon className="h-4 w-4 mr-1" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-primary font-semibold text-text-dark mb-4">
              {post.title}
            </h1>

            <div className="flex items-center space-x-2 mb-6">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="font-secondary text-gray-600">{post.author}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-subtle mb-12">
            <div 
              className="prose prose-lg max-w-none font-secondary text-text-dark leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Related Posts */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-subtle">
            <h3 className="text-xl font-primary font-semibold text-text-dark mb-6">
              Bài viết liên quan
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="flex space-x-4">
                  <div className="w-24 h-24 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <p className="text-accent font-secondary text-xs text-center">[Thumbnail]</p>
                  </div>
                  <div>
                    <h4 className="font-primary font-semibold text-text-dark mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="font-secondary text-gray-600 text-sm">
                      {relatedPost.readTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default BlogPost