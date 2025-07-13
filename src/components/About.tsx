import React from 'react'
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const About: React.FC = () => {
  const values = [
    {
      icon: HeartIcon,
      title: "Chăm Sóc Tận Tâm",
      description: "Chúng tôi đặt sức khỏe và cảm xúc của bạn lên hàng đầu, với sự chăm sóc chu đáo trong từng dịch vụ."
    },
    {
      icon: ShieldCheckIcon,
      title: "Bảo Mật Tuyệt Đối",
      description: "Thông tin và kết quả của bạn được bảo vệ với công nghệ mã hóa tiên tiến và quy trình bảo mật nghiêm ngặt."
    },
    {
      icon: UserGroupIcon,
      title: "Đội Ngũ Chuyên Nghiệp",
      description: "Các bác sĩ và chuyên gia có kinh nghiệm lâu năm trong lĩnh vực sức khỏe sinh sản và y học giới tính."
    },
    {
      icon: ClockIcon,
      title: "Dịch Vụ Nhanh Chóng",
      description: "Kết quả xét nghiệm trong 1-3 ngày làm việc và hỗ trợ tư vấn 24/7 khi cần thiết."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Khách hàng tin tưởng" },
    { number: "5+", label: "Năm kinh nghiệm" },
    { number: "98%", label: "Độ hài lòng khách hàng" },
    { number: "24/7", label: "Hỗ trợ khẩn cấp" }
  ]

  const team = [
    {
      name: "BS. Nguyễn Thị Lan",
      role: "Giám đốc Y khoa",
      specialization: "Sản phụ khoa - 15 năm kinh nghiệm",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      name: "BS. Trần Văn Minh",
      role: "Bác sĩ Tư vấn",
      specialization: "Y học giới tính - 12 năm kinh nghiệm",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      name: "BS. Lê Thị Hương",
      role: "Chuyên gia Tư vấn",
      specialization: "Sức khỏe sinh sản - 10 năm kinh nghiệm",
      image: "https://t4.ftcdn.net/jpg/03/20/74/45/360_F_320744517_TaGkT7aRlqqWdfGUuzRKDABtFEoN5CiO.jpg"
    }
  ]

  const testimonials = [
    {
      name: "Minh Anh",
      text: "Dịch vụ chuyên nghiệp và kín đáo. Tôi cảm thấy rất thoải mái và được hỗ trợ tận tình từ đội ngũ y tế.",
      rating: 5
    },
    {
      name: "Thanh Hoa",
      text: "Kết quả xét nghiệm nhanh chóng và chính xác. Bác sĩ tư vấn rất chi tiết và dễ hiểu.",
      rating: 5
    },
    {
      name: "Quang Huy",
      text: "Hệ thống đặt lịch online rất tiện lợi. Không phải chờ đợi lâu và được chăm sóc chu đáo.",
      rating: 5
    }
  ]

  return (
    <div className="bg-background-light min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary via-primary-600 to-accent">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-primary font-semibold text-white mb-6">
                Về Chúng Tôi
              </h1>
              <p className="text-lg font-secondary text-white/90 mb-8 leading-relaxed">
                Chúng tôi là trung tâm chăm sóc sức khỏe giới tính và sinh sản hàng đầu, 
                cam kết mang đến dịch vụ y tế chất lượng cao trong môi trường an toàn và bảo mật.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-primary font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="font-secondary text-white/80 text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="https://www.news-medical.net/images/Article_Images/ImageForArticle_25687_17369485484356911.jpg"
                alt="Modern healthcare facility"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-primary font-semibold text-text-dark mb-6">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-lg font-secondary text-gray-600 leading-relaxed mb-8">
              Chúng tôi tin rằng mọi người đều có quyền được tiếp cận với dịch vụ chăm sóc sức khỏe 
              sinh sản chất lượng cao, được cung cấp trong môi trường tôn trọng, không phán xét và bảo mật. 
              Sứ mệnh của chúng tôi là trao quyền cho cá nhân để họ có thể đưa ra những quyết định 
              sáng suốt về sức khỏe của mình thông qua giáo dục, xét nghiệm và tư vấn chuyên nghiệp.
            </p>
            <div className="bg-primary-light rounded-2xl p-8">
              <blockquote className="text-xl font-primary font-semibold text-primary italic">
                "Đến để xét nghiệm, ở lại vì sự thấu hiểu - đó là cam kết của chúng tôi 
                với từng khách hàng."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-primary font-semibold text-text-dark mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="font-secondary text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-border-subtle">
                <div className="bg-primary-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-primary font-semibold text-text-dark mb-3">
                  {value.title}
                </h3>
                <p className="font-secondary text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-primary font-semibold text-text-dark mb-4">
              Đội Ngũ Chuyên Gia
            </h2>
            <p className="font-secondary text-gray-600 max-w-2xl mx-auto">
              Các bác sĩ và chuyên gia giàu kinh nghiệm, tận tâm với công việc chăm sóc sức khỏe của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border-subtle">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-primary font-semibold text-text-dark mb-2">
                    {member.name}
                  </h3>
                  <p className="font-secondary text-primary font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="font-secondary text-gray-600 text-sm">
                    {member.specialization}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-primary font-semibold text-text-dark mb-4">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <p className="font-secondary text-gray-600 max-w-2xl mx-auto">
              Những phản hồi chân thực từ khách hàng đã sử dụng dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <StarIcon key={starIndex} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="font-secondary text-gray-600 italic mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="font-primary font-semibold text-text-dark">
                  - {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-primary font-semibold text-text-dark mb-6">
                Cơ Sở Vật Chất Hiện Đại
              </h2>
              <p className="font-secondary text-gray-600 mb-6 leading-relaxed">
                Chúng tôi đầu tư vào công nghệ và trang thiết bị y tế tiên tiến nhất 
                để đảm bảo độ chính xác cao trong xét nghiệm và chăm sóc tốt nhất cho khách hàng.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="font-secondary text-text-dark">Phòng xét nghiệm đạt tiêu chuẩn quốc tế</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="font-secondary text-text-dark">Hệ thống bảo mật thông tin tiên tiến</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="font-secondary text-text-dark">Phòng tư vấn riêng tư và thoải mái</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="font-secondary text-text-dark">Quy trình vệ sinh và khử trùng nghiêm ngặt</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Modern laboratory"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
                  alt="Consultation room"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden col-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Medical facility interior"
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-primary font-semibold text-white mb-6">
            Bắt Đầu Hành Trình Chăm Sóc Sức Khỏe Cùng Chúng Tôi
          </h2>
          <p className="font-secondary text-white/90 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn và đặt lịch hẹn với đội ngũ chuyên gia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-full font-secondary font-bold hover:bg-gray-100 transition-colors">
              Liên Hệ Ngay
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-secondary font-bold hover:bg-white hover:text-primary transition-colors">
              Xem Dịch Vụ
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About