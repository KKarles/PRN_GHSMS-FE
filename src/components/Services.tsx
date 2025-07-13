import React from 'react'
import { CheckIcon, ClockIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const Services: React.FC = () => {
  const navigate = useNavigate()

  const stiServices = [
    {
      name: "Gói Cơ Bản STIs",
      price: "850.000 VND",
      tests: ["HIV", "Giang mai (Syphilis)", "Lậu (Gonorrhea)", "Chlamydia"],
      description: "Kiểm tra 4 bệnh lây truyền qua đường tình dục phổ biến nhất",
      duration: "2-3 ngày",
      popular: false
    },
    {
      name: "Gói Toàn Diện STIs",
      price: "1.450.000 VND",
      tests: ["HIV", "Giang mai", "Lậu", "Chlamydia", "Herpes (HSV-1, HSV-2)", "Viêm gan B", "Viêm gan C"],
      description: "Kiểm tra đầy đủ các bệnh lây truyền qua đường tình dục quan trọng",
      duration: "2-3 ngày",
      popular: true
    },
    {
      name: "Gói Nâng Cao STIs",
      price: "1.850.000 VND",
      tests: ["Tất cả gói Toàn Diện", "HPV", "Trichomonas", "Mycoplasma", "Ureaplasma"],
      description: "Gói kiểm tra toàn diện nhất với các xét nghiệm chuyên sâu",
      duration: "3-5 ngày",
      popular: false
    }
  ]

  const consultationServices = [
    {
      name: "Tư Vấn Sức Khỏe Sinh Sản",
      price: "300.000 VND / 45 phút",
      description: "Tư vấn về sức khỏe sinh sản, kế hoạch hóa gia đình, và các vấn đề liên quan",
      includes: ["Tư vấn 1-1 với chuyên gia", "Đánh giá sức khỏe tổng quát", "Kế hoạch chăm sóc cá nhân"],
      availability: "Thứ 2 - Thứ 6: 8:00 - 17:00"
    },
    {
      name: "Tư Vấn Kết Quả Xét Nghiệm",
      price: "200.000 VND / 30 phút",
      description: "Giải thích chi tiết kết quả xét nghiệm và tư vấn phương án điều trị",
      includes: ["Phân tích kết quả chi tiết", "Tư vấn điều trị", "Hướng dẫn theo dõi"],
      availability: "Thứ 2 - Thứ 6: 8:00 - 17:00"
    },
    {
      name: "Tư Vấn Khẩn Cấp",
      price: "500.000 VND / 30 phút",
      description: "Tư vấn nhanh cho các tình huống cần xử lý khẩn cấp",
      includes: ["Tư vấn ngay lập tức", "Hỗ trợ 24/7", "Kết nối với bác sĩ chuyên khoa"],
      availability: "24/7"
    }
  ]

  const additionalServices = [
    {
      name: "Theo Dõi Chu Kỳ Kinh Nguyệt",
      price: "Miễn phí",
      description: "Công cụ theo dõi chu kỳ với nhắc nhở thông minh",
      features: ["Dự đoán chu kỳ", "Nhắc nhở uống thuốc", "Theo dõi triệu chứng", "Báo cáo sức khỏe"]
    },
    {
      name: "Chăm Sóc Sau Xét Nghiệm",
      price: "Miễn phí",
      description: "Hỗ trợ và theo dõi sau khi có kết quả xét nghiệm",
      features: ["Giải thích kết quả", "Tư vấn bước tiếp theo", "Kết nối với bác sĩ", "Hỗ trợ tâm lý"]
    }
  ]

  return (
    <div className="bg-background-light min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary-600">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-primary font-semibold text-white mb-6">
            Dịch Vụ Chăm Sóc Sức Khỏe
          </h1>
          <p className="text-lg md:text-xl font-secondary text-white/90 mb-8 leading-relaxed">
            Chúng tôi cung cấp các dịch vụ xét nghiệm và tư vấn chuyên nghiệp, 
            bảo mật và đáng tin cậy cho sức khỏe sinh sản của bạn.
          </p>
        </div>
      </section>

      {/* STI Testing Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-primary font-semibold text-text-dark mb-4">
              Xét Nghiệm STIs
            </h2>
            <p className="font-secondary text-gray-600 max-w-2xl mx-auto">
              Các gói xét nghiệm bệnh lây truyền qua đường tình dục được thiết kế 
              để phù hợp với nhu cầu và ngân sách của bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {stiServices.map((service, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${
                  service.popular ? 'border-primary' : 'border-border-subtle'
                } hover:shadow-md transition-shadow relative`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-secondary font-bold">
                      Phổ biến nhất
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-primary font-semibold text-text-dark mb-2">
                    {service.name}
                  </h3>
                  <div className="text-3xl font-primary font-bold text-primary mb-2">
                    {service.price}
                  </div>
                  <div className="flex items-center justify-center text-gray-500 text-sm">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Kết quả trong {service.duration}
                  </div>
                </div>

                <p className="font-secondary text-gray-600 text-center mb-6">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6">
                  {service.tests.map((test, testIndex) => (
                    <div key={testIndex} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="font-secondary text-text-dark">{test}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate('/book-service')}
                  className={`w-full py-3 rounded-lg font-secondary font-bold transition-colors ${
                    service.popular
                      ? 'bg-primary text-white hover:bg-primary-600'
                      : 'bg-white border-2 border-primary text-primary hover:bg-primary-light'
                  }`}
                >
                  Đặt Lịch Ngay
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-blue-50 rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-primary font-semibold text-text-dark">
                  Cam Kết Bảo Mật
                </h3>
              </div>
              <p className="font-secondary text-gray-600">
                Tất cả thông tin và kết quả xét nghiệm được bảo mật tuyệt đối. 
                Chỉ bạn mới có thể truy cập vào kết quả của mình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Services */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-primary font-semibold text-text-dark mb-4">
              Dịch Vụ Tư Vấn
            </h2>
            <p className="font-secondary text-gray-600 max-w-2xl mx-auto">
              Kết nối với các chuyên gia sức khỏe để được tư vấn và hỗ trợ cá nhân hóa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {consultationServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                <h3 className="text-xl font-primary font-semibold text-text-dark mb-3">
                  {service.name}
                </h3>
                <div className="text-2xl font-primary font-bold text-primary mb-4">
                  {service.price}
                </div>
                <p className="font-secondary text-gray-600 mb-6">
                  {service.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {service.includes.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="font-secondary text-sm text-text-dark">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-500 mb-6">
                  <strong>Thời gian:</strong> {service.availability}
                </div>

                <button 
                  onClick={() => navigate('/login', { state: { redirectTo: '/dashboard', activeView: 'appointment-booking' } })}
                  className="w-full bg-primary text-white py-3 rounded-lg font-secondary font-bold hover:bg-primary-600 transition-colors"
                >
                  Đặt Lịch Tư Vấn
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-primary font-semibold text-text-dark mb-4">
              Dịch Vụ Bổ Sung
            </h2>
            <p className="font-secondary text-gray-600 max-w-2xl mx-auto">
              Các công cụ và dịch vụ hỗ trợ giúp bạn quản lý sức khỏe hiệu quả hơn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-primary font-semibold text-text-dark">
                    {service.name}
                  </h3>
                  <span className="text-lg font-primary font-bold text-green-600">
                    {service.price}
                  </span>
                </div>
                
                <p className="font-secondary text-gray-600 mb-6">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="font-secondary text-sm text-text-dark">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-primary font-semibold text-white mb-6">
            Sẵn sàng bắt đầu chăm sóc sức khỏe của bạn?
          </h2>
          <p className="font-secondary text-white/90 mb-8 max-w-2xl mx-auto">
            Đặt lịch ngay hôm nay để được tư vấn và xét nghiệm với đội ngũ chuyên gia của chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/book-service')}
              className="bg-white text-primary px-8 py-4 rounded-full font-secondary font-bold hover:bg-gray-100 transition-colors"
            >
              Đặt Lịch Xét Nghiệm
            </button>
            <button 
              onClick={() => navigate('/login', { state: { redirectTo: '/dashboard', activeView: 'appointment-booking' } })}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-secondary font-bold hover:bg-white hover:text-primary transition-colors"
            >
              Đặt Lịch Tư Vấn
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services