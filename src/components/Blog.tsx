import React from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const Blog: React.FC = () => {
  // Mock blog data - this would come from your .NET API via GET /api/blog/posts
  const blogPosts = [
    {
      id: 1,
      title: "Hiểu đúng về HPV và tầm quan trọng của việc tầm soát",
      excerpt: "HPV là một trong những bệnh lây truyền qua đường tình dục phổ biến nhất. Tìm hiểu về các loại HPV, triệu chứng và tầm quan trọng của việc tầm soát định kỳ.",
      author: "Dr. Nguyễn Thị Lan",
      publishedDate: "2024-12-15T10:00:00Z",
      category: "Kiến Thức STIs",
      image: "/images/blog/blog-hpv-screening.jpg",
      slug: "hieu-dung-ve-hpv-va-tam-quan-trong-cua-viec-tam-soat"
    },
    {
      id: 2,
      title: "Các triệu chứng của Chlamydia bạn không nên bỏ qua",
      excerpt: "Chlamydia thường không có triệu chứng rõ ràng, nhưng nếu không được điều trị có thể gây ra những biến chứng nghiêm trọng. Tìm hiểu các dấu hiệu cảnh báo.",
      author: "Dr. Trần Văn Minh",
      publishedDate: "2024-12-12T14:30:00Z",
      category: "Kiến Thức STIs",
      image: "/images/blog/blog-chlamydia-symptoms.jpg",
      slug: "cac-trieu-chung-cua-chlamydia-ban-khong-nen-bo-qua"
    },
    {
      id: 3,
      title: "Hướng dẫn xét nghiệm STI cho người mới bắt đầu",
      excerpt: "Lần đầu tiên đi xét nghiệm STI? Đây là hướng dẫn chi tiết về quy trình, những gì cần chuẩn bị và cách hiểu kết quả xét nghiệm.",
      author: "Dr. Lê Thị Hoa",
      publishedDate: "2024-12-10T09:15:00Z",
      category: "Hướng dẫn",
      image: "/images/blog/blog-sti-testing-guide.jpg",
      slug: "huong-dan-xet-nghiem-sti-cho-nguoi-moi-bat-dau"
    },
    {
      id: 4,
      title: "Sức khỏe tình dục và tâm lý: Mối liên hệ quan trọng",
      excerpt: "Sức khỏe tình dục không chỉ về thể chất mà còn liên quan mật thiết đến tâm lý. Khám phá cách cải thiện cả hai khía cạnh này.",
      author: "Dr. Phạm Văn Đức",
      publishedDate: "2024-12-08T16:45:00Z",
      category: "Sức khỏe tổng quát",
      image: "/images/blog/blog-sexual-health-psychology.jpg",
      slug: "suc-khoe-tinh-duc-va-tam-ly-moi-lien-he-quan-trong"
    }
  ]

  return (
    <div className="bg-background-light min-h-screen">
      {/* Header Section */}
      <section className="bg-primary text-text-light py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-primary font-semibold mb-6">
            Blog & Kiến thức
          </h1>
          <p className="text-lg md:text-xl font-secondary leading-relaxed">
            Tìm hiểu sâu hơn về sức khỏe giới tính, các bệnh STIs và hướng dẫn từ chuyên gia của chúng tôi.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  // Navigate to blog post detail - will be implemented with React Router
                  console.log(`Navigate to blog post: ${post.slug}`)
                }}
              >
                {/* Blog Image */}
                <div className="h-64 bg-accent-50 flex items-center justify-center">
                  <p className="text-accent font-secondary text-center px-4">
                    [Blog Image: {post.title}]
                  </p>
                </div>
                
                {/* Blog Content */}
                <div className="p-6">
                  {/* Category Tag */}
                  <div className="mb-4">
                    <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-secondary">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-primary font-semibold text-text-dark mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="font-secondary text-text-dark mb-4 leading-relaxed text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Author and Date */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="font-secondary">
                      Tác giả: {post.author}
                    </span>
                    <span className="font-secondary">
                      {new Date(post.publishedDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  
                  {/* Read More Button */}
                  <button className="flex items-center text-primary font-secondary font-semibold hover:text-primary-600 transition-colors">
                    Đọc thêm
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-primary text-text-light px-8 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors">
              Xem thêm bài viết
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog